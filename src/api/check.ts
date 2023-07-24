import { Request, Response } from "express";
import * as fs from "fs";
import multer from "multer";
import predictModel from "../tf/predict";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({ storage });

const uploadImg = async (req: Request, res: Response, next) => {
    try {
        const [predictions, sum] = await predictModel(req.file!.path);

        fs.unlinkSync(`./uploads/${req.file!.filename}`);

        const output = fs.readFileSync("./uploads/output.jpg");

        fs.unlinkSync(`./uploads/output.jpg`);

        return res.status(200).json({
            status: 200,
            data: {
                prediction: predictions,
                image: Buffer.from(output).toString("base64"),
                sum: Number(Number(sum).toFixed(0)),
            },
        });
    } catch (e) {
        return res.status(500);
    }
};

export { uploadImg, upload };
