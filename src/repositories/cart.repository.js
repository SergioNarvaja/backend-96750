export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getById = (id) => this.dao.getById(id);

  create = (cart) => this.dao.create(cart);

  update = (id, data) => this.dao.update(id, data);
}