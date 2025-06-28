import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto"
import { CartRepositoryType } from "../repository/cart.repository";
import { AuthorizeError, logger, NotFoundError } from "../utils";
import { GetProductDetails, GetStockDetails } from "../utils/broker"
import { CartLineItem } from "../db/schema/cart";

export const CreateCart = async (input: CartRequestInput & { customerId: number }, repo: CartRepositoryType) => {
    // get product details from catalog service
    const product = await GetProductDetails(input.productId);
    logger.info(product);

    if (product.stock > input.qty) {
        throw new NotFoundError("product is out of stock");
    }

    // find if the product is already in the cart
    const lineItem = await repo.findCartByProductId(input.customerId, input.productId);
    if (lineItem) {
        return repo.updateCart(lineItem.id, lineItem.qty + input.qty);
    }

    const data = await repo.createCart(input.customerId, {
        productId: input.productId,
        qty: input.qty,
        itemName: product.name,
        price: product.price.toString(),
        variant: product.variant,
    } as CartLineItem);

    return data
}

export const GetCart = async (id: number, repo: CartRepositoryType) => {
    // get customer cart data
    const cart = await repo.findCart(id)
    if (!cart) {
        throw new NotFoundError("cart does not exist")
    }
    // list out all line items in the cart
    const lineItems = cart.lineItems;
    if (!lineItems.length) {
        throw new NotFoundError("cart does not have any line items")
    }

    // verify with inventory service if the product is still available
    const stockDetails = await GetStockDetails(lineItems.map(item => item.productId))
    if (Array.isArray(stockDetails) && stockDetails.length) {
        lineItems.forEach(item => {
            const stockItem = stockDetails.find(detail => detail.id === item.productId)
            if (stockItem) {
                item.availability = stockItem.stock
            }
        })
        cart.lineItems = lineItems
    }

    return cart
}

const AuthorisedCart = async (
    lineItemId: number,
    customerId: number,
    repo: CartRepositoryType
  ) => {
    const cart = await repo.findCart(customerId);
    if (!cart) {
      throw new NotFoundError("cart does not exist");
    }
  
    const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
    if (!lineItem) {
      throw new AuthorizeError("you are not authorized to edit this cart");
    }
  
    return lineItem;
};

export const EditCart = async (input: CartEditRequestInput & { customerId: number }, repo: CartRepositoryType) => {
    await AuthorisedCart(input.id, input.customerId, repo);
    const data = await repo.updateCart(input.id, input.qty)
    return data
}

export const DeleteCart = async (input: { id: number, customerId: number }, repo: CartRepositoryType) => {
    await AuthorisedCart(input.id, input.customerId, repo);
    const data = await repo.deleteCart(input.id)
    return data
}

