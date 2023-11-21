import mongoose, { Schema } from "mongoose";

export type LogDocument = mongoose.Document & {
  level: String;
  message: String;
  resourceId: String;
  timestamp: Date;
  traceId: String;
  spanId: String;
  commit: String;
  metaData: {
    parentResourceId: String;
  };
};

const LogSchema: Schema = new Schema({
  level: String,
  message: String,
  resourceId: String,
  timestamp: Date,
  traceId: String,
  spanId: String,
  commit: String,
  metaData: {
    parentResourceId: String,
  },
});

export default LogSchema;

export const Log = mongoose.model<LogDocument>('Log',LogSchema)

Log.collection.createIndex("level");
Log.collection.createIndex("resourceId");
Log.collection.createIndex("traceId");
Log.collection.createIndex("commit");