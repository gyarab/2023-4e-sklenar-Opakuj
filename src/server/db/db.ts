import mongoose from "mongoose";
import { ConnectOptions } from "mongoose";
var mongo_uri = process.env.MONGO_URI as string;

var connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongo_uri, {
      tlsCertificateKeyFile:
        "./src/server/db/X509-cert-3262727976732888816.pem",
      authMechanism: "MONGODB-X509",
      authSource: "$external",
    } as ConnectOptions);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  console.log("MongoDB Connected");
};

export default { connectDB };
