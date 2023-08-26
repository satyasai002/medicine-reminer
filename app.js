const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

const userRoutes = require("./Routes/user");
const medicineRouter = require("./Routes/medicine");

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL).then(console.log("db connected"));
mongoose.Promise = global.Promise;

app.use("/user", userRoutes);
app.use("/medicine", medicineRouter);

const PORT = process.env.PORT !== undefined ? process.env.PORT : 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
