const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();
const saltRounds = 10;

router.post("/signup", async (req, res, next) => {
  const { email, password, name } = req.body;

  //Check if user provided not an empty slot
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "Email, nombre y contraseña son requeridos." });
  }

  //Check if email has correct format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email no válido" });
  }

  //Check if password has correct format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "La contraseña debe tener 6 caracteres mínimo, los cuales tiene que haber 1 mayúscula, 1 minúscula y 1 número",
    });
  }

  try {
    //Check if email is not already registered
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(400)
        .json({ message: "Este email ya ha sido registrado" });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    const payload = {
      _id: createdUser._id,
      email: createdUser.email,
      role: createdUser.role,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });
    res.status(201).json({ authToken });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ errorMessage: "Email y password son obligatorios" });
    return;
  }

  try {
    const foundUser = await User.findOne({ email: email });
    if (foundUser === null) {
      res.status(400).json({
        errorMessage: "Usuario no registrado con ese correo electronico",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (isPasswordCorrect === false) {
      res.status(400).json({ errorMessage: "Contraseña no correcta" });
      return;
    }

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    res.status(200).json({ authToken });
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log(`req.payload`, req.payload);
  res.status(200).json(req.payload);
});

module.exports = router;
