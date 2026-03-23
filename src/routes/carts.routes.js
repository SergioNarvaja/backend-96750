import { Router } from "express";
import passport from "passport";
import { authorize } from "../middlewares/authorization.middleware.js";
import CartsDAO from "../dao/carts.dao.js";
import ProductDAO from "../dao/products.dao.js";
import TicketDAO from "../dao/ticket.dao.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";
import PurchaseService from "../services/purchase.service.js";

const router = Router();
const cartDAO = new CartsDAO();
const productDAO = new ProductDAO();
const ticketDAO = new TicketDAO();
const cartRepository = new CartRepository(cartDAO);
const productRepository = new ProductRepository(productDAO);
const ticketRepository = new TicketRepository(ticketDAO);
const purchaseService = new PurchaseService(
  cartRepository,
  productRepository,
  ticketRepository
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize(["user", "admin"]),
  async (req, res) => {
    try {
      const newCart = await cartRepository.create();

      res.status(201).json({
        status: "success",
        cart: newCart
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message
      });
    }
  }
);

router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  authorize(["user","admin"]),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;

      await cartRepository.addProduct(cid, pid);

      res.json({
        status: "success",
        message: "Producto agregado al carrito"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message
      });
    }
  }
);

router.get(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  authorize(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid } = req.params;

      const cart = await cartRepository.getById(cid);

      if (!cart) {
        return res.status(404).json({
          status: "error",
          error: "Carrito no encontrado"
        });
      }

      res.json({
        status: "success",
        cart
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: error.message
      });
    }
  }
);

router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  authorize(["user","admin"]),
  async (req, res) => {
    try {
      const { cid } = req.params;

      const result = await purchaseService.purchase(
        cid,
        req.user.email
      );

      res.json({
        status: "success",
        ticket: result.ticket,
        productsNotPurchased: result.productsNotPurchased
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error.message
      });
    }
  }
);

export default router;