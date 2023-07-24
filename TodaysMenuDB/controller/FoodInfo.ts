import { Repository, SimpleConsoleLogger } from "typeorm";
import { AppDataSource, Entity } from "..";
import { FoodInfo } from "../entity/FoodInfo";

// 권장칼로리 and 섭취칼로리 쿼리
export class FoodInfoRepository extends Repository<FoodInfo> {
    async bodyInfo(lgn_id: string) {
        return await AppDataSource.manager.query(
            `
            SELECT
                A.*,
                ((CASE WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '10' THEN 35
                       WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '20' THEN 30
                       WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '30' THEN 25
                       WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '10' THEN 40
                       WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '20' THEN 35
                       WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '30' THEN 30
                       WHEN A.BMI < 18.5 AND A.BODY_ACTY = '10' THEN 45
                       WHEN A.BMI < 18.5 AND A.BODY_ACTY = '20' THEN 40
                       WHEN A.BMI < 18.5 AND A.BODY_ACTY = '30' THEN 35
                  END) * A.WEIGHT) AVG_CAL,
                ROUND(((CASE WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '10' THEN 35
                             WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '20' THEN 30
                             WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '30' THEN 25
                             WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '10' THEN 40
                             WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '20' THEN 35
                             WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '30' THEN 30
                             WHEN A.BMI < 18.5 AND A.BODY_ACTY = '10' THEN 45
                             WHEN A.BMI < 18.5 AND A.BODY_ACTY = '20' THEN 40
                             WHEN A.BMI < 18.5 AND A.BODY_ACTY = '30' THEN 35
                        END) * A.WEIGHT) / 3, 2) MEAL_CAL
            FROM
                (
                SELECT
                    U.weight,
                    U.account,
                    U.gender,
                    ROUND(U.weight / (ROUND(U.height * 0.01, 2) * ROUND(U.height * 0.01, 2)), 1) BMI,
                    ROUND((CASE WHEN U.gender = 10 THEN (ROUND(U.height * 0.01, 2) * ROUND(U.height * 0.01, 2)) * 22
                                WHEN U.gender = 20 THEN (ROUND(U.height * 0.01, 2) * ROUND(U.height * 0.01, 2)) * 21
                           END), 2) AVG_KG,
                    UE.wk_walk::numeric,
                    UE.wk_hg_act::numeric,
                    UE.wk_md_act::numeric,
                    UE.dy_walk_hr::numeric,
                    UE.dy_hg_act_hr::numeric,
                    UE.dy_md_act_hr::numeric,
                    UE.dy_walk_mn::numeric,
                    UE.dy_hg_act_mn::numeric,
                    UE.dy_md_act_mn::numeric,
                    (CASE WHEN UE.wk_hg_act >= 3 OR UE.dy_hg_act_hr >= 20 OR UE.dy_hg_act_mn >= 30 THEN '10'
                          WHEN UE.wk_md_act >= 3 OR UE.dy_md_act_hr >= 20 OR UE.dy_md_act_mn >= 30 THEN '20'
                          WHEN UE.wk_walk >= 5 OR UE.dy_walk_hr >= 20 OR UE.dy_walk_mn >= 30 THEN '30'
                    END) BODY_ACTY
                FROM
                    user_info U
                JOIN user_exercise UE ON U.user_id = UE.user_id
                WHERE
                    U.account = '${lgn_id}'
                ) A
            `
        );
    }

