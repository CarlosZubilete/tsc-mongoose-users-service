import { BadRequestError } from "@errors/bad-request-error";
import { InternalServerError } from "@errors/internal-server-error";
import { NotFoundError } from "@errors/not-found-error";
import { AuthLogin } from "@models/auth.model";
import { Request, Response } from "express";
import { IAuthService } from "@services/auth.service";
import { IUserService } from "@services/user.service";
import { UserCreate } from "@models/user.model";

export class AuthController {
    private service: IAuthService;
    private userService: IUserService;

    constructor(authService: IAuthService, userService: IUserService) {
        this.service = authService;
        this.userService = userService;
    }

    public register = async (req: Request, res: Response) => {
        const newUser = req.body as UserCreate;

        const created = await this.userService.createUser(newUser);

        res.status(201).json(created);
    };

    public login = async (req: Request, res: Response) => {
        // Valid Data...
        const authLogin = req.body as AuthLogin;

        const newAuth = await this.service.login(authLogin);
        // create the auth
        res.status(201).json(newAuth);
    };

    public logout = async (req: Request, res: Response) => {
        const token = req.token_verified as string;

        await this.service.logout(token);

        res.status(201).json({ message: "Logout successfully" });
    };
}
