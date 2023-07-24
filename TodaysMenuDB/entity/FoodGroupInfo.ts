import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FoodInfo } from "./FoodInfo";

@Index("food_group_info_pkey", ["fodgrpCd"], { unique: true })
@Entity("food_group_info", { schema: "public" })
export class FoodGroupInfo {
  @PrimaryGeneratedColumn({ type: "integer", name: "fodgrp_cd" })
  fodgrpCd: number;

  @Column("character varying", { name: "fodgrp_nm", length: 10 })
  fodgrpNm: string;

  @OneToMany(() => FoodInfo, (foodInfo) => foodInfo.fodgrpCd)
  foodInfos: FoodInfo[];
}
