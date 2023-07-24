import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { AllergyInfo } from "./AllergyInfo";
import { UserInfo } from "./UserInfo";

@Index("user_allergy_info_user_id_algy_id_key", ["algyId", "userId"], {
    unique: true,
})
@Entity("user_allergy_info", { schema: "public" })
export class UserAllergyInfo {
    @PrimaryColumn("uuid", { name: "user_id", unique: true })
    userId: string;

    @Column("integer", { name: "algy_id", nullable: true, unique: true })
    algyId: number | null;

    @Column("timestamp without time zone", {
        name: "register_date",
        default: () => "now()",
    })
    registerDate: Date;

    @ManyToOne(() => AllergyInfo, (allergyInfo) => allergyInfo.userAllergyInfos)
    @JoinColumn([{ name: "algy_id", referencedColumnName: "algyId" }])
    algy: AllergyInfo;

    @ManyToOne(() => UserInfo, (userInfo) => userInfo.userAllergyInfos)
    @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
    user: UserInfo;
}
