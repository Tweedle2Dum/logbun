import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
    console.info(process.env.DATABASE_URI);
    mongoose.connect(process.env.DATABASE_URI as string);
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error", err);
      //Log.error('MongoDB connection error: ' + err);
      process.exit();
    });
    mongoose.connection.on("connected", () => {
      console.info("Connected to mongoDB");
    });
    mongoose.connection.on("disconnected", () => {
      console.info("Disconnected from MongoDB");
    });
};


export default connectDB;
