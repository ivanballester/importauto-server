const express = require("express");
const Car = require("../models/Car.model");

const router = express.Router();

router.get("/cars", async (req, res, next) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    next(error);
  }
});

router.get("/cars/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    res.json(car);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
