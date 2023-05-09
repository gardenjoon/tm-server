import * as dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";

import { TbUser } from "./entities/TbUser";
import { TbUserFoodCdInfo } from "./entities/TbUserFoodCdInfo";

import { UserRepository } from "./controller/User";
import { AllergyRepository } from "./controller/Allergy";
import { TbFoodCdSet } from "./entities/TbFoodCdSet";
import { TbFoodCd } from "./entities/TbFoodCd";
import { TbFoodInfo } from "./entities/TbFoodInfo";
import { FoodInfoRepository } from "./controller/FoodInfo";
import { TbRestInfo } from "./entities/TbRestInfo";
import { TbRestMenuInfo } from "./entities/TbRestMenuInfo";
import { RestaurantRepository } from "./controller/Restaurant";

export const Entity = {
    User: TbUser,
    Allergy: TbUserFoodCdInfo,
    FoodSet: TbFoodCdSet,
    Food: TbFoodCd,
    FoodInfo: TbFoodInfo,
    Restaurant: TbRestInfo,
    Menu: TbRestMenuInfo,
};

export const Controller = {
    User: UserRepository,
    Allergy: AllergyRepository,
    FoodInfo: FoodInfoRepository,
    Restaurant: RestaurantRepository,
};

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 15432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ["TodaysMenuDB/entity/**/*.ts"],
    logging: false,
    synchronize: false,
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
