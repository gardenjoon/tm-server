import { Column, Entity, Index } from "typeorm";

@Index("pk_tb_food_info", ["foodGropCd", "foodGropSqno"], { unique: true })
@Entity("tb_food_info", { schema: "public" })
export class TbFoodInfo {
  @Column("character varying", {
    primary: true,
    name: "food_grop_cd",
    length: 6,
  })
  foodGropCd: string;

  @Column("numeric", {
    primary: true,
    name: "food_grop_sqno",
    precision: 5,
    scale: 0,
  })
  foodGropSqno: string;

  @Column("character varying", { name: "fodgrp", nullable: true, length: 6 })
  fodgrp: string | null;

  @Column("character varying", { name: "food_nm", nullable: true, length: 50 })
  foodNm: string | null;

  @Column("character varying", { name: "fi_cd", nullable: true, length: 20 })
  fiCd: string | null;

  @Column("character varying", {
    name: "fi_grop_nm",
    nullable: true,
    length: 50,
  })
  fiGropNm: string | null;

  @Column("character varying", { name: "fi_nm", nullable: true, length: 50 })
  fiNm: string | null;

  @Column("numeric", { name: "prtin", nullable: true, precision: 10, scale: 2 })
  prtin: string | null;

  @Column("numeric", { name: "gely", nullable: true, precision: 10, scale: 2 })
  gely: string | null;

  @Column("numeric", { name: "cbhdt", nullable: true, precision: 10, scale: 2 })
  cbhdt: string | null;

  @Column("numeric", { name: "cal", nullable: true, precision: 10, scale: 2 })
  cal: string | null;

  @Column("numeric", {
    name: "totl_prtn",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  totlPrtn: string | null;

  @Column("numeric", {
    name: "amnt_ing",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  amntIng: string | null;

  @Column("character varying", { name: "rgsr_id", length: 24 })
  rgsrId: string;

  @Column("character", { name: "rgsn_dttm", length: 14 })
  rgsnDttm: string;

  @Column("character varying", { name: "amnd_id", length: 24 })
  amndId: string;

  @Column("character", { name: "amnt_dttm", length: 14 })
  amntDttm: string;
}
