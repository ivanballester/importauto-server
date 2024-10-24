const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const carsRouter = require("./cars.routes");
const usersRouter = require("./users.routes");

router.use("/", carsRouter);
router.use("/", usersRouter);

module.exports = router;
