require("dotenv").config();
const express = require("express");
const router = express.Router();
const multer = require("multer");
const s3 = require("../config/awsConfig");
const Car = require("../models/Car.model");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/uploadImg", upload.array("images", 10), async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).send("No se han subido archivos");
  }

  try {
    // Subir cada imagen a AWS S3
    const imageUrls = [];
    for (const file of files) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `images/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const data = await s3.upload(params).promise();
      imageUrls.push(data.Location);
    }

    // Guardar las URLs en la base de datos
    const newImage = new Car({ imageUrls });
    await newImage.save();

    // Responder con las URLs de las imágenes subidas
    res
      .status(200)
      .json({ message: "Imágenes subidas correctamente", imageUrls });
  } catch (error) {
    console.error("Error subiendo las imágenes a S3:", error);
    res.status(500).send("Error subiendo las imágenes");
  }
});

module.exports = router;
