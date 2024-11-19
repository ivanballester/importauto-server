const nodemailer = require("nodemailer");
require("dotenv").config();
const express = require("express");
const router = express.Router();

console.log(process.env.MAIL_USER);
console.log(process.env.MAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

router.post("/contact-mail", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Datos recibidos:", req.body);

  if (!name || !email || !message) {
    return res.status(400).send("Todos los campos son obligatorios.");
  }

  const mailOptions = {
    from: email,
    to: process.env.MAIL_USER,
    subject: `Nuevo mensaje de ${name}`,
    text: `
      Nombre: ${name}
      Correo: ${email}
      Mensaje: ${message}
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.response);
    res.status(200).send("Mensaje enviado correctamente.");
    require("dotenv").config();
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send("Hubo un error al enviar el correo.");
  }
});

module.exports = router;
