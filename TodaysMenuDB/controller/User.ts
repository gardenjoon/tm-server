import { Repository } from "typeorm";
import { AppDataSource, Entity } from "../index";
import { UserInfo } from "../entity/UserInfo";
import { AllergyInfo } from "../entity/AllergyInfo";
import { UserAllergyInfo } from "../entity/UserAllergyInfo";
require("dotenv").config();

export class UserRepository extends Repository<UserInfo> {
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
            userName: name,
        });
    }

    async getProfile(userId: string) {
        const allergyList = await AppDataSource.manager.query(`
            SELECT * FROM user_allergy_info
            LEFT JOIN allergy_info ON allergy_info.algy_id = user_allergy_info.algy_id
            WHERE user_allergy_info.user_id = '${userId}'
        `)
        let newAllergyList = []
        allergyList.map((x) => {
            let y = {};
            y['algyId'] = x['algy_id'];
            y['algySqno'] = x['algy_sqno'];
            y['algyNm'] = x['algy_nm'];
            newAllergyList.push(y);
        })
        let userInfo = await this.createQueryBuilder('user')
        .leftJoinAndSelect('user.userExercise', 'userExercise')
        .where(`user.userId = '${userId}'`)
        .getOne()

        userInfo['userAllergyInfos'] = newAllergyList
        return userInfo;
    }

    async checkId(lgnId: string) {
        return await AppDataSource.manager.query(
            `SELECT COUNT(*)
              FROM user_info
            WHERE account = '${lgnId}'`
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

    
    async signIn(login_id: String, password: String) {
        const queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();

        try {
            const user = (
                await queryRunner.manager.query(`
                SELECT user_id, pwd FROM user_info
                    where account='${login_id}'
            `)
            )[0];
            console.log(user);
            await queryRunner.commitTransaction();

            if (!user) {
                return "No User";
            } else if (password != user["pwd"]) {
                return "password error";
            } else {
                return user["user_id"];
            }
        } catch (e) {
            await queryRunner.rollbackTransaction();
            console.log(e);
            throw e;
        }
    }

    async signUp(
        profile: {
            account: string;
            user_name: string;
            pwd: string;
            email: string;
            gender: number;
            birth: string;
            height: number;
            weight: number;
            allergy: string[];
        },
        allergy : {
            allergy_id : number,
            allergy_sequence_number : number,
            allergy_name : string
        }[],
        excersize: {
            hard: {
                days: number,
                hours: number,
                minutes: number
            },
            middle: {
                days: number,
                hours: number,
                minutes: number
            },
            walk: {
                days: number,
                hours: number,
                minutes: number
            },
        }
    ) {
        const queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.query(`
            INSERT INTO USER_INFO
            (
                account,
                user_name,
                pwd,
                email,
                gender,
                birth,
                height,
                weight
            ) VALUES ( 
                '${profile.account}',
                '${profile.user_name}',
                '${profile.pwd}',
                '${profile.email}',
                ${profile.gender == 30 ? 20 : profile.gender},
                '${profile.birth ?? 20000101}',
                ${profile.height ?? 170},
                ${profile.weight ?? 60})
            `);

            const userId = (await queryRunner.manager.query(`
                SELECT user_id FROM USER_INFO
                WHERE account = '${profile.account}'
            `))[0].user_id;
            console.log(userId);

            for (let allergy_item of allergy) {
                await queryRunner.manager.query(`
                INSERT INTO USER_ALLERGY_INFO
                (
                    user_id,
                    algy_id
                ) VALUES (
                    '${userId}',
                    ${allergy_item.allergy_id}
                )
                `);
            }

            await queryRunner.manager.query(`
                INSERT INTO USER_EXERCISE
                (
                    user_id,
                    wk_hg_act,
                    dy_hg_act_hr,
                    dy_hg_act_mn,
                    wk_md_act,
                    dy_md_act_hr,
                    dy_md_act_mn,
                    wk_walk,
                    dy_walk_hr,
                    dy_walk_mn
                ) VALUES (
                    '${userId}',
                    ${excersize.hard.days},
                    ${excersize.hard.hours},
                    ${excersize.hard.minutes},
                    ${excersize.middle.days},
                    ${excersize.middle.hours},
                    ${excersize.middle.minutes},
                    ${excersize.walk.days},
                    ${excersize.walk.hours},
                    ${excersize.walk.minutes}
                )
            `);
            await queryRunner.commitTransaction();
            return userId;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            console.log(e);
        }
    }

    async updateUser(
        userId: string,
        profile: {
            account: string;
            user_name: string;
            pwd: string;
            email: string;
            gender: number;
            birth: string;
            height: number;
            weight: number;
        },
        allergy : {
            allergy_id : number,
            allergy_sequence_number : number,
            allergy_name : string
        }[],
        excersize: {
            hard: {
                days: number,
                hours: number,
                minutes: number
            },
            middle: {
                days: number,
                hours: number,
                minutes: number
            },
            walk: {
                days: number,
                hours: number,
                minutes: number
            },
        }
    ) {
        const queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.query(
                `UPDATE USER_INFO
                SET
                    account = '${profile.account}',
                    user_name = '${profile.user_name}',
                    pwd = '${profile.pwd}',
                    email = '${profile.email}',
                    gender = ${profile.gender},
                    birth = '${profile.birth}',
                    height = ${profile.height},
                    weight = ${profile.weight}
                WHERE user_id = '${userId}'
            `
            );

            await queryRunner.manager.query(`
                DELETE FROM USER_ALLERGY_INFO
                WHERE user_id = '${userId}'
            `)

            for (let allergy_item of allergy) {
                await queryRunner.manager.query(`
                INSERT INTO USER_ALLERGY_INFO
                (
                    user_id,
                    algy_id
                ) VALUES (
                    '${userId}',
                    ${allergy_item.allergy_id}
                )
                `);
            }

            await queryRunner.manager.query(`
                UPDATE USER_EXERCISE
                SET
                    wk_hg_act = ${excersize.hard.days},
                    dy_hg_act_hr = ${excersize.hard.hours},
                    dy_hg_act_mn = ${excersize.hard.minutes},
                    wk_md_act = ${excersize.middle.days},
                    dy_md_act_hr = ${excersize.middle.hours},
                    dy_md_act_mn = ${excersize.middle.minutes},
                    wk_walk = ${excersize.walk.days},
                    dy_walk_hr = ${excersize.walk.hours},
                    dy_walk_mn = ${excersize.walk.minutes}
                WHERE user_id = '${userId}'
            `);


            await queryRunner.commitTransaction();
            return "Profile Successfully Updated";
        } catch (e) {
            console.log(e);
            await queryRunner.rollbackTransaction();
            throw e;
        }
    }

}
