import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto"
import { CartRepositoryType } from "../repository/cart.repository";
import { logger, NotFoundError } from "../utils";
import { GetProductDetails } from "../utils/broker"
import { CartLineItem } from "../db/schema/cart";

export const CreateCart = async (input: CartRequestInput, repo: CartRepositoryType) => {
    const product = await GetProductDetails(input.productId);
    logger.info(product);
    if (product.stock > input.qty) {
        throw new NotFoundError("product is out of stock");
    }
    const data = await repo.createCart(input.productId, {
        productId: input.productId,
        qty: input.qty,
        itemName: product.name,
        price: product.price.toString(),
        variant: product.variant,
    } as CartLineItem);
    return data
}

export const GetCart = async (id: number, repo: CartRepositoryType) => {
    const data = await repo.findCart(id)
    if(!data) {
        throw new NotFoundError("cart not found")
    }
    return data
}

export const EditCart = async (input: CartEditRequestInput, repo: CartRepositoryType) => {
    const data = await repo.updateCart(input.id, input.qty)
    return data
}

export const DeleteCart = async (id: number, repo: CartRepositoryType) => {
    const data = await repo.deleteCart(id)
    return data
}
