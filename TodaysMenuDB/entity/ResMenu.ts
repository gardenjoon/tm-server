import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("res_menu_pkey", ["id"], { unique: true })
@Index("res_menu_res_id_menu_name_key", ["menuName", "resId"], { unique: true })
@Entity("res_menu", { schema: "public" })
export class ResMenu {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "res_id", unique: true })
  resId: number;

  @Column("character varying", { name: "menu_name", unique: true, length: 50 })
  menuName: string;

  @Column("integer", { name: "menu_price" })
  menuPrice: number;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 200,
  })
  description: string | null;
}
