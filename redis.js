// redis setup
import "dotenv/config";
import chalk from "chalk";

import { createClient } from "redis";
console.log(chalk.red(`process.env.REDIS_PASSWORD : ${process.env.REDIS_PASSWORD}`))

const redisURL = `redis://:${process.env.REDIS_PASSWORD}@redis:6379`;
console.log(chalk.red("redis url : ", redisURL));
const redisClient = await createClient({ url: redisURL })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

import { RedisStore } from "connect-redis";

export const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});
