import { Column, Entity, Index, OneToMany } from "typeorm";
import { AllergyInfo } from "./AllergyInfo";

@Index("allergy_set_pkey", ["algySetId"], { unique: true })
@Index("allergy_set_algy_set_nm_key", ["algySetNm"], { unique: true })
@Entity("allergy_set", { schema: "public" })
export class AllergySet {
  @Column("integer", { primary: true, name: "algy_set_id" })
  algySetId: number;

  @Column("character varying", {
    name: "algy_set_nm",
    unique: true,
    length: 15,
  })
  algySetNm: string;

  @OneToMany(() => AllergyInfo, (allergyInfo) => allergyInfo.algySet)
  allergyInfos: AllergyInfo[];
}
