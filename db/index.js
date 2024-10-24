const mongoose = require("mongoose");

const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/importauto-server";

mongoose
  .connect(mongoURI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
