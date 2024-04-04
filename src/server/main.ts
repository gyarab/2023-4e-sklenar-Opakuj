require("dotenv").config();
import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import mongoose from "mongoose";
import database from "./db/db";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import passport from "passport";
import { router } from "./router/router";
import { routerAPI } from "./router/routerAPI";

import cookieParser from "cookie-parser";
import connectMongo from "connect-mongo";
const MongoStore = connectMongo;
//pripojeni k DB
database.connectDB();

//inicializace expressu
const app = express();
app.set("trust proxy", 1);

//nastaveni middleware
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    //cookie: {secure: true},
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", router);
app.use("/api/", routerAPI);
require("./scripts/Auth")();

/*let nm: number = parseInt(process.env.PORT!);
const PORT: number = nm ?? 4000; // provide a default value for PORT
const ENV_MODE: "development" | "production" | undefined =
  (process.env["ENV_MODE"] as "development" | "production" | undefined) ??
  "production";

ViteExpress.config({ mode: ENV_MODE }); // set mode to production

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on port ${PORT}...`)
);*/

ViteExpress.config({ mode: process.env.ENV_MODE! as "development" | "production" });
ViteExpress.listen(app, process.env.PORT! as unknown as number, () =>
  console.log(`Server is listening on port ${process.env.PORT}...`)
);
