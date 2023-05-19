import tf from "@tensorflow/tfjs";
import Jimp from "jimp";
import * as tfnode from "@tensorflow/tfjs-node";
import fs from "fs";
import http from "http";

import { createCanvas, loadImage } from "canvas";
import { json } from "express";

const classes = ["불고기", "동전", "김치찌개", "김치", "밥", "미역국"];
// [
//     "오꼬노미야끼",
//     "쇠고기카레",
//     "고기국수",
//     "비빔밥",
//     "치킨에그덮밥",
//     "치킨덮밥",
//     "감자칩샌드위치",
//     "크루아상",
//     "우니덮밥",
//     "볶음국수",
//     "볶음밥",
//     "그라탕",
//     "햄버거",
//     "필라프",
//     "피자",
//     "돈까스덮밥",
//     "건포도빵",
//     "라면",
//     "밥",
//     "롤빵",
//     "샌드위치",
//     "소바",
//     "스파게티",
//     "스시",
//     "타코야끼",
//     "텐동",
//     "텐우동",
//     "탄탄면",
//     "토스트",
//     "우동",
//     "베이그넷",
//     "빵푸딩",
//     "브루스케타",
//     "시저샐러드",
//     "카놀리",
//     "당근케잌",
//     "세비체",
//     "치즈케이크",
//     "치킨퀘사디아",
//     "닭윙",
//     "초콜릿케이크",
//     "초콜릿무스",
//     "츄러스",
//     "클램차우더",
//     "클럽샌드위치",
//     "크랩케이크",
//     "크림브륄레",
//     "컵케이크",
//     "달걀미모사",
//     "만두",
//     "가지",
//     "에그베네딕트",
//     "에스카르고",
//     "중동경단",
//     "생선",
//     "감자튀김",
//     "프랑스식양파수프",
//     "프렌치토스트",
//     "오징어튀김",
//     "튀밥",
//     "얼린요구르트",
//     "그릭샐러드",
//     "그릴드치즈샌드위치",
//     "구운연어",
//     "과카몰리",
//     "교자",
//     "햄버거",
//     "산라탕",
//     "핫도그",
//     "훔무스",
//     "아이스크림",
//     "코샤리",
//     "라자냐",
//     "랍스터비스크",
//     "랍스터롤샌드위치",
//     "마카로니앤치즈",
//     "마카롱",
//     "미소된장국",
//     "몰로키아",
//     "나쵸",
//     "오믈렛",
//     "어니언링",
//     "굴",
//     "팬케이크",
//     "판나코타",
//     "피자",
//     "폭찹",
//     "푸틴",
//     "풀드포크샌드위치",
//     "라비올리",
//     "레드벨벳케이크",
//     "리조또",
//     "사모사",
//     "회",
//     "가리비",
//     "쉬림프앤그릿츠",
//     "볼로네제",
//     "까르보나라",
//     "스프링롤",
//     "스테이크",
//     "딸기숏케이크",
//     "회",
//     "고구마",
//     "타코",
//     "티라미수",
//     "참치타르타르",
//     "와플",
//     "애플파이",
//     "등갈비",
//     "바클라바",
//     "육회",
//     "비트샐러드",
//     "베이그넷",
//     "빵푸딩",
//     "브리또",
//     "브루스케타",
//     "당근케이크",
//     "세비체",
//     "치즈",
//     "치킨퀘사디아",
//     "닭봉",
//     "초콜릿무스",
//     "클램차우더",
//     "클럽샌드위치",
//     "크랩케이크",
//     "크림브륄레",
//     "크로크마담",
//     "컵케이크",
//     "도넛",
//     "만두",
//     "가지",
//     "에그베네딕트",
//     "에스카르고",
//     "팔라펠",
//     "필레미뇽",
//     "생선",
//     "푸아그라",
//     "감자튀김",
//     "프렌치토스트",
//     "볶음밥",
//     "얼린요구르트",
//     "마늘빵",
//     "뇨끼",
//     "그릴드치즈샌드위치",
//     "구운연어",
//     "과카몰리",
//     "산라탕",
//     "핫도구",
//     "훔무스",
//     "아이스크림",
//     "랍스터비스크",
//     "마카로니앤치즈",
//     "미소된자국",
//     "몰로키아",
//     "나쵸",
//     "오믈렛",
//     "어니언링",
//     "팬케이크",
//     "북경오리",
//     "폭찹",
//     "푸틴",
//     "로스트비프",
//     "라비올리",
//     "리조또",
//     "사모사",
//     "회",
//     "가리비",
//     "와카메",
//     "쉬림프앤그릿츠",
//     "볼로네제",
//     "까르보나라",
//     "스프링롤",
//     "스테이크",
//     "고구마",
//     "타코",
//     "티라미수",
//     "참치타르타르",
//     "와플",
//     "-",
//     "카르파초",
//     "시저샐러드",
//     "카프레제샐러드",
//     "달걀미모사",
//     "그릭샐러드",
//     "교자",
//     "렌틸스프",
//     "홍합",
//     "포도잎",
//     "불고기",
//     "동전",
//     "김치찌개",
//     "김치",
//     "미역국",
// ];

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

    for (let i = 0; i < valid_detections_data; ++i) {
        if (classes[classes_data[i]] == "동전") continue;
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

    let finalResult = [];
    let contained = new Set();
    let sum = 0;
    for (const item of predictions) {
        if (item[4] == "동전") continue;

        const searchResult = await getFoodInform(item[4]);

        if ([...contained].includes(item[4])) {
            sum += Number(searchResult["NUTR_CONT1"]);
            continue;
        }

        if (searchResult != null) {
            finalResult.push({
                name: item[4],
                percent: item[5],
                total: searchResult["SERVING_WT"],
                calorie: searchResult["NUTR_CONT1"],
                carbohydrate: searchResult["NUTR_CONT2"],
                protein: searchResult["NUTR_CONT3"],
                fat: searchResult["NUTR_CONT4"],
            });
            sum += Number(searchResult["NUTR_CONT1"]);
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
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //폰트
    const font = `${fontsize}px sans-serif`;
    ctx.font = font;
    ctx.textBaseline = "bottom";

    predictions.forEach((xys) => {
        // box 그리기
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.strokeRect(xys[0], xys[1], xys[2], xys[3]);

        //label background 그리기
        ctx.fillStyle = "#ff0000";

        // const text = i + " " + xys[4] + ":" + xys[5]
        const text = xys[4];
        const textWidth = ctx.measureText(text).width;
        const textHeight = parseInt(font, 10);
        ctx.fillRect(xys[0], xys[1] - (textHeight + 4), textWidth + 4, textHeight + 4);
    });

    predictions.forEach((xys) => {
        //label 그리기
        ctx.fillStyle = "#ffffff";
        // const text = i + " " + xys[4] + ":" + xys[5]
        const text = xys[4];
        ctx.fillText(text, xys[0] + 2, xys[1] + 3);
    });

    const output = fs.createWriteStream("uploads/output.jpg");
    const stream = canvas.createJPEGStream();

    await new Promise((resolve, reject) => {
        stream.pipe(output).on("finish", resolve).on("error", reject);
    });

    console.log("Rectangle drawn successfully!");
};

export default predictModel;
