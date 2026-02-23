import CartModel from "../models/cart.model.js";

export default class CartsDAO {
  async create() {
    return await CartModel.create({ products: [] });
  }

  async getById(cid) {
    return await CartModel.findById(cid)
      .populate("products.product")
      .lean();
  }

  async addProduct(cid, pid) {
    const cart = await CartModel.findById(cid);

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    return await cart.save();
  }

  async updateCart(cid, products) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { products },
      { new: true }
    );
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);

    const product = cart.products.find(
      (p) => p.product.toString() === pid
    );

    if (product) product.quantity = quantity;

    return await cart.save();
  }

  async deleteProduct(cid, pid) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    );
  }

  async clearCart(cid) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { products: [] },
      { new: true }
    );
  }
}