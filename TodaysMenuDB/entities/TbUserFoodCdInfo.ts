import { Column, Entity, Index } from "typeorm";

@Index("pk_tb_user_food_cd_info", ["cd", "cdSetCd", "lgnId", "userId"], {
  unique: true,
})
@Entity("tb_user_food_cd_info", { schema: "public" })
export class TbUserFoodCdInfo {
  @Column("character varying", { primary: true, name: "user_id", length: 24 })
  userId: string;

  @Column("character varying", { primary: true, name: "cd_set_cd", length: 6 })
  cdSetCd: string;

  @Column("character varying", { primary: true, name: "cd", length: 6 })
  cd: string;

  @Column("character varying", { primary: true, name: "lgn_id", length: 24 })
  lgnId: string;

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
}
