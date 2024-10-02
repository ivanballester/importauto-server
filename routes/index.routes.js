const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const carsRouter = require("./cars.routes");
const authRouter = require("./auth.routes");
const usersRouter = require("./users.routes");

router.use("/", carsRouter);
router.use("/auth", authRouter);
router.use("/", usersRouter);

module.exports = router;
