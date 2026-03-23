export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getByEmail = (email) => this.dao.getByEmail(email);

  getById = (id) => this.dao.getById(id);

  create = (user) => this.dao.create(user);

  update = (id, data) => this.dao.update(id, data);
}