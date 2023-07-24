import { Column, Entity, Index } from "typeorm";

@Index("fi_ingr_pkey", ["fiCd"], { unique: true })
@Entity("fi_ingr", { schema: "public" })
export class FiIngr {
  @Column("integer", { name: "sqno", nullable: true })
  sqno: number | null;

  @Column("character varying", { primary: true, name: "fi_cd", length: 20 })
  fiCd: string;

  @Column("character varying", {
    name: "fi_grop_nm",
    nullable: true,
    length: 50,
  })
  fiGropNm: string | null;

  @Column("character varying", { name: "fi_nm", nullable: true, length: 50 })
  fiNm: string | null;

  @Column("character varying", { name: "src", nullable: true, length: 50 })
  src: string | null;

  @Column("double precision", { name: "enerc", nullable: true, precision: 53 })
  enerc: number | null;

  @Column("numeric", { name: "water", nullable: true, precision: 10, scale: 5 })
  water: string | null;

  @Column("numeric", { name: "prot", nullable: true, precision: 10, scale: 5 })
  prot: string | null;

  @Column("numeric", { name: "fatce", nullable: true, precision: 10, scale: 5 })
  fatce: string | null;

  @Column("numeric", { name: "ash", nullable: true, precision: 10, scale: 5 })
  ash: string | null;

