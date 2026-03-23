import { createHash, isValidPassword } from "../utils/hash.js";

export default class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(userData) {
    const { email, password, first_name, last_name } = userData;

    if (!email || !password || !first_name || !last_name) {
      throw new Error("Faltan campos obligatorios");
    }

    const exists = await this.userRepository.getByEmail(email);

    if (exists) {
      throw new Error("El usuario ya existe");
    }

    const newUser = {
      ...userData,
      password: createHash(password),
      role: "user"
    };

    return await this.userRepository.create(newUser);
  }

  async login(email, password) {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (!isValidPassword(user, password)) {
      throw new Error("Password incorrecta");
    }

    return user;
  }

  async getByEmail(email) {
    return await this.userRepository.getByEmail(email);
  }
}