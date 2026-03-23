export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = (params) => this.dao.getPaginated(params);

  getById = (id) => this.dao.getById(id);

  create = (product) => this.dao.create(product);

  update = (id, data) => this.dao.update(id, data);

  delete = (id) => this.dao.delete(id);
}