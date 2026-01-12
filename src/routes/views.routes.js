import { Router } from "express";
import ProductsDAO from "../dao/products.dao.js";
import CartModel from "../models/cart.model.js";

const router = Router();
const productsDAO = new ProductsDAO();

router.get("/", (req, res) => {
  res.redirect("/products");
});

router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const result = await productsDAO.getPaginated({
    limit,
    page,
    sort,
    query
  });

  let cartId = req.cookies.cartId;

  if (!cartId) {
    const newCart = await CartModel.create({ products: [] });
    cartId = newCart._id.toString();

    res.cookie("cartId", cartId, {
      httpOnly: true
    });
  }

  res.render("products", {
    ...result,
    cartId
  });
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  const cart = await CartModel.findById(cid)
    .populate("products.product")
    .lean();

  res.render("cart", cart);
});

export default router;