import express, { NextFunction, Request, Response } from 'express'

const router = express.Router();

router.post("/order", async (req: Request, res: Response, _ : NextFunction) => {
    res.status(200).json({ message: 'create order' })
})

router.get("/order", async (req: Request, res: Response, _ : NextFunction) => {
    res.status(200).json({ message: 'create order' })
})


router.get("/order/:id", async (req: Request, res: Response, _ : NextFunction) => {
    res.status(200).json({ message: 'create order' })
})

router.patch("/order", async (req: Request, res: Response, _ : NextFunction) => {
    res.status(200).json({ message: 'create order' })
})

router.delete("/order/:id", async (req: Request, res: Response, _ : NextFunction) => {
    res.status(200).json({ message: 'create order' })
})


export default router