"use strict";

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const shorturlRouter = require("./models/shorturlRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

//create port
const PORT = process.env.PORT || 3000;

//read .env variables
dotenv.config();

//connect database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.use(shorturlRouter);
//default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
