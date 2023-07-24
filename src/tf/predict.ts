import tf from "@tensorflow/tfjs";
import Jimp from "jimp";
import * as tfnode from "@tensorflow/tfjs-node";
import fs from "fs";
import http from "http";

import { createCanvas, loadImage } from "canvas";
import { json } from "express";

const classes = [
    "쌀밥",
    "잡곡밥",
    "현미밥",
    "카레라이스",
    "김밥",
    "김치볶음밥",
    "김치",
    "연근조림",
    "동치미",
    "잡채",
    "김치찌개",
    "갈비",
    "육회",
    "콩나물",
    "우동",
    "백김치",
    "잔치국수",
    "콩나물국밥",
    "곰탕",
    "도라지나물",
    "비빔밥",
    "어묵탕",
    "부대찌개",
    "불고기",
    "총각김치",
    "오이김치",
    "치킨마요덮밥",
    "북엇국",
    "장어",
    "볶음밥",
    "파김치",
    "고등어구이",
    "장조림",
    "제육볶음",
    "메밀소바",
    "된장국",
    "잡곡밥",
    "나박김치",
    "냉면",
    "가자미구이",
    "족발",
    "삼겹살",
    "깍두기",
    "깍두기",
    "삼각김밥",
    "김밥",
    "도라지무침",
    "고사리",
    "호박무침",
    "미역국",
    "김",
    "조개국",
    "육개장",
    "시금치나물",
    "고등어조림",
    "멸치조림",
    "열무김치",
    "짬뽕",
    "라면",
    "양념치킨",
    "된장찌개",
    "감자탕",
    "제육볶음",
    "짜장면",
    "칼국수",
    "만두",
    "파전",
    "삼계탕",
    "순대국밥",
    "떡볶이",
    "떡국",
    "yolov5",
    "호박전",
    "미역줄기볶음",
    "소시지볶음",
    "100원",
    "숙주나물",
    "카드",
    "계란후라이",
    "감자전",
    "계란찜",
    "순두부찌개",
    "채소튀김",
    "골뱅이무침",
    "쥐포튀김",
    "깨강정",
    "깍두기",
    "꿀떡",
    "미꾸라지튀김",
    "백설기",
    "윙봉",
    "닭꼬치",
    "닭튀김",
    "달걀말이",
    "단무지",
    "단무지무침",
    "더덕구이",
    "돈까스",
    "동그랑땡",
    "어묵볶음",
    "감자튀김",
    "간장게장",
    "가래떡",
    "김말이튀김",
    "김무침",
    "훈제오리",
    "인절미",
    "마늘쫑장아찌",
    "메추리알",
    "메밀전병",
    "모래집튀김",
    "무말랭이",
    "무생채",
    "멸치볶음",
    "팥죽",
    "생연어",
    "시루떡",
    "송편",
    "야채죽",
    "한과",
    "약과",
    "잡채",
];

const predictModel = async (imgPath: string) => {
    const model = await tf.loadGraphModel(`file:///home/idblab/tm-server/src/tf/model/model.json`);

    let [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);

    const fsImage = fs.readFileSync(imgPath);

    const input = tfnode.node.decodeImage(fsImage, 3);

    const tensor = tf.tidy(() => {
        return tf.image.resizeBilinear(input, [modelWidth, modelHeight]).div(255).expandDims(0);
    });

    const result = await model.executeAsync(tensor);

    const boxes_data = result[0].dataSync();
    const scores_data = result[1].dataSync();
    const classes_data = result[2].dataSync();
    const valid_detections_data = result[3].dataSync()[0];
    tf.dispose(result);

    let predictions = [];

    let isCoin = false;
    for (let i = 0; i < valid_detections_data; ++i) {
        if (classes[classes_data[i]] == "100원") {
            isCoin = true;
            let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
            var img_coin_width = x2 - x1;
            continue;
        }

        let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
        const width = x2 - x1;
        const height = y2 - y1;
        const klass = classes[classes_data[i]];
        const score = scores_data[i].toFixed(2);

        predictions.push([
            x1 * input.shape[1],
            y1 * input.shape[0],
            width * input.shape[1],
            height * input.shape[0],
            klass,
            score,
        ]);
    }
    if (isCoin) {
        predictions = predictWeight(predictions, img_coin_width);
    }
    console.log(predictions);

    let finalResult = [];
    let contained = new Set();
    let sum = 0;
    for (const item of predictions) {
        if (item[4] == "100원") continue;

        let searchResult = await getFoodInform(item[4]);
        if ([...contained].includes(item[4])) {
            sum += Number(searchResult["NUTR_CONT1"]);
            continue;
        }

        if (searchResult != null) {
            if (item[6]) {
                const weight_ratio = item[6] / searchResult["SERVING_WT"];
                finalResult.push({
                    name: item[4],
                    percent: item[5],
                    total: Number(item[6].toFixed(2)),
                    calorie: Number((searchResult["NUTR_CONT1"] * weight_ratio).toFixed(2)),
                    carbohydrate: Number((searchResult["NUTR_CONT2"] * weight_ratio).toFixed(2)),
                    protein: Number((searchResult["NUTR_CONT3"] * weight_ratio).toFixed(2)),
                    fat: Number((searchResult["NUTR_CONT4"] * weight_ratio).toFixed(2)),
                });
                sum += Number((searchResult["NUTR_CONT1"] * weight_ratio).toFixed(2));
            } else {
                finalResult.push({
                    name: item[4],
                    percent: item[5],
                    total: item[6] ? item[6] : searchResult["SERVING_WT"],
                    calorie: item[6]
                        ? (searchResult["NUTR_CONT1"] * item[6]) / searchResult["SERVING_WT"]
                        : searchResult["NUTR_CONT1"],
                    carbohydrate: searchResult["NUTR_CONT2"],
                    protein: searchResult["NUTR_CONT3"],
                    fat: searchResult["NUTR_CONT4"],
                });
                sum += Number(searchResult["NUTR_CONT1"]);
            }
            contained.add(item[4]);
        }
    }

    const fontsize = input.shape[1] > 1000 ? 60 : 30;

    await drawImage(imgPath, predictions, fontsize);

    return [finalResult, sum];
};

