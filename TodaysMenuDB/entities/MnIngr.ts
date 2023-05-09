import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("mn_ingr_pkey", ["sqno"], { unique: true })
@Entity("mn_ingr", { schema: "public" })
export class MnIngr {
  @PrimaryGeneratedColumn({ type: "integer", name: "sqno" })
  sqno: number;

  @Column("character varying", { name: "fmn_cd", nullable: true, length: 10 })
  fmnCd: string | null;

  @Column("character varying", { name: "sources", nullable: true, length: 7 })
  sources: string | null;

  @Column("character varying", {
    name: "food_grop",
    nullable: true,
    length: 15,
  })
  foodGrop: string | null;

  @Column("character varying", { name: "food_nm", nullable: true, length: 50 })
  foodNm: string | null;

  @Column("integer", { name: "food_amt", nullable: true })
  foodAmt: number | null;

  @Column("character varying", { name: "fi_nm", nullable: true, length: 50 })
  fiNm: string | null;

  @Column("character varying", { name: "fi_cd", nullable: true, length: 20 })
  fiCd: string | null;

  @Column("numeric", { name: "fi_amt", nullable: true, precision: 5, scale: 2 })
  fiAmt: string | null;
}
