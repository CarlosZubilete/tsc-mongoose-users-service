import { AppError } from "./app-error";
import { ErrorCode } from "./error-code";

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(403, "Forbidden Error", ErrorCode.FORBIDDEN, message);
    }
}
