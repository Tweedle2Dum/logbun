import { Request, Response } from "express";
import LogVSchema from "../validators/LogValidator";
import { LogsQueue } from "../configs/bullMQ";
import { v4 as uuidv4 } from "uuid";
import { addToRedis } from "../configs/redisConn";
import { PubSub, client } from "../configs/redisConn";
import { Log } from "../models/LogSchema";
import { match } from "assert";

export async function createNewLogs(req: Request, res: Response) {
  try {
    const logData = req.body;
    // Add log to Redis for querying
    const setResult = await addToRedis(logData);
    LogsQueue.add("log", logData);

    client.publish("log", JSON.stringify(logData));
    return res.status(200).json({
      success: true,
      setResult,
      logData,
    });
  } catch (error) {
    console.error("Error creating new logs:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

export async function getLogs(req: Request, res: Response) {
  try {
    // Constructing filter based on request parameters
    const filter: Record<string, any> = {
      level: req.query.level,
      message: req.query.message
        ? { $regex: new RegExp(req.query.message.toString(), "i") }
        : undefined,
      resourceId: req.query.resourceid,
      traceId: req.query.traceid,
      spanId: req.query.spanid,
      commit: req.query.commit,
      "metadata.parentResourceId": req.query.parentresourceid,
      timestamp: req.query.timestamp
        ? new Date(req.query.timestamp.toString())
        : undefined,
    };

    // Constructing date range for timestamp
    if (req.query.fromtimestamp && req.query.totimestamp) {
      filter.timestamp = {
        $gte: new Date(req.query.fromtimestamp.toString()),
        $lte: new Date(req.query.totimestamp.toString()),
      };
    } else if (req.query.fromtimestamp) {
      filter.timestamp = {
        $gte: new Date(req.query.fromtimestamp.toString()),
      };
    } else if (req.query.totimestamp) {
      filter.timestamp = { $lte: new Date(req.query.totimestamp.toString()) };
    }
    console.log(filter);
    // Query logs from the database
    Object.keys(filter).forEach(
      (key) => filter[key] === undefined && delete filter[key]
    );
    const logs = await Log.find(filter);
    // Respond with the retrieved logs
    res.status(200).json({ data: logs });
  } catch (error) {
    // Handle errors and respond with a 500 Internal Server Error
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal server error", log: error });
  }
}

export async function realTimeLogs(req: Request, res: Response) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
  const generate = (message: any) => {
    try {
      const logData = JSON.parse(message);
      const filter: Record<string, any> = {
        level: req.query.level,
        message: req.query.message
          ? { $regex: new RegExp(req.query.message.toString(), "i") }
          : undefined,
        resourceId: req.query.resourceid,
        traceId: req.query.traceid,
        spanId: req.query.spanid,
        commit: req.query.commit,
        "metadata.parentResourceId": req.query.parentresourceid,
        timestamp: req.query.timestamp
          ? new Date(req.query.timestamp.toString())
          : undefined,
      };
  
      // Constructing date range for timestamp
      if (req.query.fromtimestamp && req.query.totimestamp) {
        filter.timestamp = {
          $gte: new Date(req.query.fromtimestamp.toString()),
          $lte: new Date(req.query.totimestamp.toString()),
        };
      } else if (req.query.fromtimestamp) {
        filter.timestamp = {
          $gte: new Date(req.query.fromtimestamp.toString()),
        };
      } else if (req.query.totimestamp) {
        filter.timestamp = { $lte: new Date(req.query.totimestamp.toString()) };
      }
      console.log(filter);
      // Query logs from the database
      Object.keys(filter).forEach(
        (key) => filter[key] === undefined && delete filter[key]
      );
      const matchesFilter = Object.entries(filter).every(([key, value]) => {
        if (key === "message" && value.$regex) {
          return value.$regex.test(logData[key]);
        } else {
          return logData[key] === value;
        }
      });
      if (matchesFilter) {
        res.write(`data: ${JSON.stringify(logData)}\n\n`);
      }
    } catch (error) {
      console.error("An error occured", error);
      res.write(`error: Internal server error ${error}\n\n`);
    }
  };
  PubSub.subscribe('log',generate);
  req.on('close',()=>{
    PubSub.removeListener('message',generate);
    res.end();
  })


}
