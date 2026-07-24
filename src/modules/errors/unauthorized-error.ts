import { AppError } from "./app-error";
import { ErrorCode } from "./error-code";

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(401, "Unauthorized Error", ErrorCode.UNAUTHORIZED, message);
    }
}
