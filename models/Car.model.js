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
    km: {
      type: String,
      required: [true, "KM is required."],
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    combustion: {
      type: String,
      require: [true, "Combustion is required."],
    },
    cv: {
      type: Number,
      required: [true, "CV is required."],
    },
    seats: {
      type: String,
      required: [true, "Seats is required."],
    },
    motor: {
      type: String,
      required: [true, "Motor is required."],
    },
    type: {
      type: String,
      required: [true, "Type is required."],
    },
  },
  { timestamps: true }
);

module.exports = model("Car", carSchema);
