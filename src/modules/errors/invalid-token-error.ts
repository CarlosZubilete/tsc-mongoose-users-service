import { AppError } from "./app-error";
import { ErrorCode } from "./error-code";

export class InvalidTokenError extends AppError {
    constructor(message: string) {
        super(498, "Invalid Token Error", ErrorCode.INVALID_TOKEN, message);
    }
}
