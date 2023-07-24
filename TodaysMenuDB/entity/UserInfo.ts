import { Column, Entity, Index, OneToMany, OneToOne } from "typeorm";
import { UserAllergyInfo } from "./UserAllergyInfo";
import { UserExercise } from "./UserExercise";

@Index("user_info_account_key", ["account"], { unique: true })
@Index("user_info_pkey", ["userId"], { unique: true })
@Entity("user_info", { schema: "public" })
export class UserInfo {
  @Column("uuid", {
    primary: true,
    name: "user_id",
    default: () => "uuid_generate_v4()",
  })
  userId: string;

  @Column("character varying", { name: "account", unique: true, length: 24 })
  account: string;

  @Column("character varying", { name: "user_name", length: 50 })
  userName: string;

  @Column("character varying", { name: "pwd", length: 100 })
  pwd: string;

  @Column("character varying", { name: "email", length: 100 })
  email: string;

  @Column("integer", { name: "gender" })
  gender: number;

  @Column("date", { name: "birth" })
  birth: string;

  @Column("numeric", { name: "height", precision: 5, scale: 2 })
  height: number;

  @Column("numeric", { name: "weight", precision: 5, scale: 2 })
  weight: number;

  @Column("timestamp without time zone", {
    name: "register_date",
    default: () => "now()",
  })
  registerDate: Date;

  @OneToMany(() => UserAllergyInfo, (userAllergyInfo) => userAllergyInfo.user)
  userAllergyInfos: UserAllergyInfo[];

  @OneToOne(() => UserExercise, (userExercise) => userExercise.user)
  userExercise: UserExercise;
}
