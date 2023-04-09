import * as express from "express"
import { Router } from "express";
import { calInfo, getBreakfast, getLunch, getDinner } from "../api/menu";

const router: Router = express.Router();

router.get('/bodyInfo/:userId', calInfo);
router.get('/breakfast/:userId', getBreakfast);
router.get('/lunch/:userId', getLunch);
router.get('/dinner/:userId', getDinner);

export default router;