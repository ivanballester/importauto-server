const { Schema, model } = require("mongoose");

const carSchema = new Schema(
  {
    model: {
      type: String,
    },
    brand: {
      type: String,
    },
    year: {
      type: Number,
    },
    kilometers: {
      type: Number,
    },
    price: {
      type: Number,
    },
    fuelType: {
      type: String,
    },
    horsepower: {
      type: Number,
    },
    seats: {
      type: Number,
    },
    engine: {
      type: String,
    },
    transmission: {
      type: String,
    },
    imageUrls: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = model("Car", carSchema);
