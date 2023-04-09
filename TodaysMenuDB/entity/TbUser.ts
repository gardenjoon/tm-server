import { Column, Entity, Index, OneToMany } from "typeorm";
import { TbUserFoodCdInfo } from "./TbUserFoodCdInfo";

// @Index("pk_tb_user", ["lgnId"], { unique: true })
@Entity("tb_user", { schema: "public" })
export class TbUser {
  @Column("character varying", { name: "user_id", length: 24 })
  userId: string;

  @Column("character varying", { primary: true, name: "lgn_id", length: 24 })
  lgnId: string;

  @Column("character varying", { name: "user_nm", nullable: true, length: 50 })
  userNm: string | null;

  @Column("character varying", { name: "pwd", nullable: true, length: 100 })
  pwd: string | null;

  @Column("character varying", {
    name: "emil_addr",
    nullable: true,
    length: 100,
  })
  emilAddr: string | null;

  @Column("character varying", { name: "gndr_cd", nullable: true, length: 6 })
  gndrCd: string | null;

  @Column("numeric", { name: "age", nullable: true, precision: 2, scale: 0 })
  age: string | null;

  @Column("numeric", { name: "sttr", nullable: true, precision: 5, scale: 2 })
  sttr: string | null;

  @Column("numeric", { name: "bdwg", nullable: true, precision: 5, scale: 2 })
  bdwg: string | null;

  @Column("character varying", {
    name: "hate_food",
    nullable: true,
    length: 500,
  })
  hateFood: string | null;

  @Column("character varying", {
    name: "like_food",
    nullable: true,
    length: 500,
  })
  likeFood: string | null;

  @Column("numeric", {
    name: "wkly_best_actv_dycnt",
    nullable: true,
    precision: 5,
    scale: 0,
  })
  wklyBestActvDycnt: string | null;

  @Column("numeric", {
    name: "wkly_mddl_actv_dycnt",
    nullable: true,
    precision: 5,
    scale: 0,
  })
  wklyMddlActvDycnt: string | null;

  @Column("character", { name: "dy_best_actv_hr", nullable: true, length: 4 })
  dyBestActvHr: string | null;

  @Column("character", { name: "dy_best_actv_min", nullable: true, length: 4 })
  dyBestActvMin: string | null;

  @Column("character", { name: "dy_mddl_actv_hr", nullable: true, length: 4 })
  dyMddlActvHr: string | null;

  @Column("character", { name: "dy_mddl_actv_min", nullable: true, length: 4 })
  dyMddlActvMin: string | null;

  @Column("character", { name: "working_day", nullable: true, length: 4 })
  workingDay: string | null;

  @Column("character", { name: "working_hour", nullable: true, length: 4 })
  workingHour: string | null;

  @Column("character", { name: "working_min", nullable: true, length: 4 })
  workingMin: string | null;

  @Column("character varying", { name: "athr_cd", nullable: true, length: 6 })
  athrCd: string | null;

  @Column("character", {
    name: "use_yn",
    nullable: true,
    length: 1,
    default: () => "'Y'",
  })
  useYn: string | null;

  @Column("character varying", { name: "rgsr_id", length: 24 })
  rgsrId: string;

  @Column("character", { name: "rgsn_dttm", length: 14 })
  rgsnDttm: string;

  @Column("character varying", { name: "amnd_id", length: 24 })
  amndId: string;

  @Column("character", { name: "amnt_dttm", length: 14 })
  amntDttm: string;

  @OneToMany(() => TbUserFoodCdInfo, userFoodInfo => userFoodInfo.userId)
  allergies: TbUserFoodCdInfo[]
}
