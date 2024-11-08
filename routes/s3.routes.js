require("dotenv").config();
const express = require("express");
const s3 = require("../config/awsConfig");
const router = express.Router();

const allowedContentTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
]; // Define los tipos de contenido permitidos

const generatePresignedUrl = async (req, res) => {
  let { filenames, contentType } = req.body;

  if (!filenames || filenames.length === 0) {
    return res.status(400).json({ error: "No filenames provided" });
  }

  if (!Array.isArray(filenames)) {
    filenames = [filenames];
  }

  // Validamos el tipo de contenido
  if (contentType && !allowedContentTypes.includes(contentType)) {
    return res.status(400).json({ error: "Unsupported content type" });
  }

  try {
    const presignedUrls = await Promise.all(
      filenames.map(async (filename) => {
        const s3Params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `images/${filename}`,
          Expires: 60 * 5,
          ContentType: contentType || "image/jpeg", // Usamos el tipo de contenido recibido o JPEG por defecto
          ACL: "public-read",
        };

        const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
        return uploadUrl;
      })
    );

    res.json({ uploadUrls: presignedUrls });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({ error: "Error generating presigned URL" });
  }
};

// Ruta para generar las URLs prefirmadas
router.post("/s3/generate-upload-urls", express.json(), generatePresignedUrl);

module.exports = router;
