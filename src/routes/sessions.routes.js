import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import { UserModel } from "../models/user.model.js";
import CartModel from "../models/cart.model.js";
import { createHash } from "../utils/hash.js";

const router = Router();

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      user: {
        id: req.user._id,
        first_name: req.user.first_name,
        email: req.user.email,
        role: req.user.role
      }
    });
  }
);
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const newCart = await CartModel.create({ products: [] });

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: newCart._id,
      role: "user"
    });

    res.status(201).json({
      status: "success",
      message: "Usuario registrado correctamente",
      user: {
        id: newUser._id,
        first_name: newUser.first_name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
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

export default router;