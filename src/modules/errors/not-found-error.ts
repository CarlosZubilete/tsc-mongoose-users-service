import { AppError } from "./app-error";
import { ErrorCode } from "./error-code";

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(404, "Not Found Error", ErrorCode.NOT_FOUND, message);
    }
}