  @Column("numeric", {
    name: "chocdf",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  chocdf: string | null;

  @Column("numeric", { name: "sugar", nullable: true, precision: 10, scale: 5 })
  sugar: string | null;

  @Column("numeric", { name: "sucs", nullable: true, precision: 10, scale: 5 })
  sucs: string | null;

  @Column("numeric", { name: "glus", nullable: true, precision: 10, scale: 5 })
  glus: string | null;

  @Column("numeric", { name: "frus", nullable: true, precision: 10, scale: 5 })
  frus: string | null;

  @Column("numeric", { name: "lacs", nullable: true, precision: 10, scale: 5 })
  lacs: string | null;

  @Column("numeric", { name: "mals", nullable: true, precision: 10, scale: 5 })
  mals: string | null;

  @Column("numeric", { name: "gals", nullable: true, precision: 10, scale: 5 })
  gals: string | null;

  @Column("numeric", { name: "fibtg", nullable: true, precision: 10, scale: 5 })
  fibtg: string | null;

  @Column("numeric", {
    name: "fibsol",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  fibsol: string | null;

  @Column("numeric", {
    name: "fibins",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  fibins: string | null;

  @Column("numeric", { name: "ca", nullable: true, precision: 10, scale: 5 })
  ca: string | null;

  @Column("numeric", { name: "fe", nullable: true, precision: 10, scale: 5 })
  fe: string | null;

  @Column("numeric", { name: "mg", nullable: true, precision: 10, scale: 5 })
  mg: string | null;

  @Column("double precision", { name: "p", nullable: true, precision: 53 })
  p: number | null;

  @Column("double precision", { name: "k", nullable: true, precision: 53 })
  k: number | null;

  @Column("numeric", { name: "na", nullable: true, precision: 10, scale: 5 })
  na: string | null;

  @Column("numeric", { name: "zn", nullable: true, precision: 10, scale: 5 })
  zn: string | null;

  @Column("numeric", { name: "cu", nullable: true, precision: 10, scale: 5 })
  cu: string | null;

  @Column("numeric", { name: "mn", nullable: true, precision: 10, scale: 5 })
  mn: string | null;

  @Column("numeric", { name: "se", nullable: true, precision: 10, scale: 5 })
  se: string | null;

  @Column("numeric", { name: "mo", nullable: true, precision: 10, scale: 5 })
  mo: string | null;

  @Column("numeric", { name: "id", nullable: true, precision: 10, scale: 5 })
  id: string | null;

  @Column("numeric", {
    name: "vita_rae",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  vitaRae: string | null;

  @Column("numeric", { name: "retol", nullable: true, precision: 10, scale: 5 })
  retol: string | null;

  @Column("numeric", { name: "cartb", nullable: true, precision: 10, scale: 5 })
  cartb: string | null;

  @Column("numeric", { name: "thia", nullable: true, precision: 10, scale: 5 })
  thia: string | null;

  @Column("numeric", { name: "ribo", nullable: true, precision: 10, scale: 5 })
  ribo: string | null;

  @Column("numeric", { name: "nia", nullable: true, precision: 10, scale: 5 })
  nia: string | null;

  @Column("numeric", { name: "niaeq", nullable: true, precision: 10, scale: 5 })
  niaeq: string | null;

  @Column("numeric", {
    name: "nitacid",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  nitacid: string | null;

  @Column("numeric", {
    name: "nicoamide",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  nicoamide: string | null;

  @Column("numeric", {
    name: "pantac",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  pantac: string | null;

  @Column("numeric", {
    name: "vitb6c",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  vitb6c: string | null;

  @Column("numeric", { name: "pyrxn", nullable: true, precision: 10, scale: 5 })
  pyrxn: string | null;

  @Column("numeric", { name: "biot", nullable: true, precision: 10, scale: 5 })
  biot: string | null;

  @Column("numeric", {
    name: "foldfe",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  foldfe: string | null;

  @Column("numeric", { name: "folfd", nullable: true, precision: 10, scale: 5 })
  folfd: string | null;

  @Column("numeric", { name: "folac", nullable: true, precision: 10, scale: 5 })
  folac: string | null;

  @Column("numeric", {
    name: "vitb12",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  vitb12: string | null;

  @Column("numeric", { name: "vitc", nullable: true, precision: 10, scale: 5 })
  vitc: string | null;

  @Column("numeric", { name: "vitd", nullable: true, precision: 10, scale: 5 })
  vitd: string | null;

  @Column("numeric", {
    name: "ergcal",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  ergcal: string | null;

  @Column("numeric", {
    name: "chocal",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  chocal: string | null;

  @Column("numeric", { name: "vite", nullable: true, precision: 10, scale: 5 })
  vite: string | null;

  @Column("numeric", {
    name: "tocpha",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  tocpha: string | null;

  @Column("numeric", {
    name: "tocphb",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  tocphb: string | null;

  @Column("numeric", {
    name: "tocphg",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  tocphg: string | null;

  @Column("numeric", {
    name: "tocphd",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  tocphd: string | null;

  @Column("numeric", {
    name: "toctra",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  toctra: string | null;

  @Column("numeric", {
    name: "toctrb",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  toctrb: string | null;

  @Column("numeric", {
    name: "toctrg",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  toctrg: string | null;

  @Column("numeric", {
    name: "toctrd",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  toctrd: string | null;

  @Column("numeric", { name: "vitk", nullable: true, precision: 10, scale: 5 })
  vitk: string | null;

  @Column("numeric", { name: "vitk1", nullable: true, precision: 10, scale: 5 })
  vitk1: string | null;

  @Column("numeric", { name: "vitk2", nullable: true, precision: 10, scale: 5 })
  vitk2: string | null;

  @Column("numeric", {
    name: "totalamino",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  totalamino: string | null;

  @Column("numeric", {
    name: "aae10a",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  aae10a: string | null;

  @Column("numeric", { name: "ile", nullable: true, precision: 10, scale: 5 })
  ile: string | null;

  @Column("numeric", { name: "leu", nullable: true, precision: 10, scale: 5 })
  leu: string | null;

  @Column("numeric", { name: "lys", nullable: true, precision: 10, scale: 5 })
  lys: string | null;

  @Column("numeric", { name: "met", nullable: true, precision: 10, scale: 5 })
  met: string | null;

  @Column("numeric", { name: "phe", nullable: true, precision: 10, scale: 5 })
  phe: string | null;

  @Column("numeric", { name: "thr", nullable: true, precision: 10, scale: 5 })
  thr: string | null;

  @Column("numeric", { name: "trp", nullable: true, precision: 10, scale: 5 })
  trp: string | null;

  @Column("numeric", { name: "val", nullable: true, precision: 10, scale: 5 })
  val: string | null;

  @Column("numeric", { name: "his", nullable: true, precision: 10, scale: 5 })
  his: string | null;

  @Column("numeric", { name: "arg", nullable: true, precision: 10, scale: 5 })
  arg: string | null;

  @Column("numeric", { name: "tyr", nullable: true, precision: 10, scale: 5 })
  tyr: string | null;

  @Column("numeric", { name: "cyste", nullable: true, precision: 10, scale: 5 })
  cyste: string | null;

  @Column("numeric", { name: "ala", nullable: true, precision: 10, scale: 5 })
  ala: string | null;

  @Column("numeric", { name: "asp", nullable: true, precision: 10, scale: 5 })
  asp: string | null;

  @Column("numeric", { name: "glu", nullable: true, precision: 10, scale: 5 })
  glu: string | null;

  @Column("numeric", { name: "gly", nullable: true, precision: 10, scale: 5 })
  gly: string | null;

  @Column("numeric", { name: "pro", nullable: true, precision: 10, scale: 5 })
  pro: string | null;

  @Column("numeric", { name: "ser", nullable: true, precision: 10, scale: 5 })
  ser: string | null;

  @Column("numeric", { name: "tau", nullable: true, precision: 10, scale: 5 })
  tau: string | null;

  @Column("numeric", { name: "chole", nullable: true, precision: 10, scale: 5 })
  chole: string | null;

  @Column("numeric", { name: "facid", nullable: true, precision: 10, scale: 5 })
  facid: string | null;

  @Column("numeric", { name: "faess", nullable: true, precision: 10, scale: 5 })
  faess: string | null;

  @Column("numeric", { name: "fasat", nullable: true, precision: 10, scale: 5 })
  fasat: string | null;

  @Column("numeric", { name: "f4d0", nullable: true, precision: 10, scale: 5 })
  f4d0: string | null;

  @Column("numeric", { name: "f6d0", nullable: true, precision: 10, scale: 5 })
  f6d0: string | null;

  @Column("numeric", { name: "f8d0", nullable: true, precision: 10, scale: 5 })
  f8d0: string | null;

  @Column("numeric", { name: "f10d0", nullable: true, precision: 10, scale: 5 })
  f10d0: string | null;

  @Column("numeric", { name: "f12d0", nullable: true, precision: 10, scale: 5 })
  f12d0: string | null;

  @Column("numeric", { name: "f13d0", nullable: true, precision: 10, scale: 5 })
  f13d0: string | null;

  @Column("numeric", { name: "f14d0", nullable: true, precision: 10, scale: 5 })
  f14d0: string | null;

  @Column("numeric", { name: "f15d0", nullable: true, precision: 10, scale: 5 })
  f15d0: string | null;

  @Column("numeric", { name: "f16d0", nullable: true, precision: 10, scale: 5 })
  f16d0: string | null;

  @Column("numeric", { name: "f17d0", nullable: true, precision: 10, scale: 5 })
  f17d0: string | null;

  @Column("numeric", { name: "f18d0", nullable: true, precision: 10, scale: 5 })
  f18d0: string | null;

  @Column("numeric", { name: "f20d0", nullable: true, precision: 10, scale: 5 })
  f20d0: string | null;

  @Column("numeric", { name: "f21d0", nullable: true, precision: 10, scale: 5 })
  f21d0: string | null;

  @Column("numeric", { name: "f22d0", nullable: true, precision: 10, scale: 5 })
  f22d0: string | null;

  @Column("numeric", { name: "f23d0", nullable: true, precision: 10, scale: 5 })
  f23d0: string | null;

  @Column("numeric", { name: "f24d0", nullable: true, precision: 10, scale: 5 })
  f24d0: string | null;

  @Column("numeric", {
    name: "tufatacid",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  tufatacid: string | null;

  @Column("numeric", { name: "fams", nullable: true, precision: 10, scale: 5 })
  fams: string | null;

  @Column("numeric", { name: "f14d1", nullable: true, precision: 10, scale: 5 })
  f14d1: string | null;

  @Column("numeric", { name: "f16d1", nullable: true, precision: 10, scale: 5 })
  f16d1: string | null;

  @Column("numeric", { name: "f17d1", nullable: true, precision: 10, scale: 5 })
  f17d1: string | null;

  @Column("numeric", {
    name: "f18d1n9",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f18d1n9: string | null;

  @Column("numeric", {
    name: "f18d1n7",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f18d1n7: string | null;

  @Column("numeric", { name: "f20d1", nullable: true, precision: 10, scale: 5 })
  f20d1: string | null;

  @Column("numeric", { name: "f22d1", nullable: true, precision: 10, scale: 5 })
  f22d1: string | null;

  @Column("numeric", { name: "f24d1", nullable: true, precision: 10, scale: 5 })
  f24d1: string | null;

  @Column("numeric", { name: "fapu", nullable: true, precision: 10, scale: 5 })
  fapu: string | null;

  @Column("numeric", {
    name: "f18d2n6",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f18d2n6: string | null;

  @Column("numeric", {
    name: "f18d3n3",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f18d3n3: string | null;

  @Column("numeric", {
    name: "f18d3n6",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f18d3n6: string | null;

  @Column("numeric", {
    name: "f20d2n6",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f20d2n6: string | null;

  @Column("numeric", {
    name: "f20d3n3",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f20d3n3: string | null;

  @Column("numeric", {
    name: "f20d3n6",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f20d3n6: string | null;

  @Column("numeric", {
    name: "f20d4n6",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f20d4n6: string | null;

  @Column("numeric", {
    name: "f20d5n3",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f20d5n3: string | null;

  @Column("numeric", { name: "f22d2", nullable: true, precision: 10, scale: 5 })
  f22d2: string | null;

  @Column("numeric", {
    name: "f22d5n3",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f22d5n3: string | null;

  @Column("numeric", {
    name: "f22d6n3",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f22d6n3: string | null;

  @Column("numeric", {
    name: "fapun3",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  fapun3: string | null;

  @Column("numeric", {
    name: "fapun6",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  fapun6: string | null;

  @Column("numeric", { name: "fatrn", nullable: true, precision: 10, scale: 5 })
  fatrn: string | null;

  @Column("numeric", {
    name: "f18d1tn9",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f18d1tn9: string | null;

  @Column("numeric", {
    name: "f18d2tn6",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f18d2tn6: string | null;

  @Column("numeric", {
    name: "f18d3tn3",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  f18d3tn3: string | null;

  @Column("numeric", {
    name: "nacl_eq",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  naclEq: string | null;

  @Column("double precision", { name: "refuse", nullable: true, precision: 53 })
  refuse: number | null;
}
