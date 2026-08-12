import { PostCreate, PostUpdate } from "@models/post.model";
import { Request, Response } from "express";
import { IPostService } from "@services/post.service";

export class PostController {
    private service: IPostService;

    constructor(postService: IPostService) {
        this.service = postService;
    }

    public getList = async (_: Request, res: Response) => {
        const posts = await this.service.findPosts();

        res.status(200).json(posts);
    };

    public getById = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const post = await this.service.findPostById(id);

        res.status(200).json(post);
    };

    public create = async (req: Request, res: Response) => {
        const newPost = req.body as PostCreate;

        newPost.userId = req.user_logged.id;

        const created = await this.service.createPost(newPost);

        res.status(201).json(created);
    };

    public update = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const updatePost = req.body as PostUpdate;
        const userRoles = req.user_logged_roles;
        const userId = req.user_logged.id;

        const updated = await this.service.updatePost(
            id,
            updatePost,
            userRoles,
            userId,
        );

        res.status(200).json(updated);
    };

    public delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const userRoles = req.user_logged_roles;
        const userId = req.user_logged.id;

        const deleted = await this.service.deletePost(id, userRoles, userId);

        if (!deleted) res.status(500).json({message: "Error to delete Post"})
        res.status(204).end();
    };
}