    async getMenu(userId: string, menuStyles: Array<string>, tags: Array<string>, calorie: string) {
        const toColumns = {
            한식: "sty_kr",
            중식: "sty_cn",
            일식: "sty_jp",
            양식: "sty_ws",
            매콤: "lv_spicy",
            고단백: "hg_prot",
            저칼로리: "lw_cal",
            저지방: "lv_fat",
            저염: "lv_na",
            저당: "lv_su",
            채소류: "vegetable",
            육류: "meat",
            해산물: "seafood",
        };

        for (const index in menuStyles) {
            menuStyles[index] = toColumns[menuStyles[index]];
        }
        for (const index in tags) {
            tags[index] = toColumns[tags[index]];
        }

        const stringStyles = menuStyles.length == 0 ? "null" : "'" + JSON.stringify(menuStyles) + "'";
        const stringTags = tags.length == 0 ? "null" : "'" + JSON.stringify(tags) + "'";

        const queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();

        console.log(`
            SELECT (meal_info_1).*
            FROM MAKE_DISH_RECOMMENDATION(
            '${userId}',
            ${stringStyles},
            ${stringTags},
            ${Number(calorie)}
            )
            UNION ALL
            SELECT (meal_info_2).*
            FROM MAKE_DISH_RECOMMENDATION(
            '${userId}',
            ${stringStyles},
            ${stringTags},
            ${Number(calorie)}
            )
            UNION ALL
            SELECT (meal_info_3).*
            FROM MAKE_DISH_RECOMMENDATION(
            '${userId}',
            ${stringStyles},
            ${stringTags},
            ${Number(calorie)}
            )
            UNION ALL
            SELECT (meal_info_4).*
            FROM MAKE_DISH_RECOMMENDATION(
            '${userId}',
            ${stringStyles},
            ${stringTags},
            ${Number(calorie)}
            )
        `);

        try {
            const result = await queryRunner.manager.query(`
                SELECT (meal_info_1).*
                FROM MAKE_DISH_RECOMMENDATION(
                '${userId}',
                ${stringStyles},
                ${stringTags},
                ${Number(calorie)}
                )
                UNION ALL
                SELECT (meal_info_2).*
                FROM MAKE_DISH_RECOMMENDATION(
                '${userId}',
                ${stringStyles},
                ${stringTags},
                ${Number(calorie)}
                )
                UNION ALL
                SELECT (meal_info_3).*
                FROM MAKE_DISH_RECOMMENDATION(
                '${userId}',
                ${stringStyles},
                ${stringTags},
                ${Number(calorie)}
                )
                UNION ALL
                SELECT (meal_info_4).*
                FROM MAKE_DISH_RECOMMENDATION(
                '${userId}',
                ${stringStyles},
                ${stringTags},
                ${Number(calorie)}
                )
            `);
            await queryRunner.commitTransaction();
            return result;
        } catch (e) {
            console.log(e);
            await queryRunner.rollbackTransaction();
            throw e;
        }
    }
    // 아침메뉴 추천
    async breakfast(lgn_id: string) {
        return await AppDataSource.manager.query(
            `WITH NOT_AEGY_TB AS (
                SELECT *
                  FROM TB_FOOD_INFO
                WHERE FOOD_NM NOT IN (
                                    SELECT food_nm
                                      FROM tb_food_info
                                     WHERE food_nm ~~* any (SELECT '%' || a.cd_nm || '%'
                                                              FROM TB_FOOD_CD A, TB_USER_FOOD_CD_INFO B
                                                             WHERE A.CD_SET_CD = B.CD_SET_CD
                                                               AND A.CD = B.CD
                                                               AND B.LGN_ID = '${lgn_id}'
                                                                union all
                                                            SELECT '%' || REGEXP_SPLIT_TO_TABLE(HATE_FOOD,',')|| '%'
                                                              FROM TB_USER
                                                             WHERE LGN_ID = '${lgn_id}')
                                    group by food_nm
                    )
                 AND FI_NM NOT IN (
                                    SELECT fi_nm
                                      FROM tb_food_info
                                     WHERE fi_nm ~~* any (SELECT '%' || a.cd_nm || '%'
                                                              FROM TB_FOOD_CD A, TB_USER_FOOD_CD_INFO B
                                                             WHERE A.CD_SET_CD = B.CD_SET_CD
                                                               AND A.CD = B.CD
                                                               AND B.LGN_ID = '${lgn_id}'
                                                              union all
                                                            SELECT '%' || REGEXP_SPLIT_TO_TABLE(HATE_FOOD,',')|| '%'
                                                              FROM TB_USER
                                                             WHERE LGN_ID = '${lgn_id}')
                                    group by fi_nm
                 )
    )
        /* RcmndMapper.getBreakInfo7 */
        SELECT FOOD_GROP_CD, FI_NM
                     , SUM(PRTIN) PRTIN
                     , SUM(GELY) GELY
                     , SUM(CBHDT) CBHDT
                     , SUM(CAL) CAL
                     , SUM(TOTL_PRTN) TOTL_PRTN
                  FROM (
                    SELECT '1' FOOD_GROP_CD, FI_NM
                                 , PRTIN
                                 , GELY
                                 , CBHDT
                                 , CAL
                                 , TOTL_PRTN
                    FROM (
                                     SELECT *
                                      FROM (
                                                         SELECT row_number() over (partition by fi_nm order by fi_nm) as row_num
                                                                     , FI_NM, SUM(PRTIN) PRTIN, SUM(GELY) GELY, SUM(CBHDT) CBHDT, SUM(CAL) CAL, TOTL_PRTN
                                                          FROM TB_FOOD_INFO
                                                        WHERE FI_NM IN (
                                                                                                SELECT FI_NM
                                                                                                  FROM NOT_AEGY_TB
                                                                                                 WHERE FOOD_GROP_CD = '1'
                                                                                                     AND FI_GROP_NM = '밥류'
                                                                                              GROUP BY FI_NM, TOTL_PRTN
                                                                                              ORDER BY RANDOM()
                                                                                                 LIMIT 1
                                                                      )
                                                          GROUP BY FI_NM, TOTL_PRTN
                                        ) A WHERE 1=1
                                                    AND ROW_NUM = 1
                    ) A
                UNION ALL
                    SELECT '1' FOOD_GROP_CD, FI_NM
                                 , PRTIN
                                 , GELY
                                 , CBHDT
                                 , CAL
                                 , TOTL_PRTN
                    FROM (
                                     SELECT *
                                      FROM (
                                                         SELECT row_number() over (partition by fi_nm order by fi_nm) as row_num
                                                                     , FI_NM, SUM(PRTIN) PRTIN, SUM(GELY) GELY, SUM(CBHDT) CBHDT, SUM(CAL) CAL, TOTL_PRTN
                                                          FROM TB_FOOD_INFO
                                                        WHERE FI_NM IN (
                                                                                                SELECT FI_NM
                                                                                                  FROM NOT_AEGY_TB
                                                                                                 WHERE FOOD_GROP_CD = '1'
                                                                                                     AND FI_GROP_NM = '밥류'
                                                                                              GROUP BY FI_NM, TOTL_PRTN
                                                                                              ORDER BY RANDOM()
                                                                                                 LIMIT 1
                                                                      )
                                                          GROUP BY FI_NM, TOTL_PRTN
                                        ) A WHERE 1=1
                                                    AND ROW_NUM = 1
                    ) A
                UNION ALL
                SELECT  '3' FOOD_GROP_CD, FI_NM
                            , PRTIN
                            , GELY
                            , CBHDT
                            , CAL
                            , TOTL_PRTN
                FROM (
                                SELECT ROW_NUMBER() OVER() INDX
                                             , *
                                  FROM (
                                                 SELECT row_number() over (partition by fi_nm order by fi_nm) as row_num
                                                              , FI_NM, SUM(PRTIN) PRTIN, SUM(GELY) GELY, SUM(CBHDT) CBHDT, SUM(CAL) CAL, TOTL_PRTN
                                                   FROM TB_FOOD_INFO
                                                 WHERE FI_NM IN (
                                                                                        SELECT FI_NM
                                                                                          FROM NOT_AEGY_TB
                                                                                         WHERE FOOD_GROP_CD = '3'
                                                                                             AND FI_GROP_NM NOT IN ('밥류', '면 및 만두류')
                                                                                      GROUP BY FI_NM, TOTL_PRTN
                                                                                      ORDER BY RANDOM()
                                                                                         LIMIT 1
                                                  )
                                  GROUP BY FI_NM, TOTL_PRTN
                                ) A WHERE 1=1
                                      AND ROW_NUM = 1
                ) A
                UNION ALL
                SELECT  '3' FOOD_GROP_CD, FI_NM
                            , PRTIN
                            , GELY
                            , CBHDT
                            , CAL
                            , TOTL_PRTN
                FROM (
                                SELECT ROW_NUMBER() OVER() INDX
                                             , *
                                  FROM (
                                                 SELECT row_number() over (partition by fi_nm order by fi_nm) as row_num
                                                              , FI_NM, SUM(PRTIN) PRTIN, SUM(GELY) GELY, SUM(CBHDT) CBHDT, SUM(CAL) CAL, TOTL_PRTN
                                                   FROM TB_FOOD_INFO
                                                 WHERE FI_NM IN (
                                                                                        SELECT FI_NM
                                                                                          FROM NOT_AEGY_TB
                                                                                         WHERE FOOD_GROP_CD = '3'
                                                                                             AND FI_GROP_NM NOT IN ('밥류', '면 및 만두류')
                                                                                      GROUP BY FI_NM, TOTL_PRTN
                                                                                      ORDER BY RANDOM()
                                                                                         LIMIT 1
                                                  )
                                  GROUP BY FI_NM, TOTL_PRTN
                                ) A WHERE 1=1
                                      AND ROW_NUM = 1
                ) A
    ) A GROUP BY ROLLUP((FOOD_GROP_CD, FI_NM))
           ORDER BY FOOD_GROP_CD`
        );
    }
    // 점심메뉴 추천
    async lunch(lgn_id: string) {
        return await AppDataSource.manager.query(
            `WITH NOT_AEGY_TB AS (
                SELECT *
                  FROM TB_FOOD_INFO
                WHERE FOOD_NM NOT IN (
                                    SELECT food_nm
                                      FROM tb_food_info
                                     WHERE food_nm ~~* any (SELECT '%' || a.cd_nm || '%'
                                                              FROM TB_FOOD_CD A, TB_USER_FOOD_CD_INFO B
                                                             WHERE A.CD_SET_CD = B.CD_SET_CD
                                                               AND A.CD = B.CD
                                                               AND B.LGN_ID = '${lgn_id}'
                                                                union all
                                                            SELECT '%' || REGEXP_SPLIT_TO_TABLE(HATE_FOOD,',')|| '%'
                                                              FROM TB_USER
                                                             WHERE LGN_ID = '${lgn_id}')
                                    group by food_nm
                    )
                 AND FI_NM NOT IN (
                                    SELECT fi_nm
                                      FROM tb_food_info
                                     WHERE fi_nm ~~* any (SELECT '%' || a.cd_nm || '%'
                                                              FROM TB_FOOD_CD A, TB_USER_FOOD_CD_INFO B
                                                             WHERE A.CD_SET_CD = B.CD_SET_CD
                                                               AND A.CD = B.CD
                                                               AND B.LGN_ID = '${lgn_id}'
                                                              union all
                                                            SELECT '%' || REGEXP_SPLIT_TO_TABLE(HATE_FOOD,',')|| '%'
                                                              FROM TB_USER
                                                             WHERE LGN_ID = '${lgn_id}')
                                    group by fi_nm
                 )
    )
        /* RcmndMapper.getLunchInfo7 */
            SELECT FOOD_GROP_CD, FI_NM
                         , SUM(PRTIN) PRTIN
                         , SUM(GELY) GELY
                         , SUM(CBHDT) CBHDT
                         , SUM(CAL) CAL
                         , SUM(TOTL_PRTN) TOTL_PRTN
          FROM (
                        SELECT '1' FOOD_GROP_CD, FI_NM
                                     , PRTIN
                                     , GELY
                                     , CBHDT
                                     , CAL
                                     , TOTL_PRTN
                        FROM (
                                        SELECT *
                                          FROM (
                                                             SELECT row_number() over (partition by fi_nm order by fi_nm) as row_num
                                                                         , FI_NM, SUM(PRTIN) PRTIN, SUM(GELY) GELY, SUM(CBHDT) CBHDT, SUM(CAL) CAL, TOTL_PRTN
                                                              FROM TB_FOOD_INFO
                                                            WHERE FI_NM IN (
                                                                                                SELECT FI_NM
                                                                                                  FROM NOT_AEGY_TB
                                                                                                WHERE FOOD_GROP_CD = '1'
                                                                                                      AND FI_GROP_NM IN ('밥류', '볶음류', '죽 및 스프류', '면 및 만두류')
                                                                                           GROUP BY FI_NM, TOTL_PRTN
                                                                                            ORDER BY RANDOM()
                                                                                                    LIMIT 1
                                                                                  )
                                                                          GROUP BY FI_NM, TOTL_PRTN
                                            ) A WHERE 1=1
                                                        AND ROW_NUM = 1
                ) A
                UNION ALL
                SELECT '1' FOOD_GROP_CD, FI_NM
                                     , PRTIN
                                     , GELY
                                     , CBHDT
                                     , CAL
                                     , TOTL_PRTN
                        FROM (
                                        SELECT *
                                          FROM (
                                                             SELECT row_number() over (partition by fi_nm order by fi_nm) as row_num
                                                                         , FI_NM, SUM(PRTIN) PRTIN, SUM(GELY) GELY, SUM(CBHDT) CBHDT, SUM(CAL) CAL, TOTL_PRTN
                                                              FROM TB_FOOD_INFO
                                                            WHERE FI_NM IN (
                                                                                                SELECT FI_NM
                                                                                                  FROM NOT_AEGY_TB
                                                                                                WHERE FOOD_GROP_CD = '1'
                                                                                                      AND FI_GROP_NM IN ('밥류', '볶음류', '죽 및 스프류', '면 및 만두류')
                                                                                           GROUP BY FI_NM, TOTL_PRTN
                                                                                            ORDER BY RANDOM()
                                                                                                    LIMIT 1
                                                                                  )
                                                                          GROUP BY FI_NM, TOTL_PRTN
                                            ) A WHERE 1=1
                                                        AND ROW_NUM = 1
                ) A
                UNION ALL
                SELECT  '3' FOOD_GROP_CD, FI_NM
                            , PRTIN
                            , GELY
                            , CBHDT
                            , CAL
                            , TOTL_PRTN
                FROM (
                                SELECT ROW_NUMBER() OVER() INDX
                                            , *
                                  FROM (
                                                     SELECT row_number() over (partition by fi_nm order by fi_nm) as row_num
                                                                 , FI_NM, SUM(PRTIN) PRTIN, SUM(GELY) GELY, SUM(CBHDT) CBHDT, SUM(CAL) CAL, TOTL_PRTN
                                                       FROM TB_FOOD_INFO
                                                      WHERE FI_NM IN (
                                                                                                SELECT FI_NM
                                                                                                  FROM NOT_AEGY_TB
                                                                                                 WHERE FOOD_GROP_CD = '3'
                                                                                                       AND FI_GROP_NM NOT IN ('밥류', '볶음류', '죽 및 스프류', '면 및 만두류')
                                                                                            GROUP BY FI_NM, TOTL_PRTN
                                                                                             ORDER BY RANDOM()
                                                                                                     LIMIT 1
                                                          )
                                                      GROUP BY FI_NM, TOTL_PRTN
                                ) A WHERE 1=1
                                            AND ROW_NUM = 1
                ) A
    ) A
         GROUP BY ROLLUP((FOOD_GROP_CD, FI_NM))
          ORDER BY FOOD_GROP_CD`
        );
    }

