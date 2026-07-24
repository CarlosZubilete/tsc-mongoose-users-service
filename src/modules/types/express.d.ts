import { User } from "@models/user.model";

declare global {
    namespace Express {
        interface Request {
            user_id: string;
            token_verified: string;
        }

    }
}
