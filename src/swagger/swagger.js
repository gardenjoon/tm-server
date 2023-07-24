const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const options = {
    info: {
        title: "Today Menu API",
        description: "부경대학교 정보 및 데이터베이스 연구실의 Todays Menu API 설명서 입니다",
    },
    servers: [
        {
            url: "http://data.pknu.ac.kr:7443",
        },
    ],
    schemes: ["http"],
};
const outputFile = "./src/swagger/swagger-output.json";
const endpointsFiles = ["./src/index.ts"];
swaggerAutogen(outputFile, endpointsFiles, options);
