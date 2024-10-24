const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAdmin, isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();
const User = require("../models/User.model");
const saltRounds = 10;

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/users", async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "Email, nombre y contraseña son requeridos." });
  }
  try {
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      return res
        .status(400)
        .json({ message: "El correo ya se encuentra registrado." });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    console.log("Usuario creado:", createdUser);
    return res
      .status(201)
      .json({ message: "Usuario creado exitosamente", user: createdUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
