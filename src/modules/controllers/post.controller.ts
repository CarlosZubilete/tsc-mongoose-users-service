import { NotFoundError } from "@errors/not-found-error";
import { PostCreate, PostUpdate } from "@models/post.model";
import { Request, Response } from "express";
import { IPostService } from "modules/services/post.service";

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

        if (!post)
            throw new NotFoundError(`Post with this id: ${id} not found.`);

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
        // Valid Post
        const userId = req.user_logged.id;

        // Check if the post whit Id exists.
        const existingPost = await this.service.findPostById(id);
        if (!existingPost)
            throw new NotFoundError(`Post with this id ${id} not found.`);

        // Check if the user is strictly a standard "user"
        const isStandardUser = req.user_logged_roles.find(
            ({ name }) => name === "user",
        );

        console.log("IS USER ROLE >> ", isStandardUser);

        // If It's a standard user: enforce Ownership for standard users
        if (isStandardUser) {
            const existsPostWithUser = await this.service.existsByIdAndUserId(
                id,
                userId,
            );

            if (!existsPostWithUser)
                throw new NotFoundError(
                    `Post not found or this Post is not yours to update it.`,
                );
        }

        const updatePost = req.body as PostUpdate;

        updatePost.userId = existingPost.userId;

        const updated = await this.service.updatePost(id, updatePost);

        res.status(200).json(updated);
    };

    public delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const userId = req.user_logged.id;

        // Check if the user is strictly a standard "user"
        const isStandardUser = req.user_logged_roles.find(
            ({ name }) => name === "user",
        );

        // If It's a standard user: enforce Ownership for standard users
        if (isStandardUser) {
            const existsPostWithUser = await this.service.existsByIdAndUserId(
                id,
                userId,
            );

            if (!existsPostWithUser)
                throw new NotFoundError(
                    `Post not found or this Post is not yours to update it.`,
                );
        }

        const deleted = await this.service.deletePost(id);

        if (!deleted)
            throw new NotFoundError(
                `Post not found or this Post is not yours to delete it.`,
            );
        res.status(204).end();
    };
}
