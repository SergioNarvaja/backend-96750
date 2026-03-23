import mongoose from "mongoose";
import ProductModel from "./models/product.model.js";

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

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await ProductModel.deleteMany();

    await ProductModel.insertMany(products);

    console.log("🔥 Productos insertados");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();