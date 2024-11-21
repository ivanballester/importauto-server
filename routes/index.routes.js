const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const carsRouter = require("./cars.routes");
const usersRouter = require("./users.routes");
const s3Router = require("./s3.routes");
const mailRouter = require("./mail.routes");
const authRouter = require("./auth.routes");

router.use("/", carsRouter);
router.use("/", usersRouter);
router.use("/", s3Router);
router.use("/", mailRouter);
router.use("/auth", authRouter);

module.exports = router;
