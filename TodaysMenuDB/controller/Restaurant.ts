import { Repository } from "typeorm";
import { AppDataSource } from "..";
import { TbRestInfo } from "../entity/TbRestInfo";

export class RestaurantRepository extends Repository<TbRestInfo> {
    async getRestaurantList(rest_id?: string, rest_nm?: string, place_nm?: string, stt_no?: string, end_no?: string) {
        return await AppDataSource.manager.query(
            `SELECT A.* 
            FROM (
                SELECT ROW_NUMBER() OVER(ORDER BY REST_ID) AS PAGE_INDX
                     , (CASE WHEN CTGY = '1' THEN '한식' ELSE
                       (CASE WHEN CTGY = '2' THEN '분식' ELSE
                       (CASE WHEN CTGY = '3' THEN '치킨' ELSE
                       (CASE WHEN CTGY = '4' THEN '패스트푸드' ELSE
                       (CASE WHEN CTGY = '5' THEN '족발·보쌈' ELSE
                       (CASE WHEN CTGY = '6' THEN '카페' ELSE
                       (CASE WHEN CTGY = '7' OR CTGY = '8' THEN '기타' END)END)END)END)END)END)END)AS CTGY_NM
                     , REST_ID, REST_NM, CTGY, IMG_URL_ADDR
                     , RGSR_ID, RGSN_DTTM, AMND_ID, AMNT_DTTM
                  FROM TB_REST_INFO
            ) A 
                    `
        );
    }
}
