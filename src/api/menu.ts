import { Request, Response } from "express";
import { AppDataSource, Controller, Entity } from "../../TodaysMenuDB";

//TODO: userId로 바꾸기
const calInfo = async (req: Request, res: Response) => {
    const userName = req.params.userId;
    const user = (await new Controller.User(Entity.User, AppDataSource.manager).findById(userName))[0];
    const result = await new Controller.FoodInfo(Entity.FoodInfo, AppDataSource.manager).bodyInfo(user.lgnId);

    return res.status(200).json({
        status: 200,
        data: result,
    });
};

//TODO: userId로 바꾸기
const rcmdMenu = async (req: Request, res: Response) => {
    const userName = req.params.userName;
    const user = (await new Controller.User(Entity.User, AppDataSource.manager).findById(userName))[0];
    const breakfast = await new Controller.FoodInfo(Entity.FoodInfo, AppDataSource.manager).breakfast(user.lgnId);
    const lunch = await new Controller.FoodInfo(Entity.FoodInfo, AppDataSource.manager).lunch(user.lgnId);
    const dinner = await new Controller.FoodInfo(Entity.FoodInfo, AppDataSource.manager).dinner(user.lgnId);
    const result = [breakfast, lunch, dinner];

    return res.status(200).json({
        status: 200,
        data: result,
    });
};

const getBreakfast = async (req: Request, res: Response) => {
    const userName = req.params.userName;
    const user = (await new Controller.User(Entity.User, AppDataSource.manager).findById(userName))[0];
    const result = await new Controller.FoodInfo(Entity.FoodInfo, AppDataSource.manager).breakfast(user.lgnId);

    return res.status(200).json({
        status: 200,
        data: result,
    });
};

const getLunch = async (req: Request, res: Response) => {
    const userName = req.params.userName;
    const user = (await new Controller.User(Entity.User, AppDataSource.manager).findById(userName))[0];
    const result = await new Controller.FoodInfo(Entity.FoodInfo, AppDataSource.manager).lunch(user.lgnId);

    return res.status(200).json({
        status: 200,
        data: result,
    });
};

const getDinner = async (req: Request, res: Response) => {
    const userName = req.params.userName;
    const user = (await new Controller.User(Entity.User, AppDataSource.manager).findById(userName))[0];
    const result = await new Controller.FoodInfo(Entity.FoodInfo, AppDataSource.manager).dinner(user.lgnId);

    return res.status(200).json({
        status: 200,
        data: result,
    });
};

export { calInfo, getBreakfast, getLunch, getDinner };
