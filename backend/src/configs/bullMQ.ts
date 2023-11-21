import {Queue,Worker} from 'bullmq'
import { Log } from '../models/LogSchema'

export let LogsQueue:Queue;

export async function QueueInit(){
    LogsQueue = new Queue('logsQueue',{
        connection:{
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT!),
            password: process.env.REDIS_PASS,
        }
    })

}


export function WorkerInit(){
    const worker = new Worker(
        'logsQueue',
        async (task) => {
          try {
            console.log(task)
            // Assuming you have a Log model with a create method
            // Adjust the code based on your LogSchema implementation
            await Log.create(task.data);
            console.log('Log processed and stored in MongoDB');
          } catch (error) {
            console.error('Error processing log:', error);
          }
          return Promise.resolve();
        },
        {
          connection: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT!),
            password: process.env.REDIS_PASS,
          },
        }
      );
      return worker 
}