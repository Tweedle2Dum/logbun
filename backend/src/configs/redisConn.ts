import { RedisClientType, createClient } from "redis";
import { Queue } from 'bullmq';
export let client: RedisClientType;
export let PubSub: RedisClientType;
const connectRedis = async () => {
  console.info(process.env.REDIS_PASS);
  console.info(process.env.REDIS_HOST);
  console.info(process.env.REDIS_PORT);
  client = createClient({
    password: process.env.REDIS_PASS,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT as string),
    },
  });

  PubSub = client.duplicate();

  (async () => {
    // Connect to redis server
    await PubSub.connect();
    await client.connect();
  })();

  client.on("connect", () => {
    console.log("connected to redis");
  });
  client.on("error", () =>console.log("cannot connect to redis"));
  client.on("end", () => console.log("Redis stopped"));
  PubSub.on("connect", () => console.log("PubSub connected"));
  PubSub.on("error", (err) => console.error("PubSub connection failed"));
  PubSub.on("end", () => console.log("PubSub stopped"));
};


export const addToRedis = async (logData: any) => {
  console.log(logData) 
    const setResult = await client.set(`log:${logData.id}`, JSON.stringify(logData));
    console.log(setResult)
    return setResult
   
  };



export default connectRedis;
