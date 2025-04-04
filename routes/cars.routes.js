require("dotenv").config();
const express = require("express");
const Car = require("../models/Car.model");
const multer = require("multer");
const s3 = require("../config/awsConfig");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const deleteImageFromS3 = async (imageUrl) => {
  const key = imageUrl.split("/").pop(); // Extrae el nombre del archivo desde la URL

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log("Imagen eliminada de S3 con éxito:", key);
  } catch (error) {
    console.error("Error al eliminar la imagen de S3:", error);
    throw error;
  }
};

router.get("/cars", async (req, res, next) => {
  try {
    const cars = await Car.find();
    console.log("Cars data:", cars); // Verifica que tienes datos
    res.json(cars); // Devuelve la respuesta
  } catch (error) {
    console.error("Error al obtener los coches:", error);
    next(error);
  }
});

router.get("/cars/filters", async (req, res) => {
  console.log("Ruta de filtros llamada");
  try {
    const {
      brand,
      yearMin,
      yearMax,
      priceMin,
      priceMax,
      seatsMin,
      seatsMax,
      kilometersMin,
      kilometersMax,
      fuelType,
      transmission,
      engine,
      horsepowerMin,
      horsepowerMax,
    } = req.query;
    console.log("Filtros recibidos:", req.query);
    // Crear un objeto de filtros vacío
    let filterConditions = {};

    // Filtros por marca (asegúrate de que 'brand' es un string válido)
    if (brand) {
      const brands = brand.split(",");
      filterConditions.brand = { $in: brands };
    }

    // Filtro por año mínimo (asegúrate de que 'yearMin' es un número válido)
    if (yearMin) {
      const year = parseInt(yearMin, 10);
      if (!isNaN(year)) {
        filterConditions.year = { ...filterConditions.year, $gte: year };
      } else {
        return res
          .status(400)
          .json({ error: "'yearMin' debe ser un número válido" });
      }
    }

    // Filtro por año máximo (asegúrate de que 'yearMax' es un número válido)
    if (yearMax) {
      const year = parseInt(yearMax, 10);
      if (!isNaN(year)) {
        filterConditions.year = { ...filterConditions.year, $lte: year };
      } else {
        return res
          .status(400)
          .json({ error: "'yearMax' debe ser un número válido" });
      }
    }
    if (kilometersMin) {
      const kilometers = parseInt(kilometersMin, 10);
      if (!isNaN(kilometers)) {
        filterConditions.kilometers = {
          ...filterConditions.kilometers,
          $gte: kilometers,
        };
      } else {
        return res
          .status(400)
          .json({ error: "'kilometersMin' debe ser un número válido" });
      }
    }

    if (kilometersMax) {
      const kilometers = parseInt(kilometersMax, 10);
      if (!isNaN(kilometers)) {
        filterConditions.kilometers = {
          ...filterConditions.kilometers,
          $lte: kilometers,
        };
      } else {
        return res
          .status(400)
          .json({ error: "'kilometersMax' debe ser un número válido" });
      }
    }

    // Filtro por precio mínimo (asegúrate de que 'priceMin' es un número válido)
    if (priceMin) {
      const price = parseFloat(priceMin);
      if (!isNaN(price)) {
        filterConditions.price = { ...filterConditions.price, $gte: price };
      } else {
        return res
          .status(400)
          .json({ error: "'priceMin' debe ser un número válido" });
      }
    }

    // Filtro por precio máximo (asegúrate de que 'priceMax' es un número válido)
    if (priceMax) {
      const price = parseFloat(priceMax);
      if (!isNaN(price)) {
        filterConditions.price = { ...filterConditions.price, $lte: price };
      } else {
        return res
          .status(400)
          .json({ error: "'priceMax' debe ser un número válido" });
      }
    }

    // Filtro por número de asientos (asegúrate de que 'seats' es un número válido)
    if (seatsMin) {
      const seats = parseInt(seatsMin, 10);
      if (!isNaN(seats)) {
        filterConditions.seats = { ...filterConditions.seats, $gte: seats };
      } else {
        return res
          .status(400)
          .json({ error: "'seatsMin' debe ser un número valido" });
      }
    }

    if (seatsMax) {
      const seats = parseInt(seatsMax, 10);
      if (!isNaN(seats)) {
        filterConditions.seats = { ...filterConditions.seats, $lte: seats };
      } else {
        return res
          .status(400)
          .json({ error: "'seatsMax' debe ser un número valido" });
      }
    }

    // Filtro por tipo de combustible
    if (fuelType) {
      filterConditions.fuelType = fuelType;
    }

    // Filtro por tipo de transmisión
    if (transmission) {
      filterConditions.transmission = transmission;
    }

    // Filtro por tipo de motor
    if (engine) {
      filterConditions.engine = engine;
    }

    // Filtro por potencia del motor (asegúrate de que 'horsepowerMin' y 'horsepowerMax' sean números validos)
    if (horsepowerMin && horsepowerMax) {
      const minHorsepower = parseInt(horsepowerMin, 10);
      const maxHorsepower = parseInt(horsepowerMax, 10);
      if (!isNaN(minHorsepower) && !isNaN(maxHorsepower)) {
        filterConditions.horsepower = {
          $gte: minHorsepower,
          $lte: maxHorsepower,
        };
      } else {
        return res.status(400).json({
          error: "'horsepowerMin' y 'horsepowerMax' deben ser números",
        });
      }
    }

    // Realizar la consulta usando los filtros dinámicos
    const filteredCars = await Car.find(filterConditions);

    res.json(filteredCars);
  } catch (error) {
    console.error("Error al obtener los coches:", error);
    res.status(500).json({ error: "Error al obtener los coches" });
  }
});

