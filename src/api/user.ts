import { Request, Response } from "express";
import { AppDataSource, Controller, Entity } from "../../TodaysMenuDB";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const signin = async (req: Request, res: Response) => {
    try {
        const loginData = req.body;

        const userId = await new Controller.User(Entity.User, AppDataSource.manager).signIn(
            loginData["account"],
            loginData["password"]
        );

        const token = jwt.sign(
            {
                id: userId,
            },
            process.env.JWT_SECRET,
            {
                // expiresIn: "1m",
                issuer: "idblab",
            }
        );

        return res.status(200).json({
            status: 200,
            message: "토큰이 발급되었습니다.",
            data: token,
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            error: { message: "서버 에러입니다." },
        });
    }
};

const signup = async (req: Request, res: Response) => {
    try {
        const request = req.body;
        request.profile.gender = request.profile.gender * 10;
        const userId = await new Controller.User(Entity.User, AppDataSource.manager).signUp(
            request.profile,
            request.allergy,
            request.exercise
        );

        const token = jwt.sign(
            {
                id: userId,
            },
            process.env.JWT_SECRET,
            {
                // expiresIn: "1m",
                issuer: "idblab",
            }
        );

        return res.status(200).json({
            status: 200,
            message: "토큰이 발급되었습니다.",
            data: token,
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            error: { message: "서버 에러입니다." },
        });
    }
};


const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const result = (await new Controller.User(Entity.User, AppDataSource.manager).getProfile(userId));
        result.gender = Number((result.gender / 10).toFixed(0));
        result.height = Number(result.height);
        result.weight = Number(result.weight);


        return res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            error: { message: "서버 에러입니다. " },
        });
    }
};

const updateProfile = async (req: Request, res: Response) => {
    try {
        const request = req.body;
        request.profile.gender = request.profile.gender * 10;

        const userId = await new Controller.User(Entity.User, AppDataSource.manager).updateUser(
            request.user_id,
            request.profile,
            request.allergy,
            request.exercise
        );

        return res.status(200).json({
            status: 200,
            data: userId,
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            error: { message: "서버 에러입니다." },
        });
    }
};



const checkLgnId = async (req: Request, res: Response) => {
    try {
        const loginId = req.params.loginId;
        const result = (await new Controller.User(Entity.User, AppDataSource.manager).checkId(loginId))[0];
        if (result.count != "0") {
            return res.status(200).json({
                status: 200,
                data: {
                    message: true,
                },
            });
        } else {
            return res.status(200).json({
                status: 200,
                data: {
                    message: false,
                },
            });
        }
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            status: 500,
            error: { message: "error" },
        });
    }
};

const findById = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await new Controller.User(Entity.User, AppDataSource.manager).findById(userId);

    return res.status(200).json({
        status: 200,
        data: user,
    });
};


const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const result = await new Controller.User(Entity.User, AppDataSource.manager).deleteUser(userId);

        if (result[1] == 0) {
            return res.status(200).json({
                status: 200,
                data: {
                    message: "유저가 존재하지 않습니다.",
                },
            });
        } else {
            return res.status(200).json({
                status: 200,
                data: {
                    message: `${result[1]}명의 유저가 삭제되었습니다.`,
                },
            });
        }
    } catch (e) {
        return res.status(500).json({
            status: 500,
            error: { message: "서버 에러입니다. " },
        });
    }
};




const getAllergy = async (req: Request, res: Response) => {
    try {
        const result = await new Controller.Allergy(Entity.AllergySet, AppDataSource.manager).getAllergy();
        return res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            data: "Server Error",
        });
    }
}

export { findById, getProfile, updateProfile, signup, signin, checkLgnId, deleteUser, getAllergy };
