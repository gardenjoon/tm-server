import "reflect-metadata";
import express from "express";
import apiRoute from "./router/index";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger/swagger-output.json";
import cors from 'cors';
import https from 'https';
import fs from 'fs';

const sslOptions = {
    ca: fs.readFileSync('/etc/letsencrypt/live/data.pknu.ac.kr/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/data.pknu.ac.kr/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/data.pknu.ac.kr/cert.pem'),
}


const app = express();

app.use(express.json());

app.use(cors());

app.use("/api", apiRoute);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));

app.get("/", (req, res) => {
    res.send("Hello there!");
});

try {
    https.createServer(sslOptions, app).listen(7443, () => {
        console.log("HTTPS Server running on port 7443");
    })
    // app.listen(7443, () => {
    //     console.log("HTTP Server running on port 7443");
    // });
} catch (e) {
    throw e;
}

//fuser -k 7443/tcp