    // 저녁메뉴 추천
    async dinner(lgn_id: string) {
        return await AppDataSource.manager.query(
            `WITH NOT_AEGY_TB AS (
                SELECT *
                  FROM TB_FOOD_INFO
                WHERE FOOD_NM NOT IN (
                                    SELECT food_nm
                                      FROM tb_food_info
                                     WHERE food_nm ~~* any (SELECT '%' || a.cd_nm || '%'
                                                              FROM TB_FOOD_CD A, TB_USER_FOOD_CD_INFO B
                                                             WHERE A.CD_SET_CD = B.CD_SET_CD
                                                               AND A.CD = B.CD
                                                               AND B.LGN_ID = '${lgn_id}'
                                                                union all
                                                            SELECT '%' || REGEXP_SPLIT_TO_TABLE(HATE_FOOD,',')|| '%'
                                                              FROM TB_USER
                                                             WHERE LGN_ID = '${lgn_id}')
                                    group by food_nm
                    )
                 AND FI_NM NOT IN (
                                    SELECT fi_nm
                                      FROM tb_food_info
                                     WHERE fi_nm ~~* any (SELECT '%' || a.cd_nm || '%'
                                                              FROM TB_FOOD_CD A, TB_USER_FOOD_CD_INFO B
                                                             WHERE A.CD_SET_CD = B.CD_SET_CD
                                                               AND A.CD = B.CD
                                                               AND B.LGN_ID = '${lgn_id}'
                                                              union all
                                                            SELECT '%' || REGEXP_SPLIT_TO_TABLE(HATE_FOOD,',')|| '%'
                                                              FROM TB_USER
                                                             WHERE LGN_ID = '${lgn_id}')
                                    group by fi_nm
                 )
    )
        /* RcmndMapper.getDinnerInfo7 */
        SELECT FOOD_GROP_CD, FI_NM
                     , SUM(PRTIN) PRTIN
                     , SUM(GELY) GELY
                     , SUM(CBHDT) CBHDT
                     , SUM(CAL) CAL
                     , SUM(TOTL_PRTN) TOTL_PRTN
          FROM (
                            SELECT '1' FOOD_GROP_CD, FI_NM
                                         , ROUND(PRTIN/2,2) PRTIN
                                         , ROUND(GELY/2,2) GELY
                                         , ROUND(CBHDT/2,2) CBHDT
                                         , ROUND(CAL/2,2) CAL
                                         , ROUND(TOTL_PRTN/2,2) TOTL_PRTN
                            FROM (
                                            SELECT *
                                              FROM (
                                                                 SELECT row_number() over (partition by fi_nm order by fi_nm) as row_num
                                                                             , FI_NM, SUM(PRTIN) PRTIN, SUM(GELY) GELY, SUM(CBHDT) CBHDT, SUM(CAL) CAL, TOTL_PRTN
                                                                   FROM TB_FOOD_INFO
                                                                  WHERE FI_NM IN (
                                                                                                        SELECT FI_NM
                                                                                                          FROM NOT_AEGY_TB
                                                                                                        WHERE FOOD_GROP_CD = '1'
                                                                                                              AND FI_GROP_NM NOT IN ('밥류')
                                                                                                   GROUP BY FI_NM, TOTL_PRTN
                                                                                                   ORDER BY RANDOM()
                                                                                                           LIMIT 1
                                                                  )
                                                                  GROUP BY FI_NM, TOTL_PRTN
                                            ) A WHERE 1=1
                                                  AND ROW_NUM = 1
                        ) A
                UNION ALL
                SELECT  '3' FOOD_GROP_CD, FI_NM
                            , ROUND(PRTIN/2,2) PRTIN
                            , ROUND(GELY/2,2) GELY
                            , ROUND(CBHDT/2,2) CBHDT
                            , ROUND(CAL/2,2) CAL
                            , ROUND(TOTL_PRTN/2,2) TOTL_PRTN
                FROM (
                                SELECT ROW_NUMBER() OVER() INDX
                                            , *
                                  FROM (
                                                     SELECT row_number() over (partition by fi_nm order by fi_nm) as row_num
                                                                 , FI_NM, SUM(PRTIN) PRTIN, SUM(GELY) GELY, SUM(CBHDT) CBHDT, SUM(CAL) CAL, TOTL_PRTN
                                                       FROM TB_FOOD_INFO
                                                      WHERE FI_NM IN (
                                                                                                SELECT FI_NM
                                                                                                  FROM NOT_AEGY_TB
                                                                                                 WHERE FOOD_GROP_CD = '3'
                                                                                                       AND FI_GROP_NM NOT IN ('밥류', '볶음류', '죽 및 스프류', '면 및 만두류')
                                                                                            GROUP BY FI_NM, TOTL_PRTN
                                                                                             ORDER BY RANDOM()
                                                                                                     LIMIT 1
                                                          )
                                                      GROUP BY FI_NM, TOTL_PRTN
                                ) A WHERE 1=1
                                            AND ROW_NUM = 1
                ) A
        ) A
             GROUP BY ROLLUP((FOOD_GROP_CD, FI_NM))`
        );
    }
}
