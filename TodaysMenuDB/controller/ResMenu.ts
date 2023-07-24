import { Repository } from "typeorm";
import { AppDataSource} from "..";
import { AllergyInfo } from "../entity/AllergyInfo";
import { AllergySet } from "../entity/AllergySet";
import { ResMenu } from "../entity/ResMenu";
import { Select } from "@tensorflow/tfjs";


export class ResMenuRepository extends Repository<ResMenu> {
    async saveMenu(
        dataList: {
        res_id: number,
        menu_name: string,
        menu_price: number,
        description: string
        }[],
    ) {
        try {
            for (const data of dataList) {
                await AppDataSource.manager.query(`
                    INSERT INTO res_menu
                    (
                        res_id,
                        menu_name,
                        menu_price,
                        description
                    ) VALUES ( 
                        ${data.res_id},
                        '${data.menu_name}',
                        ${data.menu_price},
                        '${data.description}'
                    )`)
            }
        } catch (e) {
            console.log(e);
        }
    }

    async checkMenu(id: string) {
        try{
            const restaurant = await AppDataSource.manager.query(`
                SELECT id FROM res_menu
                WHERE res_id = '${id}'
            `)
            if (restaurant.length == 0) {
                return false;
            } else {
                return true
            }
        } catch (e) {
            console.log(e);
        }
    }

    async getMenu(res_id: string) {
        try {
            return await this.createQueryBuilder('res_menu')
                .where(`res_menu.res_id = ${res_id}`)
                .getMany()
        } catch (e) {
            console.log(e)
        }
    }
}
