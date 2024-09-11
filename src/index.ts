import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import http from "http";
import log4js from "log4js";
import cors from "cors";
import indexRouter from "@routes/index-router";
import userRouter from "@routes/user-router";
import adminCommonRouter from "@routes/admin-common-router";
import adminRouter from "@routes/admin-router";
import cmsRouter from "@routes/cms-router";
import galleryRouter from "@routes/gallery-router";
import clientRouter from "@routes/client-router";
import servicesRouter from "@routes/services-router";
import recentProjectsRouter from "@routes/recent-projects-router";
import teamRouter from '@routes/team-router';
import sliderRouter from "@routes/slider-route";
// import '@models/associations';
// import "@models/async";

import morgan from "morgan";
morgan("tiny");
morgan(":method :url :status :res[content-length] - :response-time ms");
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use("/uploads", express.static("uploads"));

log4js.configure({
  appenders: {
    everything: {
      type: "dateFile",
      filename: "./logger/all-the-logs.log",
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
    },
  },
  categories: {
    default: { appenders: ["everything"], level: "debug" },
  },
});

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Use this after the variable declaration

// prefix start

// body mathi data get  karva start
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// body mathi data get  karva over

app.get("/juhi", (req, res) => {
  res.send("Express + TypeScript Server");
});
app.use("/api", indexRouter);
app.use("/api", userRouter);
app.use("/api", adminCommonRouter);
app.use("/api", adminRouter);
app.use("/api", cmsRouter);
app.use("/api", clientRouter);
app.use("/api", servicesRouter);
app.use("/api", recentProjectsRouter);
app.use('/api', indexRouter);
app.use('/api', userRouter);
app.use('/api', adminCommonRouter);
app.use('/api', adminRouter);
app.use('/api', cmsRouter);
app.use('/api', galleryRouter);
app.use('/api', clientRouter);
app.use('/api', teamRouter);
app.use('/api', sliderRouter);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
