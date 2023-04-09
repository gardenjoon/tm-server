import * as express from "express"
import { Router } from "express";
import { getRestaurantList } from "../api/restaurant";

const router: Router = express.Router();

router.get('/getRestaurant', getRestaurantList);


export default router;