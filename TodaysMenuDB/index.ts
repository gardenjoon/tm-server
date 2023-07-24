import * as dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";

import { UserInfo } from "./entity/UserInfo";
import { FoodInfo } from "./entity/FoodInfo";
import { AllergyInfo } from "./entity/AllergyInfo";
import { AllergySet } from "./entity/AllergySet";
import { ResMenu } from "./entity/ResMenu";

import { UserRepository } from "./controller/User";
import { FoodInfoRepository } from "./controller/FoodInfo";
import { AllergyRepository } from "./controller/AllergyInfo";
import { ResMenuRepository } from "./controller/ResMenu";

export const Entity = {
    User: UserInfo,
    FoodInfo: FoodInfo,
    AllergyInfo: AllergyInfo,
    AllergySet: AllergySet,
    ResMenu: ResMenu,
};

export const Controller = {
    User: UserRepository,
    FoodInfo: FoodInfoRepository,
    Allergy: AllergyRepository,
    ResMenu: ResMenuRepository,
};

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 15432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + "/entity/**/*.{js,ts}"],
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
