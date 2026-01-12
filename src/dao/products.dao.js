import ProductModel from "../models/product.model.js";

export default class ProductsDAO {

  async getPaginated({ limit = 10, page = 1, sort, filter = {} }) {

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    return ProductModel.paginate(filter, {
      limit,
      page,
      sort: sortOption,
      lean: true
    });
  }

}