import { Router, Response } from "express";
import roleRouter from "@routes/role.route";
import userRouter from "@routes/user.route";
import authRouter from "@routes/auth.route";
import postRouter from "@routes/post.route";

const router: Router = Router();

// path: "localhost:4000/api/v1"
router.get("/", (_, res: Response) => {
    res.json({ status: "API is healthy" });
});

// Modules Routes:
router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/auth", authRouter);
router.use("/posts", postRouter);

export default router;
