import { Request, Response } from "express";
import { IUserService } from "@services/user.service";
import { UserCreate, UserUpdate } from "@models/user.model";
import { NotFoundError } from "@errors/not-found-error";

export class UserController {
    private service: IUserService;

    constructor(userService: IUserService) {
        this.service = userService;
    }

    public getList = async (_: Request, res: Response) => {
        const users = await this.service.findUsers();
        res.status(200).json(users);
    };

    public getById = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const user = await this.service.findUserById(id);

        res.status(200).json(user);
    };

    public create = async (req: Request, res: Response) => {
        const newUser = req.body as UserCreate;

        const created = await this.service.createUser(newUser);

        res.status(201).json(created);
    };

    public update = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const partialUser = req.body as UserUpdate;
        const loggedInUserRoles = req.user_logged_roles;
        const loggedInUserId = req.user_logged.id;

        const updated = await this.service.updateUser(
            id,
            partialUser,
            loggedInUserRoles,
            loggedInUserId,
        );

        res.status(200).json(updated);
    };

    public deleteById = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const deleted = await this.service.deleteUser(id);

        if (!deleted) throw new NotFoundError(`User with id: ${id} not found.`);

        res.status(204).end();
    };
}
