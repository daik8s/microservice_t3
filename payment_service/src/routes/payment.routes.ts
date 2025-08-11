import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
import * as service from "../service/payment.service";
import { RequestAuthorizer } from "./middleware";

const PaymentGateway = {};

router.post("/create-payment", RequestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        next(new Error("user not found"));
        return;
    }

    try {
        const { orderNumber } = req.body
        const response = await service.CreatePayment(user.id, orderNumber, PaymentGateway);
        res.status(200).json({ message: "Payment successful", data: response });
    } catch (error) {
        next(error);
    }

});

router.get("/verify-payment/:id", RequestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
        next(new Error("user not found"));
        return;
    }

    const paymentId = req.params.id;
    if (!paymentId) {
        next(new Error("payment id not found"));
        return;
    }
    try {
        await service.VerifyPayment(+paymentId, PaymentGateway);
        res.status(200).json({ message: "Payment verification completed" });
    } catch (error) {
        next(error);
    }
});

export default router;