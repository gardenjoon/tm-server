import { Request, Response } from "express";
import { AppDataSource, Controller, Entity } from "../../TodaysMenuDB";
import { MenuSet } from "../interfaces/menu_interface";

const rcmdMenu = async (req: Request, res: Response) => {
    try {

        const userId = req.query.id as string;
        const style = req.query.styles as string;
        const tags = req.query.tags as string;
        const calorie = req.query.calorie as string;
        
        const styleList = JSON.parse(style);
        let result: Array<MenuSet> = [];
        const tagKeys = {
            lv_spicy: "매콤",
            hg_prot: "고단백",
            lw_cal: "저칼로리",
            lv_fat: "저지방",
            lv_na: "저염",
            lv_su: "저당",
            vegetable: "채소류",
            meat: "육류",
            seafood: "해산물",
        };
        for (const [index, style] of styleList.entries()) {
            let menus = await new Controller.FoodInfo(Entity.FoodInfo, AppDataSource.manager).getMenu(
                userId,
                [style],
                JSON.parse(tags) ?? [],
                calorie
            );
            if (menus[0].food_id == null) {
                menus = [];
                break;
            }

            let totalTags = [];
            let total_calorie = 0;

            for (const [index, menu] of menus.entries()) {
                let tags = [];
                for (let key in menu) {
                    if (Object.keys(tagKeys).includes(key) && menu[key] > 0) {
                        tags.push(tagKeys[key]);
                        totalTags.push(tagKeys[key]);
                    }
                    if (key == "total_cal") {
                        total_calorie += parseInt(menu[key]);
                    }
                }
                menu.tags = tags;
            }
            totalTags = [...new Set(totalTags)];

            result.push({
                menus: menus,
                total_calorie: total_calorie,
                tags: totalTags,
                style: style,
            });
        }
        return res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 500,
            data: "Server Error",
        });
    }
};


export { rcmdMenu };
