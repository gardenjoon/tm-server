import { Column, Entity, Index } from "typeorm";

@Index("pk_tb_rest_info", ["restId", "restNm"], { unique: true })
@Entity("tb_rest_info", { schema: "public" })
export class TbRestInfo {
  @Column("numeric", { primary: true, name: "rest_id", precision: 5, scale: 0 })
  restId: string;

  @Column("character varying", { primary: true, name: "rest_nm", length: 50 })
  restNm: string;

  @Column("numeric", { name: "ctgy", nullable: true, precision: 5, scale: 0 })
  ctgy: string | null;

  @Column("character varying", {
    name: "img_url_addr",
    nullable: true,
    length: 500,
  })
  imgUrlAddr: string | null;

  @Column("character varying", { name: "rgsr_id", length: 24 })
  rgsrId: string;

  @Column("character", { name: "rgsn_dttm", length: 14 })
  rgsnDttm: string;

  @Column("character varying", { name: "amnd_id", length: 24 })
  amndId: string;

  @Column("character", { name: "amnt_dttm", length: 14 })
  amntDttm: string;
}
