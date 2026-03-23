import { Router } from "express";
import ProductsDAO from "../dao/products.dao.js";
import passport from "passport";
import { authorize } from "../middlewares/authorization.middleware.js";

const router = Router();
const productsDAO = new ProductsDAO();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize(["admin"]),
  async (req, res) => {
    try {
      const product = await productsDAO.create(req.body);

      res.status(201).json({
        status: "success",
        product
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: "Error al crear producto"
      });
    }
  }
);

router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { pid } = req.params;

      const deleted = await productsDAO.delete(pid);

      if (!deleted) {
        return res.status(404).json({
          status: "error",
          error: "Producto no encontrado"
        });
      }

      res.json({
        status: "success",
        message: "Producto eliminado correctamente"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: "Error al eliminar producto"
      });
    }
  }
);

router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorize(["admin","user"]),
  async (req, res) => {
    try {
      const { pid } = req.params;

      const updated = await productsDAO.update(pid, req.body);

      res.json({
        status: "success",
        product: updated
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        error: "Error al actualizar producto"
      });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      category,
      status
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status !== undefined) filter.status = status === "true";

    const result = await productsDAO.getPaginated({
      limit: Number(limit),
      page: Number(page),
      sort,
      filter
    });

    const baseUrl = `/api/products?limit=${limit}&sort=${sort ?? ""}&category=${category ?? ""}&status=${status ?? ""}`;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}&page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}&page=${result.nextPage}` : null
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error al obtener productos"
    });
  }
});

export default router;