import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import connectMongo from "./src/config/db.js";
import { initializePassport } from "./src/config/passport.config.js";
import ProductsDAO from "./src/dao/products.dao.js";
import productsRouter from "./src/routes/products.routes.js";
import cartsRouter from "./src/routes/carts.routes.js";
import viewsRouter from "./src/routes/views.routes.js";
import sessionsRouter from "./src/routes/sessions.routes.js";

dotenv.config();

const app = express();
const productsDAO = new ProductsDAO();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src/views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

const PORT = 8080;

const startServer = async () => {
  await connectMongo();

  const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Server escuchando en http://localhost:${PORT}`);
  });

  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    console.log("🟢 Cliente conectado");

    const products = await productsDAO.getAll();
    socket.emit("productsUpdated", products);

    socket.on("newProduct", async (product) => {
      await productsDAO.create(product);
      const updatedProducts = await productsDAO.getAll();
      io.emit("productsUpdated", updatedProducts);
    });

    socket.on("deleteProduct", async (id) => {
      await productsDAO.delete(id);
      const updatedProducts = await productsDAO.getAll();
      io.emit("productsUpdated", updatedProducts);
    });
  });
};

startServer();