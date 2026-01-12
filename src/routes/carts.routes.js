import { Router } from "express";
import CartModel from "../models/cart.model.js";

const router = Router();

router.post("/", async (req, res) => {
  const newCart = await CartModel.create({ products: [] });
  res.json(newCart);
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  const cart = await CartModel.findById(cid)
    .populate("products.product")
    .lean();

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart);
});

export default router;