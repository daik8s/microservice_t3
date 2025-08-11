import { GetOrderDetails } from "../utils";

export const CreatePayment = async (userId: number, orderId: number, paymentGateway: unknown) => {
    // get order details from order service
    const order = await GetOrderDetails(orderId);
    if(order.customerId !== userId) {
        throw new Error("user not authorized to create payment");
    }

    // create a new payment record

    // call payment gateway to create payment

    // amount has to be fetched from the order service
    return {
        secret: "1234567890",
        publicKey: "1234567890",
        amount: 100,
    }
}

export const VerifyPayment = async (paymentId: number, paymentGateway: unknown) => {
    // call payment Gateway to verify payment

    // update order status through message broker
}   