import { BadRequestError } from "@errors/bad-request-error";
import { InternalServerError } from "@errors/internal-server-error";
import { NotFoundError } from "@errors/not-found-error";
import { AuthLogin } from "@models/auth.model";
import { Request, Response } from "express";
import { IAuthService } from "@services/auth.service";
import { IUserService } from "@services/user.service";
import { ConflictError } from "@errors/conflict-error";
import { UserCreate } from "@models/user.model";

export class AuthController {
    private service: IAuthService;
    private userService: IUserService;

    constructor(authService: IAuthService, userService: IUserService) {
        this.service = authService;
        this.userService = userService;
    }

    public register = async (req: Request, res: Response) => {
        const name = req.body.name as string;
        if (await this.userService.existsUserByName(name))
            throw new ConflictError(
                `User whit this name: ${name} already exits.`,
            );

        const username = req.body.username as string;
        if (await this.userService.existsUserByUserName(username))
            throw new ConflictError(
                `User whit this username: ${username} already exits.`,
            );

        const email = req.body.email as string;
        if (await this.userService.existsUserByEmail(email))
            throw new ConflictError(
                `User this whit email: ${email} already exits.`,
            );

        const newUser = req.body as UserCreate;

        const created = await this.userService.createUser(newUser);

        res.status(201).json(created);
    };

    public login = async (req: Request, res: Response) => {
        // Valid Data...
        const authLogin = req.body as AuthLogin;
        const result = await this.userService.isValidUser(authLogin);
        if (!result)
            throw new BadRequestError(`Email or password are not corrects.`);

        const existingUser = await this.userService.findUserByEmail(
            authLogin.email,
        );

        if (!existingUser)
            throw new NotFoundError(
                `User with this email: ${authLogin.email} not found.`,
            );

        const newAuth = await this.service.login(existingUser);
        // create the auth
        res.status(201).json(newAuth);
    };

    public logout = async (req: Request, res: Response) => {
        const isLogout = await this.service.logout(req.token_verified);

        if (!isLogout)
            throw new InternalServerError("An unexpected error on the server");

        res.status(201).json({ message: "Logout successfully" });
    };
}
