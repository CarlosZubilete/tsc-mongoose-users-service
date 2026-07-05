import { AppError } from "./app-error";
import { ErrorCode } from "./error-code";

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(404, "Bad Request Error", ErrorCode.BAD_REQUEST, message);
    }
}
