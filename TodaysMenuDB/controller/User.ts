import { DataSource, Repository } from "typeorm";
import { TbUser } from "../entity/TbUser";
import { AppDataSource, Entity } from "../index";

export class UserRepository extends Repository<TbUser> {
    //모든 유저 반환
    findAll() {
        return this.find();
    }

    findById(userId: string) {
        return this.findBy({
            userId: userId,
        });
    }

    findByName(name: string) {
        return this.findBy({
            userNm: name,
        });
    }
    findProfile(userName: string) {
        return this.createQueryBuilder("user")
            .select(
                "user.userId, user.userNm, user.age, user.sttr, user.hateFood, user.likeFood, STRING_AGG(food.cdNm, ',') as cdNmList"
            )
            .innerJoin(Entity.Allergy, "allergy", "allergy.userId = user.userId")
            .innerJoin(Entity.Food, "food", "food.cd = allergy.cd AND food.cdSetCd = allergy.cdSetCd")
            .where("user.userNm = :name", { name: userName })
            .groupBy("user.userId, user.userNm, user.age, user.sttr, user.hateFood, user.likeFood")
            .getRawMany();
    }

    async getProfile(userId: string) {
        return await AppDataSource.manager.query(
            `SELECT USER_ID, LGN_ID, USER_NM, PWD, EMIL_ADDR, GNDR_CD, AGE, STTR, BDWG
            , HATE_FOOD, LIKE_FOOD, WKLY_BEST_ACTV_DYCNT, DY_BEST_ACTV_HR, DY_BEST_ACTV_MIN
            , WKLY_MDDL_ACTV_DYCNT, DY_MDDL_ACTV_HR, DY_MDDL_ACTV_MIN
            , WORKING_DAY, WORKING_HOUR, WORKING_MIN
            , (SELECT ARRAY_TO_STRING(ARRAY_AGG(B.CD_NM),',')
                 FROM TB_USER_FOOD_CD_INFO A, TB_FOOD_CD B
                WHERE A.CD_SET_CD = B.CD_SET_CD AND A.CD = B.CD AND A.USER_ID = '${userId}') AS ALLERGY_INFO
         FROM TB_USER
        WHERE USER_ID = '${userId}'`
        );
    }

    async idCheck(userId: string) {
        return await AppDataSource.manager.query(
            `SELECT COUNT(*)
              FROM TB_USER
            WHERE LGN_ID = UPPER('${userId}')`
        );
    }

    async deleteUser(userId: string) {
        try {
            const lgn_id = await AppDataSource.manager.query(
                `select lgn_id From tb_user
                where user_id = UPPER('${userId}')`
            );

            await AppDataSource.manager.query(
                `DELETE FROM tb_user_food_cd_info
                WHERE user_id=UPPER('${userId}') AND lgn_id=UPPER('${lgn_id}');
                `
            );
            return await AppDataSource.manager.query(
                `Delete From TB_USER
                where user_ID = UPPER('${userId}')`
            );
        } catch (e) {
            throw e;
        }
    }

    async signUp(loginData: {
        userNm: string;
        loginId: string;
        password: string;
        emailAddr: string;
        gender: number;
        age: number;
        tall: number;
        weight: number;
        hardActiveDays: number;
        hardActiveHours: number;
        hardActiveMins: number;
        softActiveDays: number;
        softActiveHours: number;
        softActiveMins: number;
        walkingDays: number;
        walkingHours: number;
        walkingMins: number;
        hateFood: string[];
        likeFood: string[];
        allergy: string;
    }) {
        const userId = (
            await AppDataSource.manager
                .query(`SELECT 'USER'||LPAD(cast(cast(COALESCE(cast(MAX(SUBSTR(USER_ID,5)) as varchar),'00') as integer)+1 as varchar),10,'0') as user_id
        FROM TB_USER`)
        )[0].user_id;

        const queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.query(`INSERT INTO TB_USER
            (
                USER_ID,
                USER_NM,
                LGN_ID,
                PWD,
                EMIL_ADDR,
                GNDR_CD,
                AGE,
                STTR,
                BDWG,
                wkly_best_actv_dycnt,
                dy_best_actv_hr,
                dy_best_actv_min,
                wkly_mddl_actv_dycnt,
                dy_mddl_actv_hr,
                dy_mddl_actv_min,
                working_day,
                working_hour,
                working_min,
                hate_food,
                like_food,
                USE_YN,
                ATHR_CD,
                RGSR_ID,
                RGSN_DTTM,
                AMND_ID,
                AMNT_DTTM
            ) VALUES (
                '${userId}',
                '${loginData.userNm}',
                UPPER('${loginData.loginId}'),
                '${loginData.password}',
                '${loginData.emailAddr}',
                '${loginData.gender.toString()}',
                '${loginData.age}',
                '${loginData.tall}',
                '${loginData.weight}',
                '${loginData.hardActiveDays.toString()}',
                '${loginData.hardActiveHours.toString()}',
                '${loginData.hardActiveMins.toString()}',
                '${loginData.softActiveDays.toString()}',
                '${loginData.softActiveHours.toString()}',
                '${loginData.softActiveMins.toString()}',
                '${loginData.walkingDays.toString()}',
                '${loginData.walkingHours.toString()}',
                '${loginData.walkingMins.toString()}',
                '${loginData.hateFood.join(",")}',
                '${loginData.likeFood.join(",")}',
                'Y',
                '20',
                '${userId}',
                TO_CHAR(CURRENT_TIMESTAMP,'YYYYMMDDHH24MISS'),
                '${userId}',
                TO_CHAR(CURRENT_TIMESTAMP,'YYYYMMDDHH24MISS')
            );
            `);

            for (let allergy of loginData.allergy) {
                const result = (
                    await AppDataSource.manager.query(`
                        select * from tb_food_cd
                        where cd_nm
                        like '${allergy}'
                    `)
                )[0];
                await AppDataSource.manager.query(`
                    INSERT INTO TB_USER_FOOD_CD_INFO
                    (
                        USER_ID,
                        CD_SET_CD,
                        CD,
                        LGN_ID,
                        RGSR_ID,
                        RGSN_DTTM,
                        AMND_ID,
                        AMNT_DTTM
                    )
                    VALUES (
                        '${userId}',
                        '${result.cd_set_cd}',
                        '${result.cd}',
                        UPPER('${loginData.loginId}'),
                        '${userId}',
                        TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'),
                        '${userId}',
                        TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'))
                `);
            }

            await queryRunner.commitTransaction();
            return "Successfully Saved Login Data";
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        }
    }
}
