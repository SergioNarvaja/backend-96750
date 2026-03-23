import { UserModel } from "../models/user.model.js";

export default class UserDAO {

  getByEmail = (email) => UserModel.findOne({ email });

  getById = (id) => UserModel.findById(id);

  create = (user) => UserModel.create(user);

  update = (id, data) =>
    UserModel.findByIdAndUpdate(id, data, { new: true });
}