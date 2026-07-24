import { PostController } from "@controllers/post.controller";
import { IPostRepository, PostRepository } from "@repositories/post.repository";
import { PostCreateSchema, PostUpdateSchema } from "@schemas/post.schema";
import { CatchAsync } from "@utils/catch-async.utils";
import { Router } from "express";
import { ValidateSchema } from "modules/middlewares/validate-schema.middleware";
import { VerifyToken } from "modules/middlewares/verify-token.middleware";
import { IPostService, PostService } from "modules/services/post.service";

// Dependency injection
const postRepository: IPostRepository = new PostRepository();
const postService: IPostService = new PostService(postRepository);
const postController = new PostController(postService);

const postRouter: Router = Router();

postRouter.get("/", CatchAsync(postController.getList));

postRouter.get("/:id", CatchAsync(postController.getById));

postRouter.post(
    "/",
    VerifyToken,
    ValidateSchema(PostCreateSchema),
    CatchAsync(postController.create),
);

postRouter.put(
    "/:id",
    VerifyToken,
    ValidateSchema(PostUpdateSchema),
    CatchAsync(postController.update),
);

postRouter.delete("/:id", VerifyToken, CatchAsync(postController.delete));

export default postRouter;
