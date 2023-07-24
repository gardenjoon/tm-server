interface Menu {
    food_id: string;
    fodgrp_cd: number;
    src: string;
    food_nm: string;
    total_amt: string;
    total_cal: string;
    total_carbo: string;
    total_prot: string;
    total_fat: string;
    total_na: string;
    total_sugar: string;
    sty_kr: string;
    sty_cn: string;
    sty_jp: string;
    sty_ws: string;
    lv_spicy: number;
    hg_prot: number;
    lw_cal: number;
    lv_fat: number;
    lv_na: number;
    lv_su: number;
    vegetable: number;
    meat: number;
    seafood: number;
    tags: Array<string>;
}

interface MenuSet {
    menus: Menu;
    total_calorie: number;
    tags: Array<string>;
    style: string;
}

export { MenuSet, Menu };
