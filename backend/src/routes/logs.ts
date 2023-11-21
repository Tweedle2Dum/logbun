import { Request,Response } from "express";
import { createNewLogs, getLogs, realTimeLogs } from "../controller/LogController";
const express = require('express');
const logRouter = express.Router();



logRouter.route('/')
.get(getLogs)
.post(createNewLogs)

logRouter.route('/live')
.get(realTimeLogs)




 export default  logRouter ;