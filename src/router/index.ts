import * as express from "express";
import { Router } from "express";

import userRouter from "./userRouter";
import menuRouter from "./menuRouter";
import restaurantRouter from "./restaurantRouter";

const router: Router = express.Router();

router.use("/user", userRouter);
router.use("/menu", menuRouter);
router.use("/restaurant", restaurantRouter);

export default router;
