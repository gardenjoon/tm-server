import { Column, Entity, Index } from "typeorm";

@Index("pk_tb_food_cd", ["cd", "cdSetCd"], { unique: true })
@Entity("tb_food_cd", { schema: "public" })
export class TbFoodCd {
  @Column("character varying", { primary: true, name: "cd_set_cd", length: 6 })
  cdSetCd: string;

  @Column("character varying", { primary: true, name: "cd", length: 6 })
  cd: string;

  @Column("character varying", { name: "cd_nm", nullable: true, length: 50 })
  cdNm: string | null;

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
