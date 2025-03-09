import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.dto";

const router = express.Router();
const repo = repository.CartRepository;

router.post("/cart", async (req: Request, res: Response, _: NextFunction) => {
  try {
    console.log(req.body);
    const error = ValidateRequest<CartRequestInput>(req.body, CartRequestSchema);
    
    if(error) {
        res.status(404).json({ error }); 
        return
    }

    const response = await service.CreateCart(req.body as CartRequestInput, repo);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ error });
  }
});

router.get("/cart", async (req: Request, res: Response, _: NextFunction) => {
  const response = await service.GetCart(req.body, repo);
  res.status(200).json(response);
});

router.patch("/cart", async (req: Request, res: Response, _: NextFunction) => {
  const response = await service.EditCart(req.body, repo);
  res.status(200).json(response);
});

router.delete("/cart", async (req: Request, res: Response, _: NextFunction) => {
  const response = await service.DeleteCart(req.body, repo);
  res.status(200).json(response);
});

export default router;
