import { Repository } from "typeorm";
import { AppDataSource} from "..";
import { AllergyInfo } from "../entity/AllergyInfo";
import { AllergySet } from "../entity/AllergySet";


export class AllergyRepository extends Repository<AllergySet> {
    async getAllergy() {
        return this.createQueryBuilder('allergy')
            .leftJoinAndSelect('allergy.allergyInfos', 'allergy_info')
            .getMany()
    }
}
