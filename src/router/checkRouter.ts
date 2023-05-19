import * as express from "express";
import { Router } from "express";
import { uploadImg, upload } from "../api/check";

const router: Router = express.Router();

router.post("/upload", upload.single("image"), uploadImg);

export default router;
