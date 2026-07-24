import { NotFoundError } from "@errors/not-found-error";
import { PostCreate, PostUpdate } from "@models/post.model";
import { Request, Response } from "express";
import { IPostService } from "modules/services/post.service";

export class PostController {
    private service: IPostService;

    constructor(postService: IPostService) {
        this.service = postService;
    }

    // This returns the whole list from the database.
    // Not needed token , permissions.
    public getList = async (_: Request, res: Response) => {
        const posts = await this.service.findPosts();
        res.status(200).json(posts);
    };

    // This returns one post from the database.
    // Not needed token , permissions.
    public getById = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const post = await this.service.findPostById(id);

        if (!post)
            throw new NotFoundError(`Post with this id: ${id} not found.`);

        res.status(200).json(post);
    };

    // todo: Can we do a validation by unique name post in each user ?.
    // Here need token and permissions.
    public create = async (req: Request, res: Response) => {
        const newPost = req.body as PostCreate;

        newPost.userId = req.user_id;

        const created = await this.service.createPost(newPost);

        res.status(201).json(created);
    };

    public update = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        // Valid Post

        const userId = req.user_id;
        const existsPostWithUser = await this.service.existsByIdAndUserId(
            id,
            userId,
        );

        if (!existsPostWithUser)
            throw new NotFoundError(
                `Post not found or you do not have permission to delete it.`,
            );

        const updatePost = req.body as PostUpdate;

        updatePost.userId = userId;

        const updated = await this.service.updatePost(id, updatePost);

        res.status(200).json(updated);
    };

    public delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const userId = req.user_id;

        const deleted = await this.service.deletePost(id, userId);
        if (!deleted)
            throw new NotFoundError(
                `Post not found or you do not have permission to delete it.`,
            );

        res.status(204).end();
    };
}
