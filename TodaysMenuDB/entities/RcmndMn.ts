import { Column, Entity, Index } from "typeorm";

@Index("rcmnd_mn_pkey", ["fmnCd"], { unique: true })
@Entity("rcmnd_mn", { schema: "public" })
export class RcmndMn {
  @Column("integer", { name: "ctgy_cd", nullable: true })
  ctgyCd: number | null;

  @Column("character varying", { primary: true, name: "fmn_cd", length: 10 })
  fmnCd: string;

  @Column("integer", { name: "fodgrp_cd", nullable: true })
  fodgrpCd: number | null;

  @Column("character varying", { name: "sources", nullable: true, length: 7 })
  sources: string | null;

  @Column("character varying", { name: "fodgrp", nullable: true, length: 10 })
  fodgrp: string | null;

  @Column("character varying", { name: "food_nm", nullable: true, length: 20 })
  foodNm: string | null;
}
