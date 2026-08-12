import { Request, Response } from "express";
import { IUserService } from "@services/user.service";
import { UserCreate, UserUpdate } from "@models/user.model";
import { NotFoundError } from "@errors/not-found-error";
import { ConflictError } from "@errors/conflict-error";

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

        if (!user)
            throw new NotFoundError(`User with this id: ${id} not found.`);

        res.status(200).json(user);
    };

    public create = async (req: Request, res: Response) => {
        // Validations: Business Logic
        const name = req.body.name as string;
        if (await this.service.existsUserByName(name))
            throw new ConflictError(
                `User whit this name: ${name} already exits.`,
            );

        const username = req.body.username as string;
        if (await this.service.existsUserByUserName(username))
            throw new ConflictError(
                `User whit this username: ${username} already exits.`,
            );

        const email = req.body.email as string;
        if (await this.service.existsUserByEmail(email))
            throw new ConflictError(
                `User this whit email: ${email} already exits.`,
            );

        const newUser = req.body as UserCreate;

        const created = await this.service.createUser(newUser);

        res.status(201).json(created);
    };

    public update = async (req: Request, res: Response) => {
        // Valid id
        const id = req.params.id as string;
        const exists = await this.service.existsUserById(id);
        if (!exists) throw new NotFoundError(`User with id: ${id} not found.`);

        // Validations: Business Logic
        if (req.body.name !== null) {
            const newName: string = req.body.name;
            if (await this.service.existsUserByName(newName))
                throw new ConflictError(`This name: ${newName} already exits.`);
        }

        if (req.body.username !== null) {
            const newUserName: string = req.body.username;
            if (await this.service.existsUserByUserName(newUserName))
                throw new ConflictError(
                    `This username: ${newUserName} already exits.`,
                );
        }

        if (req.body.email !== null) {
            const newEmail: string = req.body.email;
            if (await this.service.existsUserByEmail(newEmail))
                throw new ConflictError(
                    `This email: ${newEmail} already exists.`,
                );
        }

        if (!this.service.existsUserById(id))
            throw new NotFoundError(`User with this id: ${id} not found.`);

        const partialUser = req.body as UserUpdate;

        const updated = await this.service.updateUser(id, partialUser);

        res.status(200).json(updated);
    };

    public deleteById = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const deleted = await this.service.deleteUser(id);

        if (!deleted) throw new NotFoundError(`User with id: ${id} not found.`);

        res.status(204).end();
    };
}
