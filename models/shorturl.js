const mongoose = require("mongoose");

//create database schema
const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String
  },
  shortUrl: {
    type: String
  }
});

//create model
const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
