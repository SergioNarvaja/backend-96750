export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getById = (cid) => this.dao.getById(cid);

  create = () => this.dao.create();

  addProduct = (cid, pid) => this.dao.addProduct(cid, pid);

  updateCart = (cid, products) => this.dao.updateCart(cid, products);

  updateProductQuantity = (cid, pid, quantity) =>
    this.dao.updateProductQuantity(cid, pid, quantity);

  deleteProduct = (cid, pid) => this.dao.deleteProduct(cid, pid);

  clearCart = (cid) => this.dao.clearCart(cid);
}