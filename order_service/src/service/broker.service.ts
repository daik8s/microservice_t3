import { Consumer, Producer } from "kafkajs";
import { MessageBroker } from "../utils";
import { HandleSubscription } from "./order.service";
import { OrderEvent } from "../types";

// initialize kafka broker
export const InitKafkaBroker = async () => {
    const producer = await MessageBroker.connectProducer<Producer>();
    producer.on("producer.connect", () => {
        console.log("Order Service: producer connected");
    })
    const consumer = await MessageBroker.connectConsumer<Consumer>();
    consumer.on("consumer.connect", () => {
        console.log("Order Service: consumer connected");
    })
    await MessageBroker.subscribe(HandleSubscription, "OrderEvents");
}
// keep listening to consumer events
export const SendCreateOrderMessage = async (data: any) => {
    await MessageBroker.publish({
        event: OrderEvent.CREATE_ORDER,
        topic: "CatalogEvents",
        headers: {},
        message: data,
    });
}
// perform actions based on the event
export const SendOrderCancelledMessage = async (data: any) => {
    await MessageBroker.publish({
        event: OrderEvent.CANCEL_ORDER,
        topic: "CatalogEvents",
        headers: {},
        message: data,
    });
}
// publish dedicated events based on usecases

// disconnect from kafka broker





