import * as express from "express";
import { Router } from "express";
import { findById, getProfile, updateProfile, signup, signin, checkLgnId, deleteUser, getAllergy } from "../api/user";

const router: Router = express.Router();

router.get("/userId/:userId", findById);
router.get("/getProfile/:userId", getProfile);
router.get("/checkLgnId/:loginId", checkLgnId);
router.get("/deleteUser/:userId", deleteUser);

router.get("/getAllergy", getAllergy);

router.post("/updateProfile/", updateProfile);
router.post("/signUp", signup);
router.post("/signIn", signin);

export default router;
