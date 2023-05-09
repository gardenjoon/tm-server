import "reflect-metadata";
import * as express from "express";
import apiRoute from "./router/index";

import { AppDataSource, Controller, Entity } from "../TodaysMenuDB";

const app = express();

app.use(express.json());

app.use("/api", apiRoute);

app.get("/", (req, res) => {
    res.send("Hello there!");
});

try {
    app.listen(7443, () => {
        console.log("HTTP Server running on port 7443");
    });
} catch (e) {
    throw e;
}

//fuser -k 7443/tcp
