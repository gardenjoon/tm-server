import { Repository } from "typeorm";
import { AppDataSource } from "..";
import { TbUserFoodCdInfo } from "../entity/TbUserFoodCdInfo";
import { Entity } from "../index";

export class AllergyRepository extends Repository<TbUserFoodCdInfo>{
    //모든 유저 반환
    findAll() {
        return this.find()
    }

    // findById(userId: string) {
    //     return this.findBy({
    //         userId : userId
    //     })
    // }
}