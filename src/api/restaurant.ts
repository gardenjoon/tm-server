import { Request, Response } from "express";
import { AppDataSource, Controller, Entity } from "../../TodaysMenuDB";

const getRestaurantList = async (req: Request, res: Response) => {
    const result = (await new Controller.Restaurant(Entity.Restaurant, AppDataSource.manager).getRestaurantList())
    console.log(result);

    return res.status(200).json({
        status: 200,
        data: result,
    });
};



export { getRestaurantList };
