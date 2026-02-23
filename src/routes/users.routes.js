import { Router } from "express";
import passport from "passport";
import { UserModel } from "../models/user.model.js";
import { createHash } from "../utils/hash.js";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      const users = await UserModel.find().select("-password");

      res.json({
        status: "success",
        payload: users
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

router.get(
  "/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;

      if (req.user.role !== "admin" && req.user._id.toString() !== uid) {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      const user = await UserModel.findById(uid).select("-password");

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({
        status: "success",
        payload: user
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

router.put(
  "/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;

      if (req.user.role !== "admin" && req.user._id.toString() !== uid) {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      const updateData = { ...req.body };

      if (updateData.password) {
        updateData.password = createHash(updateData.password);
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        uid,
        updateData,
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({
        status: "success",
        payload: updatedUser
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

router.delete(
  "/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      const deletedUser = await UserModel.findByIdAndDelete(req.params.uid);

      if (!deletedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({
        status: "success",
        message: "Usuario eliminado correctamente"
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

export default router;