import { Column, Entity, Index } from "typeorm";

// @Index("pk_tb_rest_menu_info", ["restId", "restNm", "sqno"], { unique: true })
@Entity("tb_rest_menu_info", { schema: "public" })
export class TbRestMenuInfo {
  @Column("numeric", { primary: true, name: "rest_id", precision: 5, scale: 0 })
  restId: string;

  @Column("character varying", { primary: true, name: "rest_nm", length: 50 })
  restNm: string;

  @Column("numeric", { primary: true, name: "sqno", precision: 5, scale: 0 })
  sqno: string;

  @Column("character varying", { name: "menu_nm", nullable: true, length: 50 })
  menuNm: string | null;

  @Column("character varying", {
    name: "menu_info",
    nullable: true,
    length: 500,
  })
  menuInfo: string | null;

  @Column("numeric", { name: "cal", nullable: true, precision: 10, scale: 2 })
  cal: string | null;

  @Column("numeric", { name: "cbhdt", nullable: true, precision: 10, scale: 2 })
  cbhdt: string | null;

  @Column("numeric", { name: "gely", nullable: true, precision: 10, scale: 2 })
  gely: string | null;

  @Column("numeric", { name: "na", nullable: true, precision: 10, scale: 2 })
  na: string | null;

  @Column("numeric", { name: "prtin", nullable: true, precision: 10, scale: 2 })
  prtin: string | null;

  @Column("numeric", { name: "sugar", nullable: true, precision: 10, scale: 2 })
  sugar: string | null;

  @Column("character varying", {
    name: "img_url_addr",
    nullable: true,
    length: 500,
  })
  imgUrlAddr: string | null;

  @Column("numeric", { name: "amt", nullable: true, precision: 18, scale: 0 })
  amt: string | null;

  @Column("character varying", { name: "rgsr_id", length: 24 })
  rgsrId: string;

  @Column("character", { name: "rgsn_dttm", length: 14 })
  rgsnDttm: string;

  @Column("character varying", { name: "amnd_id", length: 24 })
  amndId: string;

  @Column("character", { name: "amnt_dttm", length: 14 })
  amntDttm: string;
}
