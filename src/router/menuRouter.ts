import * as express from "express";
import { Router } from "express";
import { rcmdMenu } from "../api/menu";

const router: Router = express.Router();

router.get("/getMenu/id/:userId/style/:style/tags/:tags/calorie/:calorie", rcmdMenu);

export default router;
