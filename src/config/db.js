import mongoose from "mongoose";

const MONGO_URL = "mongodb://127.0.0.1:27017/serzen";

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("🟢 Conectado a MongoDB");
  } catch (error) {
    console.error("🔴 Error al conectar MongoDB:", error);
  }
};

export default connectMongo;