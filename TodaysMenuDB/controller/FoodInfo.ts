import { Repository } from "typeorm";
import { AppDataSource, Entity } from "..";
import { TbFoodInfo } from "../entities/TbFoodInfo";

// 권장칼로리 and 섭취칼로리 쿼리
export class FoodInfoRepository extends Repository<TbFoodInfo> {
    async bodyInfo(lgn_id: string) {
        return await AppDataSource.manager.query(
            `SELECT A.*
            , ((CASE WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '10' THEN 35 -- 과체중 고신체활동
                            WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '20' THEN 30 -- 과체중 중신체활동
                            WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '30' THEN 25 -- 과체중 저신체활동
                            WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '10' THEN 40 -- 정상 고신체활동
                            WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '20' THEN 35 -- 정상 중신체활동
                            WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '30' THEN 30 -- 정상 저신체활동
                            WHEN A.BMI < 18.5 AND A.BODY_ACTY = '10' THEN 45 -- 저체중 고신체활동
                            WHEN A.BMI < 18.5 AND A.BODY_ACTY = '20' THEN 40 -- 저체중 중신체활동
                            WHEN A.BMI < 18.5 AND A.BODY_ACTY = '30' THEN 35 -- 저체중 저신체활동
                            END) * A.BDWG) AVG_CAL -- 하루섭취권장열량
            , ROUND(((CASE WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '10' THEN 35 -- 과체중 고신체활동
                                            WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '20' THEN 30 -- 과체중 중신체활동
                                            WHEN A.BMI >= 25.0 AND A.BODY_ACTY = '30' THEN 25 -- 과체중 저신체활동
                                            WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '10' THEN 40 -- 정상 고신체활동
                                            WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '20' THEN 35 -- 정상 중신체활동
                                            WHEN (A.BMI BETWEEN 18.5 AND 25.0) AND A.BODY_ACTY = '30' THEN 30 -- 정상 저신체활동
                                            WHEN A.BMI < 18.5 AND A.BODY_ACTY = '10' THEN 45 -- 저체중 고신체활동
                                            WHEN A.BMI < 18.5 AND A.BODY_ACTY = '20' THEN 40 -- 저체중 중신체활동
                                            WHEN A.BMI < 18.5 AND A.BODY_ACTY = '30' THEN 35 -- 저체중 저신체활동
                                            END) * A.BDWG) / 3,2) MEAL_CAL -- 한끼섭취권장열량
            FROM (
                   SELECT A.BDWG
                                , A.BMI
                                , A.AVG_KG
                                , (CASE WHEN A.WKLY_BEST_ACTV_DYCNT >= 3 OR A.BEST_MET >= 1500 OR A.TOTL_MET >= 3000 THEN '10'
                                               WHEN (A.DY_BEST_ACTV_HR >= 20 AND A.WKLY_BEST_ACTV_DYCNT >=3) OR A.DY_MDDL_ACTV_MIN >= 30 OR A.WORKING_DAY >= 5 OR A.TOTL_MET >= 600 THEN '20'
                                                   ELSE '30' END) BODY_ACTY -- 10: 고신체활동, 20: 중신체활동, 30: 저신체활동
                    FROM (
                                       SELECT A.*
                                                    , (3.3 * WORKING_HOUR * WORKING_DAY) WORKING_MET -- 걷기활동 MET
                                                    , (4.0 * DY_MDDL_ACTV_HR * WKLY_MDDL_ACTV_DYCNT) MDDL_MET -- 중간정도활동 MET
                                                    , (8.0 * DY_BEST_ACTV_HR * WKLY_BEST_ACTV_DYCNT) BEST_MET -- 격렬한 활동 MET
                                                    , (3.3 * WORKING_HOUR * WORKING_DAY) + (4.0 * DY_MDDL_ACTV_HR * WKLY_MDDL_ACTV_DYCNT) + (8.0 * DY_BEST_ACTV_HR * WKLY_BEST_ACTV_DYCNT) TOTL_MET
                                         FROM (
                                                           SELECT BDWG
                                                                        , ROUND(BDWG / (ROUND(STTR * 0.01,2) * ROUND(STTR * 0.01,2)),1) BMI
                                                                        , ROUND((case when GNDR_CD = '10' then (ROUND(STTR * 0.01,2) * ROUND(STTR * 0.01,2)) * 22
                                                                                                      when GNDR_CD = '20' then (ROUND(STTR * 0.01,2) * ROUND(STTR * 0.01,2)) * 21 end),2) AVG_KG -- 표준무게
                                                                        , WORKING_DAY::numeric -- 걷기 일수
                                                                        , WKLY_BEST_ACTV_DYCNT::numeric -- 고강도 일수
                                                                        , WKLY_MDDL_ACTV_DYCNT::numeric -- 중강도 일수
                                                                        , WORKING_HOUR::numeric -- 하루동안 걷기 시간
                                                                        , DY_BEST_ACTV_HR::numeric -- 하루동안 고강도 시간
                                                                        , DY_MDDL_ACTV_HR::numeric -- 하루동안 중강도 시간
                                                                        , WORKING_MIN::numeric -- 하루동안 걷기 분
                                                                        , DY_BEST_ACTV_MIN::numeric -- 하루동안 고강도 분
                                                                        , DY_MDDL_ACTV_MIN::numeric -- 하루동안 중강도 분
                                                             FROM TB_USER
                                                          WHERE LGN_ID = '${lgn_id}'
                                           ) A
                       ) A
            ) A`
        );
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
        )
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
        )
    }
}
