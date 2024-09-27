const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const carsRouter = require("./cars.routes");
router.use("/", carsRouter);

module.exports = router;
