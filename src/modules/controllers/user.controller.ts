import { Request, Response } from "express";
import { IUserService } from "modules/services/user.service";
import { UserResponse } from "@models/user.model";
import { NotFoundError } from "@errors/not-found-error";
import { ConflictError } from "@errors/conflict-error";

export class UserController {
    private service: IUserService;

    constructor(userService: IUserService) {
        this.service = userService;
    }

    public getList = async (_: Request, res: Response) => {
        const users: UserResponse[] = await this.service.findUsers();
        res.status(200).json(users);
    };

    public getById = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const user = await this.service.findUserById(id);

        if (!user) throw new NotFoundError(`User with id: ${id} not found.`);

        res.status(200).json(user);
    };

    public create = async (req: Request, res: Response) => {
        // Validations: Business Logic
        // if (await this.service.existsUserByName(req.body.name))
        //     throw new ConflictError(
        //         `User whit name: ${req.body.name} already exits.`,
        //     );

        // if (await this.service.existsUserByUserName(req.body.username))
        //     throw new ConflictError(
        //         `User whit username: ${req.body.username} already exits.`,
        //     );

        // if (await this.service.existsUserByEmail(req.body.email))
        //     throw new ConflictError(
        //         `User whit email: ${req.body.email} already exits.`,
        //     );

        /** */
        if (await this.service.existsUserByName(req.body.name))
            throw new ConflictError(
                `User whit name: ${req.body.name} already exits.`,
            );

        if (await this.service.existsUserByUserName(req.body.username))
            throw new ConflictError(
                `User whit username: ${req.body.username} already exits.`,
            );

        if (await this.service.existsUserByEmail(req.body.email))
            throw new ConflictError(
                `User whit email: ${req.body.email} already exits.`,
            );
        const newUser = await this.service.createUser(req.body);

        res.status(201).json(newUser as UserResponse); // todo: It's send the whole user.
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
                    `this email: ${newEmail} already exists.`,
                );
        }

        if (!this.service.existsUserById(id))
            throw new NotFoundError(`User with id: ${id} not found.`);

        const updated = await this.service.updateUser(id, req.body);

        if (!updated) throw new NotFoundError(`User with id: ${id} not found.`);

        res.status(200).json(updated);
    };

    public deleteById = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const deleted = this.service.deleteUser(id);

        if (!deleted) throw new NotFoundError(`User with id: ${id} not found.`);

        res.status(204).json({ message: "User deleted success." });
    };
}

/*
const userRepository: IUserRepository = new UserRepository();
const userService: IUserService = new UserService(userRepository);

const getUserList = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const users: UserResponse[] = await userService.findUsers();

        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const user = await userService.findUserById(id);

        if (!user) throw new NotFoundError("User with id: ${id} not found.");

        res.status(200).json(user);
    } catch (e) {
        console.log("Error in controller user: >> ", e);
        res.status(500).json(e);
    }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = CreateUserSchema.parse(req.body);

        const newUser = await userService.createUser(data);

        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = UpdateUserSchema.parse(req.body);

        const id = req.params.id as string;

        if (!userService.existsUser(id))
            throw new NotFoundError("User with id: ${id} not found.");

        const updated = await userService.updateUser(id, data as UserUpdate);

        // What 's happen here ?
        if (!updated) throw new NotFoundError("User with id: ${id} not found.");

        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;

        const deleted = userService.deleteUser(id);

        if (!deleted) throw new NotFoundError("User with id: ${id} not found.");

        res.status(204).json({ message: "User deleted success." });
    } catch (err) {
        next(err);
    }
};

export { getUserList, getUserById, createUser, updateUser, deleteUser };
*/
