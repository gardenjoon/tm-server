import * as express from "express";
import { Router } from "express";

import userRouter from "./userRouter";
import menuRouter from "./menuRouter";
import checkRouter from "./checkRouter";
import mapRouter from "./mapRouter";

const router: Router = express.Router();

router.use("/user", userRouter);
router.use("/menu", menuRouter);
router.use("/check", checkRouter);
router.use("/map", mapRouter);

export default router;
