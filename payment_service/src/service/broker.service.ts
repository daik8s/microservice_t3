import { Producer } from "kafkajs";
import { MessageBroker } from "../utils";
import { PaymentEvent } from "../types";

// initialize kafka broker
export const InitKafkaBroker = async () => {
    const producer = await MessageBroker.connectProducer<Producer>();
    producer.on("producer.connect", () => {
        console.log("Payment Service: producer connected");
    })
}

// perform actions based on the event
export const SendPaymentUpdateMessage = async (data: unknown) => {
    await MessageBroker.publish({
        event: PaymentEvent.UPDATE_PAYMENT,
        topic: "OrderEvents",
        headers: {},
        message: {
            data,
        },
    });
}
// publish dedicated events based on usecases

// disconnect from kafka broker





