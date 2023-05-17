import mongoose from "mongoose";

const mongoURL = "mongodb://127.0.0.1:27017/graphql";
export const connectWithRetry = async () => {
  await mongoose
    .connect(mongoURL)
    .then(() => console.log("Successfully connected to DB"))
    .catch((err) => {
      console.log(`Error connecting to database: ${err}`);
      setTimeout(connectWithRetry, 5000);
    });
};
