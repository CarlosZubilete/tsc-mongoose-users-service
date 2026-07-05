export enum ErrorCode {
    // 2xx
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,

    // 4xx
    BAD_REQUEST = 400,
    // UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_CONTENT = 422,
    // 5xx
    INTERNAL_SERVER_ERROR = 500,
}
