import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import connectMongo from "../config/db.js";

const products = [
  {
    title: "Masaje relajante",
    description: "Masaje corporal completo",
    price: 5000,
    code: "MAS001",
    stock: 10,
    category: "masajes",
    status: true
  },
  {
    title: "Masaje descontracturante",
    description: "Ideal para dolores musculares",
    price: 6500,
    code: "MAS002",
    stock: 8,
    category: "masajes",
    status: true
  }
];

const seed = async () => {
  await connectMongo();

  await ProductModel.deleteMany();
  await ProductModel.insertMany(products);

  console.log("✅ Productos cargados correctamente");
  mongoose.connection.close();
};

seed();