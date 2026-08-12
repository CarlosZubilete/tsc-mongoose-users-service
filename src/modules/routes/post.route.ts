import { Router } from "express";
import { PostController } from "@controllers/post.controller";
import { IPostRepository, PostRepository } from "@repositories/post.repository";
import { PostCreateSchema, PostUpdateSchema } from "@schemas/post.schema";
import { CatchAsync } from "@utils/catch-async.utils";
import { ValidateSchema } from "@middlewares/validate-schema.middleware";
import { VerifyPermissions } from "@middlewares/verify-permissions.middleware";
import { VerifyToken } from "@middlewares/verify-token.middleware";
import { IPostService, PostService } from "@services/post.service";

// Dependency injection
const postRepository: IPostRepository = new PostRepository();
const postService: IPostService = new PostService(postRepository);
const postController = new PostController(postService);

const postRouter: Router = Router();

postRouter.get(
    "/",
    VerifyToken,
    VerifyPermissions,
    CatchAsync(postController.getList),
);

postRouter.get(
    "/:id",
    VerifyToken,
    VerifyPermissions,
    CatchAsync(postController.getById),
);

postRouter.post(
    "/",
    VerifyToken,
    VerifyPermissions,
    ValidateSchema(PostCreateSchema),
    CatchAsync(postController.create),
);

postRouter.put(
    "/:id",
    VerifyToken,
    VerifyPermissions,
    ValidateSchema(PostUpdateSchema),
    CatchAsync(postController.update),
);

postRouter.delete(
    "/:id",
    VerifyToken,
    VerifyPermissions,
    CatchAsync(postController.delete),
);

export default postRouter;
