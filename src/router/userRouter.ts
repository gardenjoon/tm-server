import * as express from "express";
import { Router } from "express";
import { findByName, findById, getProfile, signup, signin, loginIdCheck, deleteUser } from "../api/user";

const router: Router = express.Router();

router.get("/findByName/:userName", findByName);
router.get("/userId/:userId", findById);
router.get("/getProfile/:userId", getProfile);
router.get("/loginIdCheck/:loginId", loginIdCheck);
router.get("/deleteUser/:userId", deleteUser);

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
