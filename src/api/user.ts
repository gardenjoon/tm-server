import { Request, Response } from "express";
import { AppDataSource, Controller, Entity } from "../../TodaysMenuDB";
import * as crypto from "crypto";
import * as util from "util";

const pbkdf2Promise = util.promisify(crypto.pbkdf2);

const createHashedPassword = async (password: crypto.BinaryLike) => {
    const salt = crypto.createHash("sha512").update(password).digest("base64");

    const key = await pbkdf2Promise(password, salt, 104906, 64, "sha512");
    const hashedPassword = key.toString("base64");

    return hashedPassword;
};

const findById = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await new Controller.User(Entity.User, AppDataSource.manager).findById(userId);
    console.log(user);

    return res.status(200).json({
        status: 200,
        data: user,
    });
};

const findByName = async (req: Request, res: Response) => {
    try {
        console.log(req.params);
        const userName = req.params.userName;
        const user = await new Controller.User(Entity.User, AppDataSource.manager).findProfile(userName);
        console.log(user);
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
    const userId = req.params.userId;
    console.log(userId);
    const result = (await new Controller.User(Entity.User, AppDataSource.manager).getProfile(userId))[0];
    result.sttr = result.sttr ? parseInt(result.sttr).toString() : result.sttr;
    result.bdwg = result.bdwg ? parseInt(result.bdwg).toString() : result.bdwg;
    result.hate_food = result.hate_food ? result.hate_food.replaceAll(",", ", ") : result.hate_food;
    result.like_food = result.like_food ? result.like_food.replaceAll(",", ", ") : result.like_food;
    result.allergy_info = result.allergy_info ? result.allergy_info.replace(",", ", ") : result.allergy_info;
    console.log(result);

    return res.status(200).json({
        status: 200,
        data: result,
    });
};

const loginIdCheck = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const result = (await new Controller.User(Entity.User, AppDataSource.manager).idCheck(userId))[0];
        if (result.count != "0") {
            return res.status(500).json({
                status: 500,
                error: {
                    message: "동일한 ID가 이미 존재합니다",
                },
            });
        } else {
            return res.status(200).json({
                status: 200,
                data: {
                    message: "입력하신 아이디는 사용가능합니다",
                },
            });
        }
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            status: 500,
            error: { message: "서버 에러입니다. " },
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

const signup = async (req: Request, res: Response) => {
    const loginData = req.body;
    loginData.password = await createHashedPassword(loginData.password);

    const result = await new Controller.User(Entity.User, AppDataSource.manager).signUp(loginData);

    return res.status(200).json({
        status: 200,
        data: "SignUp Successful",
    });
};


const signin = async (req: Request, res: Response) => {
    const loginData = req.body;
    loginData.password = await createHashedPassword(loginData.password);

    console.log(loginData);

    return res.status(200).json({
        status: 200,
        data: "SignIn Successful",
    });
};

export { findByName, findById, getProfile, signup, signin, loginIdCheck, deleteUser };
