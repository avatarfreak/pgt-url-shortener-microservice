const express = require("express");
const shortUrlModel = require("../models/shorturl");
const validUrl = require("valid-url");
const app = express();

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
    res.status(500).send(err);
  }
});

module.exports = app;
