const { Schema, model } = require("mongoose");

const carSchema = new Schema(
  {
    model: {
      type: String,
      required: [true, "Model is required."],
    },
    brand: {
      type: String,
      required: [true, "Brand is required."],
    },
    year: {
      type: Number,
      required: [true, "Year is required."],
    },
    kilometers: {
      type: Number,
      required: [true, "Mileage is required."],
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    fuelType: {
      type: String,
      required: [true, "Fuel type is required."],
    },
    horsepower: {
      type: Number,
      required: [true, "Horsepower is required."],
    },
    seats: {
      type: Number,
      required: [true, "Seats is required."],
    },
    engine: {
      type: String,
      required: [true, "Engine is required."],
    },
    transmission: {
      type: String,
      required: [true, "Transmission is required."],
    },
    imageUrls: {
      type: [String], // Array de URLs de imágenes
      required: [true, "Image URLs are required."],
    },
  },
  { timestamps: true }
);

module.exports = model("Car", carSchema);
