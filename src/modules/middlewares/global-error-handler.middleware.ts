import { AppError } from "@errors/app-error";
import { ErrorResponse } from "@errors/error-response";
import { ErrorCode } from "@errors/error-code";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const GlobalErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    _: NextFunction,
) => {
    // Value by default: Internal server error
    let status = 500;
    let errorType = "Internal Server Error";
    let errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
    let message = "An unexpected error on the server";

    // Custom Errors
    if (error instanceof AppError) {
        status = error.status;
        errorType = error.error;
        errorCode = error.errorCode;
        message = error.message;
    }

    // Error from zod.
    if (error instanceof ZodError) {
        const validationErrors = error.issues.map(
            (e) => `${e.path.join(".")}: ${e.message}`,
        );
        return res.status(422).json({
            status: 422,
            errorType: "Validation Error",
            message: "Invalid input data",
            errors: validationErrors,
        });
    }

    // Built the custom response
    const errorResponse: ErrorResponse = {
        timestamp: new Date().toISOString(),
        errorCode: errorCode,
        status,
        errorType: errorType,
        message,
        path: req.originalUrl,
    };

    // Print the real error (it's just dev/debug)
    console.error(`[ERROR] ${req.method} ${req.originalUrl} >>`, error);

    res.status(status).json(errorResponse);
};
