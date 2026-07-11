import roleRouter from "@routes/role.route";
import userRouter from "@routes/user.route";
import { Router, Response } from "express";

const router: Router = Router();

// path: "localhost:4000/api/v1"
router.get("/", (_, res: Response) => {
    res.json({ status: "API is healthy" });
});

// Modules Routes:
router.use("/users", userRouter);
router.use("/roles", roleRouter);

export default router;