router.get("/cars/:id", async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    console.log("Car data:", car); // Verifica que tienes datos
    res.json(car); // Devuelve la respuesta
  } catch (error) {
    console.error("Error al obtener el coche:", error);
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

router.post(
  "/cars/:carId/images",
  upload.array("images", 10),
  async (req, res) => {
    const { carId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).send("No se han subido imágenes");
    }

    try {
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

      // Obtener el coche de la base de datos y agregar las nuevas imágenes
      const car = await Car.findById(carId);
      car.imageUrls.push(...imageUrls); // Añadir las nuevas imágenes al array
      await car.save();

      res.status(200).json({
        message: "Imágenes añadidas correctamente",
        imageUrls: car.imageUrls,
      });
    } catch (error) {
      console.error("Error al agregar imágenes:", error);
      res.status(500).send("Error al agregar imágenes al coche");
    }
  }
);

router.put("/cars/:carId", async (req, res) => {
  const { carId } = req.params;
  const updatedData = req.body;

  try {
    const car = await Car.findByIdAndUpdate(carId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({ message: "Coche no encontrado" });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error("Error al actualizar el coche:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
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

const getImageUrlFromDatabase = async (carId, index) => {
  try {
    // Buscamos el coche por su ID
    const car = await Car.findById(carId);

    if (!car) {
      throw new Error("Coche no encontrado");
    }

    // Verificamos si el índice de la imagen es válido
    if (index < 0 || index >= car.imageUrls.length) {
      throw new Error("Índice de imagen inválido");
    }

    // Retornamos la URL de la imagen en la posición indicada
    return car.imageUrls[index];
  } catch (error) {
    throw error;
  }
};
const extractFileNameFromUrl = (url) => {
  if (typeof url !== "string" || url.trim() === "") {
    throw new Error("La URL proporcionada no es válida");
  }

  const parts = url.split("/");
  return parts.pop() || "";
};

router.delete("/cars/:carId/images/:index", async (req, res) => {
  const { carId, index } = req.params;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).send("Coche no encontrado");
    }

    const imageUrl = car.imageUrls[index];
    if (!imageUrl) {
      return res.status(400).send("Índice de imagen inválido");
    }

    const fileName = extractFileNameFromUrl(imageUrl);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    };

    await s3.deleteObject(params).promise();

    await Car.findByIdAndUpdate(carId, {
      $pull: { imageUrls: imageUrl },
    });

    res.status(200).send("Imagen eliminada con éxito");
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    res.status(500).send("Error al eliminar la imagen");
  }
});

module.exports = router;
