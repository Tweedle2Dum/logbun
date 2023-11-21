import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import connectDB from "./configs/dbConn";
import morgan from 'morgan'
import logRouter from "./routes/logs";
import connectRedis from "./configs/redisConn";
import { QueueInit, WorkerInit } from "./configs/bullMQ";
import cron from 'node-cron';
dotenv.config();

const app: Express = express();
const router = express.Router();
const PORT = process.env.PORT||3000;

connectDB()//connect to mongodb
connectRedis()//connect to redis
QueueInit()
const worker = WorkerInit()
cron.schedule('*/5 * * * *',async()=>{
    await worker.run()
})

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

app.use("/logs", logRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("HELLO WORLD");
});

app.listen(PORT, () => {
  console.log("APP LISTENING ON PORT:" + PORT);
});
