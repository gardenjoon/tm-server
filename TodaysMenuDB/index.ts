import { DataSource } from "typeorm"

import { TbUser } from "./entity/TbUser";
import { TbUserFoodCdInfo } from "./entity/TbUserFoodCdInfo";

import { UserRepository } from "./controller/User";
import { AllergyRepository } from "./controller/Allergy";
import { TbFoodCdSet } from "./entity/TbFoodCdSet";
import { TbFoodCd } from "./entity/TbFoodCd";
import { TbFoodInfo } from "./entity/TbFoodInfo";
import { FoodInfoRepository } from "./controller/FoodInfo";
import { TbRestInfo } from "./entity/TbRestInfo";
import { TbRestMenuInfo } from "./entity/TbRestMenuInfo";
import { RestaurantRepository } from "./controller/Restaurant";

export const Entity = {
    User: TbUser,
    Allergy: TbUserFoodCdInfo,
    FoodSet: TbFoodCdSet,
    Food: TbFoodCd,
    FoodInfo: TbFoodInfo,
    Restaurant: TbRestInfo,
    Menu: TbRestMenuInfo,
}

export const Controller = {
    User: UserRepository,
    Allergy: AllergyRepository,
    FoodInfo: FoodInfoRepository,
    Restaurant: RestaurantRepository,
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "data.pknu.ac.kr",
    port: 5432,
    username: "miraesusan",
    password: "1234",
    database: "todays_menu",
    entities: ["TodaysMenuDB/entity/**/*.ts"],
    logging: false,
    synchronize: true,
})

AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
