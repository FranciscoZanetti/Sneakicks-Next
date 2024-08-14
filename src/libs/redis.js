// import { Redis } from "ioredis";
import { Redis } from '@upstash/redis'
require('dotenv').config();

export const redis = new Redis({
    url: process.env.REDIS_URL2,
    token: process.env.REDIS_TOKEN,
});