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

router.post("/cars", async (req, res, next) => {
  try {
    const newCar = await Car.create(req.body);
    res.status(201).json(newCar);
  } catch (error) {
    next(error);
  }
});

router.put("/cars/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedCar = await Car.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCar);
  } catch (error) {
    next(error);
  }
});

router.delete("/cars/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedCar = await Car.findByIdAndDelete(id);
    res.json(deletedCar);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
