import { Router } from "express";
import ProductsDAO from "../dao/products.dao.js";

const router = Router();
const productsDAO = new ProductsDAO();

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
    console.error(error);
    res.status(500).json({
      status: "error",
      error: "Error al obtener productos"
    });
  }
});

export default router;