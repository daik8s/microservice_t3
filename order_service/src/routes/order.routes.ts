import express, { NextFunction, Request, Response } from 'express'
import { MessageBroker } from '../utils';
import { OrderEvent } from '../types';

const router = express.Router();

router.post("/order", async (req: Request, res: Response, _: NextFunction) => {
    await MessageBroker.publish({
        topic: "OrderEvents",
        headers: {
            token: req.headers.authorization,
        },
        event: OrderEvent.CREATE_ORDER,
        message: {
            orderId: 1,
            items: [
                {
                    productId: 1,
                    quantity: 1,
                }
            ]
        }
    })
    res.status(200).json({ message: 'create order' })
})

router.get("/order", async (req: Request, res: Response, _: NextFunction) => {
    res.status(200).json({ message: 'create order' })
})


router.get("/order/:id", async (req: Request, res: Response, _: NextFunction) => {
    res.status(200).json({ message: 'create order' })
})

router.patch("/order", async (req: Request, res: Response, _: NextFunction) => {
    res.status(200).json({ message: 'create order' })
})

router.delete("/order/:id", async (req: Request, res: Response, _: NextFunction) => {
    res.status(200).json({ message: 'create order' })
})


export default router