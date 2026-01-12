import ProductModel from "../models/product.model";

class ProductsMongoDAO {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const filter = {};

    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const options = {
      page,
      limit,
      sort: sortOption,
      lean: true
    };

    const result = await ProductModel.paginate(filter, options);

    return {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}`
        : null
    };
  }

  async getProductById(pid) {
    return await ProductModel.findById(pid).lean();
  }

  async createProduct(product) {
    return await ProductModel.create(product);
  }

  async updateProduct(pid, data) {
    return await ProductModel.findByIdAndUpdate(pid, data, { new: true });
  }

  async deleteProduct(pid) {
    return await ProductModel.findByIdAndDelete(pid);
  }
}

export default ProductsMongoDAO;