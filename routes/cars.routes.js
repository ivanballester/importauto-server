const express = require("express");
const Car = require("../models/Car.model");
const multer = require("multer");
const s3 = require("../config/awsConfig");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

router.post("/cars", upload.array("images", 10), async (req, res) => {
  const {
    model,
    brand,
    year,
    kilometers,
    price,
    fuelType,
    horsepower,
    seats,
    engine,
    transmission,
  } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).send("No se han subido imágenes");
  }

  try {
    // Subir imágenes a S3
    const imageUrls = [];
    for (const file of files) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `cars/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const data = await s3.upload(params).promise();
      imageUrls.push(data.Location);
    }

    // Guardar el coche en la base de datos
    const newCar = new Car({
      model,
      brand,
      year,
      kilometers,
      price,
      fuelType,
      horsepower,
      seats,
      engine,
      transmission,
      imageUrls,
    });

    await newCar.save();

    // Responder con los datos del coche
    res
      .status(201)
      .json({ message: "Coche creado correctamente", car: newCar });
  } catch (error) {
    console.error("Error subiendo las imágenes a S3:", error);
    res.status(500).send("Error al subir las imágenes o guardar el coche");
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
