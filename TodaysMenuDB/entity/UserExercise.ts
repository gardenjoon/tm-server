import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { UserInfo } from "./UserInfo";

@Index("user_exercise_pkey", ["userId"], { unique: true })
@Entity("user_exercise", { schema: "public" })
export class UserExercise {
  @Column("uuid", { primary: true, name: "user_id" })
  userId: string;

  @Column("integer", { name: "wk_hg_act", nullable: true })
  wkHgAct: number | null;

  @Column("integer", { name: "dy_hg_act_hr", nullable: true })
  dyHgActHr: number | null;

  @Column("integer", { name: "dy_hg_act_mn", nullable: true })
  dyHgActMn: number | null;

  @Column("integer", { name: "wk_md_act", nullable: true })
  wkMdAct: number | null;

  @Column("integer", { name: "dy_md_act_hr", nullable: true })
  dyMdActHr: number | null;

  @Column("integer", { name: "dy_md_act_mn", nullable: true })
  dyMdActMn: number | null;

  @Column("integer", { name: "wk_walk", nullable: true })
  wkWalk: number | null;

  @Column("integer", { name: "dy_walk_hr", nullable: true })
  dyWalkHr: number | null;

  @Column("integer", { name: "dy_walk_mn", nullable: true })
  dyWalkMn: number | null;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.userExercise)
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: UserInfo;
}
