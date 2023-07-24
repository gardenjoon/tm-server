import * as express from "express";
import { Router } from "express";
import { getAddress, getRegion, search } from '../api/map';

const router: Router = express.Router();

router.get("/getaddress/query/:query", getAddress);
router.get("/getregion/x/:x/y/:y", getRegion);
router.get("/search/query/:query/x/:x/y/:y/radius/:radius/rect/:rect/size/:size", search)

export default router;
