import  userRouter from "@routes/user.route";
import { Router, Response } from "express";


const router: Router = Router();

// path: "localhost:4000/api/v1"
router.get("/", (_, res: Response) => {
  res.json({ status: "API is healthy" })
});


//
router.use("/users", userRouter);


export default router;