import { Request, Response } from "express";
import { AppDataSource, Controller, Entity } from "../../TodaysMenuDB";

const findById = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await new Controller.User(Entity.User, AppDataSource.manager).findById(userId);

    return res.status(200).json({
        status: 200,
        data: user,
    });
};

const findByName = async (req: Request, res: Response) => {
    try {
        const userName = req.params.userName;
        const user = await new Controller.User(Entity.User, AppDataSource.manager).findProfile(userName);
        return res.status(200).json({
            status: 200,
            data: user,
        });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            status: 500,
            data: "Something Wrong",
        });
    }
};

const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const result = (await new Controller.User(Entity.User, AppDataSource.manager).getProfile(userId))[0];
        result.sttr = result.sttr ? parseInt(result.sttr).toString() : result.sttr;
        result.bdwg = result.bdwg ? parseInt(result.bdwg).toString() : result.bdwg;
        result.hate_food = result.hate_food ? result.hate_food.replaceAll(",", ", ") : "없음";
        result.like_food = result.like_food ? result.like_food.replaceAll(",", ", ") : "없음";
        result.allergy_info = result.allergy_info ? result.allergy_info.replace(",", ", ") : "없음";

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

const checkLgnId = async (req: Request, res: Response) => {
    try {
        const loginId = req.params.loginId;
        const result = (await new Controller.User(Entity.User, AppDataSource.manager).checkId(loginId))[0];
        if (result.count != "0") {
            return res.status(200).json({
                status: 200,
                data: {
                    message: "Duplicate",
                },
            });
        } else {
            return res.status(200).json({
                status: 200,
                data: {
                    message: "Possible",
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
const updateProfile = async (req: Request, res: Response) => {
    try {
        const request = req.body;

        const userId = await new Controller.User(Entity.User, AppDataSource.manager).updateUser(
            request.userId,
            request.loginData,
            request.activityData
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

const signup = async (req: Request, res: Response) => {
    try {
        const request = req.body;
        const result = await new Controller.User(Entity.User, AppDataSource.manager).signUp(
            request.loginData,
            request.activityData
        );

        return res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            error: { message: "서버 에러입니다." },
        });
    }
};

const signin = async (req: Request, res: Response) => {
    try {
        const loginData = req.body;

        const userId = await new Controller.User(Entity.User, AppDataSource.manager).signIn(
            loginData["id"],
            loginData["password"]
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

export { findByName, findById, getProfile, updateProfile, signup, signin, checkLgnId, deleteUser };
