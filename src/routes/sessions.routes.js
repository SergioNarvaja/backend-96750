import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import { userDTO } from "../dto/user.dto.js";
import UserDAO from "../dao/user.dao.js";
import UserRepository from "../repositories/user.repository.js";
import UserService from "../services/user.service.js";
import { generateResetToken, verifyResetToken } from "../utils/jwt.js";
import { createHash, isValidPassword } from "../utils/hash.js";

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

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userService.getByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: "error",
        error: "Usuario no encontrado"
      });
    }

    const token = generateResetToken(email);

    const resetLink = `http://localhost:8080/reset-password?token=${token}`;

    console.log("📩 LINK DE RECUPERACIÓN:");
    console.log(resetLink);

    res.json({
      status: "success",
      message: "Se envió link de recuperación (ver consola)"
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = verifyResetToken(token);

    const user = await userService.getByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({
        status: "error",
        error: "Usuario no encontrado"
      });
    }

    if (isValidPassword(user, newPassword)) {
      return res.status(400).json({
        status: "error",
        error: "No podés usar la misma contraseña"
      });
    }

    user.password = createHash(newPassword);
    await user.save();

    res.json({
      status: "success",
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    res.status(400).json({
      status: "error",
      error: "Token inválido o expirado"
    });
  }
});

export default router;