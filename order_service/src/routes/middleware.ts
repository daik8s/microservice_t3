import { NextFunction, Request, Response } from "express";
import { ValidateUser } from "../utils";

export const RequestAuthorizer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        if(!req.headers.authorization) {
            res.status(403).json({ error: "Unauthorized due to missing token"})
        }
        const userData = await ValidateUser(req.headers.authorization as string);
        req.user = userData;
        next();
    } catch (error) {
        res.status(403).json({ error: "Unauthorized"})
    }
  };