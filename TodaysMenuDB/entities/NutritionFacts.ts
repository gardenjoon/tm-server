import { Column, Entity, Index } from "typeorm";

@Index("nutrition_facts_pkey", ["ageRange", "gender"], { unique: true })
@Entity("nutrition_facts", { schema: "public" })
export class NutritionFacts {
  @Column("character varying", { primary: true, name: "gender", length: 2 })
  gender: string;

  @Column("character varying", { primary: true, name: "age_range", length: 20 })
  ageRange: string;

  @Column("integer", { name: "suf_sodium", nullable: true })
  sufSodium: number | null;

  @Column("integer", { name: "max_sodium", nullable: true })
  maxSodium: number | null;

  @Column("numeric", {
    name: "suf_sugar",
    nullable: true,
    precision: 5,
    scale: 2,
  })
  sufSugar: string | null;
}
