import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AllergySet } from "./AllergySet";
import { UserAllergyInfo } from "./UserAllergyInfo";

@Index("allergy_info_pkey", ["algyId"], { unique: true })
@Index("allergy_info_algy_nm_key", ["algyNm"], { unique: true })
@Entity("allergy_info", { schema: "public" })
export class AllergyInfo {
  @PrimaryGeneratedColumn({ type: "integer", name: "algy_id" })
  algyId: number;

  @Column("integer", { name: "algy_sqno", nullable: true })
  algySqno: number | null;

  @Column("character varying", {
    name: "algy_nm",
    nullable: true,
    unique: true,
    length: 20,
  })
  algyNm: string | null;

  @ManyToOne(() => AllergySet, (allergySet) => allergySet.allergyInfos)
  @JoinColumn([{ name: "algy_set_id", referencedColumnName: "algySetId" }])
  algySet: AllergySet;

  @OneToMany(() => UserAllergyInfo, (userAllergyInfo) => userAllergyInfo.algy)
  userAllergyInfos: UserAllergyInfo[];
}
