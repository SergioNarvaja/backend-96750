import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import { userDTO } from "../dto/user.dto.js";
import UserDAO from "../dao/user.dao.js";
import UserRepository from "../repositories/user.repository.js";
import UserService from "../services/user.service.js";

const router = Router();
const userDAO = new UserDAO();
const userRepository = new UserRepository(userDAO);
const userService = new UserService(userRepository);

router.post("/register", async (req, res) => {
  try {
    const user = await userService.register(req.body);

    res.status(201).json({
      status: "success",
      user: userDTO(user)
    });

  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message
    });
  }
});

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);

    res.json({
      status: "success",
      access_token: token
    });
  }
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      user: userDTO(req.user)
    });
  }
);

export default router;