import { Column, Entity } from "typeorm";

@Entity("test_food_ingr", { schema: "public" })
export class TestFoodIngr {
  @Column("character varying", { name: "fi_grop_nm", length: 50 })
  fiGropNm: string;

  @Column("character varying", { name: "fi_nm", length: 50 })
  fiNm: string;

  @Column("character varying", { name: "food_nm", length: 50 })
  foodNm: string;

  @Column("character varying", { name: "fi_cd", length: 20 })
  fiCd: string;
}
