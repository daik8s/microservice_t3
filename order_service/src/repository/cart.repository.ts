import { DB } from "../db/db.connection";
import { Cart, CartLineItem, cartLineItems, carts } from "../db/schema";
import { CartWithLineItems } from "../dto/cartRequest.dto";
import { NotFoundError } from "../utils";
import { eq } from "drizzle-orm";

// declare repository type
export type CartRepositoryType = {
  createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
  findCart: (id: number) => Promise<CartWithLineItems>;
  updateCart: (id: number, qty: number) => Promise<CartLineItem>;
  deleteCart: (id: number) => Promise<Boolean>;
  clearCartData: (id: number) => Promise<Boolean>;
  findCartByProductId: (
    customerId: number,
    productId: number
  ) => Promise<CartLineItem>;
};

const createCart = async (
  customerId: number,
  { itemName, price, productId, qty, variant }: CartLineItem
): Promise<number> => {
  const result = await DB.insert(carts)
    .values({
      customerId: customerId,
    })
    .returning()
    .onConflictDoUpdate({
      target: carts.customerId,
      set: { updatedAt: new Date() },
    });

  const [{ id }] = result;

  if (id > 0) {
    await DB.insert(cartLineItems).values({
      cartId: id,
      productId: productId,
      itemName: itemName,
      price: price,
      qty: qty,
      variant: variant,
    });
  }
  return id;
};

/*
VIETNAMESE EXPLANATION:
Hàm findCart nhận vào một tham số id kiểu number và trả về Promise chứa đối tượng CartWithLineItems
- Sử dụng DB.query.carts.findFirst để tìm giỏ hàng đầu tiên thỏa điều kiện
- where: Điều kiện tìm kiếm là customerId bằng với id được truyền vào
- with: Lấy thêm thông tin các lineItems liên quan đến cart
- Nếu không tìm thấy cart, ném ra lỗi NotFoundError
- Trả về đối tượng cart nếu tìm thấy

ENGLISH EXPLANATION:
The findCart function takes an id parameter of type number and returns a Promise containing CartWithLineItems
- Uses DB.query.carts.findFirst to find the first cart matching the condition
- where: Search condition is customerId equals the provided id
- with: Also fetches related lineItems information for the cart
- If cart is not found, throws NotFoundError
- Returns the cart object if found
*/
const findCart = async (id: number): Promise<CartWithLineItems> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, id),
    with: {
      lineItems: true,
    },
  });

  if (!cart) {
    throw new NotFoundError("cart not found");
  }

  return cart;
};

const updateCart = async (id: number, qty: number): Promise<CartLineItem> => {
  const [cartLineItem] = await DB.update(cartLineItems)
    .set({
      qty: qty,
    })
    .where(eq(cartLineItems.id, id))
    .returning();
  return cartLineItem;
};

const deleteCart = async (id: number): Promise<boolean> => {
  console.log("Proposed ID", id);
  await DB.delete(cartLineItems).where(eq(cartLineItems.id, id)).returning();
  return true;
};

const clearCartData = async (id: number): Promise<boolean> => {
  await DB.delete(carts).where(eq(carts.id, id)).returning();
  return true;
};

const findCartByProductId = async (
  customerId: number,
  productId: number
): Promise<CartLineItem> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, customerId),
    with: {
      lineItems: true,
    },
  });

  const lineItem = cart?.lineItems.find((item) => item.productId === productId);

  return lineItem as CartLineItem;
};

export const CartRepository: CartRepositoryType = {
  createCart,
  findCart,
  updateCart,
  deleteCart,
  clearCartData,
  findCartByProductId,
};