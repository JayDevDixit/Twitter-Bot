import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import { checkKey } from "./utils.js";
dotenv.config();

checkKey([
  process.env.X_API_KEY,
  process.env.X_API_SECRET,
  process.env.X_ACCESS_TOKEN,
  process.env.X_ACCESS_SECRET,
  process.env.X_BEARER_TOKEN
]);

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const bearer = new TwitterApi(process.env.X_BEARER_TOKEN);
export const twitterClient = client.readWrite;
export const twitterBearer = bearer.readOnly;
