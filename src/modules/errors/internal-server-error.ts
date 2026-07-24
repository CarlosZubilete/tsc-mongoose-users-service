import { AppError } from "./app-error";
import { ErrorCode } from "./error-code";

export class InternalServerError extends AppError {
    constructor(message: string) {
        super(
            500,
            "Internal Server Error",
            ErrorCode.INTERNAL_SERVER_ERROR,
            message,
        );
    }
}
