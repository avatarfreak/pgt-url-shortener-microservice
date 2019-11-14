const express = require("express");
const shortUrlModel = require("../models/shorturl");
const validUrl = require("valid-url");
const app = express();

app.get("/api/shorturl/new/", (req, res) => {
  shortUrlModel
    .find()
    .then(urls => res.json(urls))
    .catch(err => res.status(400).json("Error: " + err));
});

//redirect short url
app.get("/api/shorturl/:url(*)", async (req, res, next) => {
  const { url } = req.params;
  const shorturl = await shortUrlModel
    .find({ shortUrl: url })
    .then(data =>
      data.map(d => {
        res.redirect(301, d.originalUrl);
      })
    )
    .catch(err => res.status(500).send(err));
});

//post request
app.post("/api/shorturl/new/", async (req, res, next) => {
  const { url } = req.body;
  const short = Math.floor(Math.random() * 100000).toString();
  let data;
  try {
    if (validUrl.isUri(url)) {
      data = new shortUrlModel({ originalUrl: url, shortUrl: short });
      //save to dabase
      await data.save();
      res.json(data);
    }
    data = { originalUrl: url, error: "Invalid url" };
    res.json(data);
  } catch (err) {
    if(err.code === 11000){
      res.status(400).send(`"${url}" already exist.`);
    }
  }
});

module.exports = app;
