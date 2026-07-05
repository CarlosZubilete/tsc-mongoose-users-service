import { ZodError } from "zod";
import { AppError } from "./app-error";
import { ErrorCode } from "./error-code";

interface ErrorMessages {
    field: string;
    message: string;
}

export class UnprocessableContentError extends AppError {
    constructor(zod_error: ZodError) {
        // Get the message error from Zod.
        const errorMessages: ErrorMessages[] = zod_error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
        }));

        super(
            422,
            "Unprocessable Content Error",
            ErrorCode.UNPROCESSABLE_CONTENT,
            errorMessages.toString(),
        );
    }
}
