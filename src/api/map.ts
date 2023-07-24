import { Request, Response } from "express";
import request from "request";
import * as dotenv from "dotenv";
import { crawler } from '../middlewares/crawling';
import { AppDataSource, Controller, Entity } from "../../TodaysMenuDB";
dotenv.config();
const api_key = process.env.kakao_api_key;

const getAddress = async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Map']
        #swagger.parameters['query'] = {
            in: 'query',
            description: '검색어',
            required: true,
            type: 'string',
        },
    */
    try {
        const api_url = 'https://dapi.kakao.com/v2/local/search/address.json?query=' + encodeURI(req.params.query);
        const options = {
            url: api_url,
            headers: {
                Authorization: `KakaoAK ${api_key}`
            }
        };

        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
                return res.end(body);
              } else {
                console.log(error);
                return res.status(response.statusCode).json({
                    message: "서버 에러입니다."
                }).end();
              }
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            error: { message: "서버 에러입니다." },
        });
    }
};
const getRegion = async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Map']
        #swagger.parameters['x'] = {
            in: 'query',
            description: 'longitude',
            required: true,
            type: 'string',
        },
        #swagger.parameters['y'] = {
            in: 'query',
            description: 'latitude',
            required: true,
            type: 'string',
        },
    */
    try {
        const api_url = encodeURI(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${req.params.x}&y=${req.params.y}`);
        //  + '&size=' + encodeURI(req.params.size);
        console.log(api_url);
        const options = {
            url: api_url,
            headers: {
                Authorization: `KakaoAK ${api_key}`
            }
        };

        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
                return res.end(body);
              } else {
                console.log(error);
                return res.status(response.statusCode).json({
                    message: "서버 에러입니다."
                }).end();
              }
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            error: { message: "서버 에러입니다." },
        });
    }
};



const search = async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Map']
        #swagger.parameters['query'] = {
            in: 'query',
            description: '검색어',
            required: true,
            type: 'string',
        },
        #swagger.parameters['x'] = {
            in: 'query',
            description: 'longitude',
            required: false,
            type: 'integer',
        },
        #swagger.parameters['y'] = {
            in: 'query',
            description: 'latitude',
            required: false,
            type: 'integer',
        },
        #swagger.parameters['radius'] = {
            in: 'query',
            description: '중심좌표에서의 반경 (단위: 미터, 최대 20000)',
            required: false,
            type: 'integer',
        },
        #swagger.parameters['rect'] = {
            in: 'query',
            description: '좌측 x, 좌측 y, 우측 x, 우측 y',
            required: false,
            type: 'string',
        },
        #swagger.parameters['size'] = {
            in: 'query',
            description: '최대개수',
            required: false,
            type: 'integer',
        },
    } */

    try {
        let url = `https://dapi.kakao.com/v2/local/search/keyword.json?&category_group_code=FD6&query=${req.query.query}`;
        req.query.x ? url +=  `&x=${req.query.x}` : null;
        req.query.y ? url +=  `&y=${req.query.y}` : null;
        req.query.radius ? url +=  `&radius=${req.query.radius}` : null;
        req.query.rect ? url += `&rect=${req.query.rect}` : null;
        req.query.size ? url += `&size=${req.query.size}` : null;

        const api_url = encodeURI(url);
        const options = {
            url: api_url,
            headers: {
                Authorization: `KakaoAK ${api_key}`
            }
        };

        const response = await new Promise<string>((resolve, reject) => {
            request.get(options, (err, res) => {
                if (err) reject(err);
                resolve(res.body);
            });
        });


        console.log("Getting KAKAO API Successful");
        let result = JSON.parse(response);
        await Promise.all(result['documents'].map(async (store) => {
           if (store['place_name'].includes('점')) {
               let temp_name = store['place_name'].split(' ')
               temp_name.pop()
               store['place_name'] = temp_name.join(' ')
            }
            if (!await new Controller.ResMenu(Entity.ResMenu, AppDataSource.manager).checkMenu(store.id)) {
                const menuList = await crawler(store.id);
    
                if (menuList != null) {
                    await new Controller.ResMenu(Entity.ResMenu, AppDataSource.manager).saveMenu(menuList);
                }
            } else {
                store['menus'] = await new Controller.ResMenu(Entity.ResMenu, AppDataSource.manager).getMenu(store.id);
            };
        }))


 
        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        return res.end(JSON.stringify(result));


        // request.get(options, function (error, response, body) {
        //     if (!error && response.statusCode == 200) {
        //         console.log("Getting KAKAO API Successful")
        //         let result = JSON.parse(body);
        //         result['documents'].map((store) => {
        //             if (store['place_name'].includes('점')) {
        //                 let temp_name = store['place_name'].split(' ')
        //                 temp_name.pop()
        //                 store['place_name'] = temp_name.join(' ')
        //             }
        //         })
        //         await crawler()
                
        //         res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        //         return res.end(JSON.stringify(result));
        //       } else {
        //         console.log(error);
        //         return res.status(response.statusCode).json({
        //             message: "서버 에러입니다."
        //         }).end();
        //       }
        // });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            error: { message: "서버 에러입니다." },
        });
    }
};


export { getAddress, getRegion, search };