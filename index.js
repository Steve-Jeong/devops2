import "dotenv/config";
import express from "express";
import chalk from "chalk";
import connectMongoWithRetry from "./mongo.js";
import postRouter from "./routes/postRouter.js";
import authRouter from "./routes/authRouter.js";
import session from "express-session";

connectMongoWithRetry();

const app = express();

import {redisStore} from './redis.js'

app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: "sessionId", // nodejs를 쓰면 session id이름이 connect.id인데 이를 일반적인 이름으로 바꾸어서 해커 공격으로 부터 보호한다.
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World\n");
});
app.use("/api/v1/post", postRouter);
app.use("/api/v1/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    chalk.green(`✓ Server is running at port ${chalk.red.bold(PORT)}`)
  );
});
