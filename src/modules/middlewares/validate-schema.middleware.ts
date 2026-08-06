import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";

export const ValidateSchema = (schema: ZodTypeAny) => {
    return (req: Request, _: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) next(error);
            next(error);
        }
    };
};
