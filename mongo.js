import 'dotenv/config'

import mongoose from "mongoose"

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const mongoIP = process.env.MONGO_IP;
const mongoPort = process.env.MONGO_PORT;

const connectMongoWithRetry = () => {
  if(mongoose.connection.readyState === 1) {  // connected
    return;
  }
  if(mongoose.connection.readyState === 2) {  // connecting
    return;
  }
  mongoose
    .connect(
      `mongodb://${user}:${password}@${mongoIP}:${mongoPort}/newTest?authSource=admin`
    )
    .then(() => console.log("successfully connected to MongoDB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};
connectMongoWithRetry();

export default connectMongoWithRetry;