const getFoodInform = async (foodName: string) => {
    const url = "http://apis.data.go.kr/1471000/FoodNtrIrdntInfoService1/getFoodNtrItdntList1";

    var queryParams =
        "?" +
        encodeURIComponent("serviceKey") +
        "=qezMonZ4cVQksv7UkM%2BNOWfg6oMnq8LB7Ls5fjBEtv69zLMYPdvykeM3faA2mjYjn%2Fn6ONjp7dL4H53OJwPSVA%3D%3D"; /* Service Key*/
    queryParams += "&" + encodeURIComponent("desc_kor") + "=" + encodeURIComponent(foodName);
    queryParams += "&" + encodeURIComponent("type") + "=" + encodeURIComponent("json");
    queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("10");
    let searchString = "";
    await new Promise((resolve, reject) => {
        http.get(url + queryParams, (res) => {
            res.on("data", (result) => {
                searchString += result.toString();
            });
            res.on("end", resolve);
        });
    });
    const jsonData = JSON.parse(searchString);
    if (jsonData.body.totalCount == 0) return null;

    for (const item of jsonData.body.items) {
        if (item.DESC_KOR == null) return null;
        if (item.DESC_KOR == foodName) {
            return item;
        } else if (item.DESC_KOR.includes(foodName)) {
            return item;
        }
    }
};

const drawImage = async (imgPath, predictions, fontsize) => {
    const image = await loadImage(imgPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    //폰트
    const font = `${fontsize}px sans-serif`;
    ctx.font = font;
    ctx.textBaseline = "bottom";

    predictions.forEach((xys) => {
        // box 그리기
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 16;
        ctx.strokeRect(xys[0], xys[1], xys[2], xys[3]);

        //label background 그리기
        ctx.fillStyle = "#ff0000";

        const text = xys[4];
        const textWidth = ctx.measureText(text).width;
        const textHeight = parseInt(font, 10);
        ctx.fillRect(xys[0], xys[1] - (textHeight + 20), textWidth + 8, textHeight + 20);
    });

    predictions.forEach((xys) => {
        //label 그리기
        ctx.fillStyle = "#ffffff";
        const text = xys[4];
        ctx.fillText(text, xys[0] + 2, xys[1] + 3);
    });

    const output = fs.createWriteStream("uploads/output.jpg");
    const stream = canvas.createJPEGStream();

    await new Promise((resolve, reject) => {
        stream.pipe(output).on("finish", resolve).on("error", reject);
    });
};

const predictWeight = (predictions, img_coin_width) => {
    const specific_food = [
        0, 1, 2, 3, 5, 10, 14, 16, 17, 18, 20, 21, 22, 27, 29, 34, 35, 38, 45, 49, 51, 52, 57, 58, 60, 61, 63, 64, 67, 68,
        70, 81, 86,
    ];
    const coin_width = 24;

    for (const [index, item] of predictions.entries()) {
        if (specific_food.includes(classes.indexOf(item[4]))) {
            const food_width = item[2];
            console.log(food_width);
            console.log(img_coin_width);
            const exact_food_width = (food_width / img_coin_width) * coin_width;
            console.log(exact_food_width);
            const food_weight = 2 * exact_food_width;
            predictions[index].push(food_weight);
        }
    }
    return predictions;
};

export default predictModel;
