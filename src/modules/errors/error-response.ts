import { ErrorCode } from "./error-code";

export interface ErrorResponse {
    timestamp: string;
    errorCode: ErrorCode;
    status: number;
    errorType: string;
    message: string;
    path: string;
}
