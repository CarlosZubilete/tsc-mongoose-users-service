import { ErrorCode } from "./error-code";

export class AppError extends Error {
    public readonly status: number;
    public readonly error: string;
    public readonly errorCode: ErrorCode;

    constructor(
        status: number,
        error: string,
        errorCode: ErrorCode,
        message: string,
    ) {
        super(message);
        this.status = status;
        this.error = error;
        this.errorCode = errorCode;

        // Restores the prototype chain (Necessary in TypeScript when extending built-ins)
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
