import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { FoodGroupInfo } from "./FoodGroupInfo";

@Index("food_info_pkey", ["foodId"], { unique: true })
@Entity("food_info", { schema: "public" })
export class FoodInfo {
  @Column("character varying", { primary: true, name: "food_id", length: 10 })
  foodId: string;

  @Column("character varying", { name: "src", length: 5 })
  src: string;

  @Column("character varying", { name: "food_nm", length: 50 })
  foodNm: string;

  @Column("numeric", { name: "total_amt", precision: 10, scale: 2 })
  totalAmt: string;

  @Column("numeric", { name: "total_cal", precision: 10, scale: 2 })
  totalCal: string;

  @Column("numeric", { name: "total_carbo", precision: 10, scale: 2 })
  totalCarbo: string;

  @Column("numeric", { name: "total_prot", precision: 10, scale: 2 })
  totalProt: string;

  @Column("numeric", { name: "total_fat", precision: 10, scale: 2 })
  totalFat: string;

  @Column("numeric", { name: "total_na", precision: 10, scale: 2 })
  totalNa: string;

  @Column("numeric", { name: "total_sugar", precision: 10, scale: 2 })
  totalSugar: string;

  @Column("numeric", { name: "sty_kr", precision: 2, scale: 1 })
  styKr: string;

  @Column("numeric", { name: "sty_cn", precision: 2, scale: 1 })
  styCn: string;

  @Column("numeric", { name: "sty_jp", precision: 2, scale: 1 })
  styJp: string;

  @Column("numeric", { name: "sty_ws", precision: 2, scale: 1 })
  styWs: string;

  @Column("integer", { name: "lv_spicy" })
  lvSpicy: number;

  @Column("integer", { name: "hg_prot" })
  hgProt: number;

  @Column("integer", { name: "lw_cal" })
  lwCal: number;

  @Column("integer", { name: "lv_fat" })
  lvFat: number;

  @Column("integer", { name: "lv_na" })
  lvNa: number;

  @Column("integer", { name: "lv_su" })
  lvSu: number;

  @Column("integer", { name: "vegetable" })
  vegetable: number;

  @Column("integer", { name: "meat" })
  meat: number;

  @Column("integer", { name: "seafood" })
  seafood: number;

  @ManyToOne(() => FoodGroupInfo, (foodGroupInfo) => foodGroupInfo.foodInfos)
  @JoinColumn([{ name: "fodgrp_cd", referencedColumnName: "fodgrpCd" }])
  fodgrpCd: FoodGroupInfo;
}
