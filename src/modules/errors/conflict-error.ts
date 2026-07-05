import { AppError } from "./app-error";
import { ErrorCode } from "./error-code";

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, "Conflict Error", ErrorCode.CONFLICT, message);
    }
}
