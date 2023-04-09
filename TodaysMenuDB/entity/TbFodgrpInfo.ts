import { Column, Entity, Index } from "typeorm";

// @Index("pk_tb_fodgrp_info", ["cal"], { unique: true })
@Entity("tb_fodgrp_info", { schema: "public" })
export class TbFodgrpInfo {
  @Column("numeric", { primary: true, name: "cal", precision: 10, scale: 0 })
  cal: string;

  @Column("numeric", {
    name: "fodgrp_1",
    nullable: true,
    precision: 5,
    scale: 1,
  })
  fodgrp_1: string | null;

  @Column("numeric", {
    name: "fodgrp_2",
    nullable: true,
    precision: 5,
    scale: 1,
  })
  fodgrp_2: string | null;

  @Column("numeric", {
    name: "fodgrp_3",
    nullable: true,
    precision: 5,
    scale: 1,
  })
  fodgrp_3: string | null;

  @Column("numeric", {
    name: "fodgrp_4",
    nullable: true,
    precision: 5,
    scale: 1,
  })
  fodgrp_4: string | null;

  @Column("numeric", {
    name: "fodgrp_5",
    nullable: true,
    precision: 5,
    scale: 1,
  })
  fodgrp_5: string | null;

  @Column("numeric", {
    name: "fodgrp_6",
    nullable: true,
    precision: 5,
    scale: 1,
  })
  fodgrp_6: string | null;

  @Column("character varying", { name: "rgsr_id", length: 24 })
  rgsrId: string;

  @Column("character", { name: "rgsn_dttm", length: 14 })
  rgsnDttm: string;

  @Column("character varying", { name: "amnd_id", length: 24 })
  amndId: string;

  @Column("character", { name: "amnt_dttm", length: 14 })
  amntDttm: string;
}
