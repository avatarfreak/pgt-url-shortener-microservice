const express = require("express");
const shortUrlModel = require("../models/shorturl");
const app = express();

//Read All
app.get("/api/shorturl/new/", async (req, res, next) => {
  const { url } = req.params;
  await shortUrlModel.find().then(data => res.send(data));
});

//redirect short url
app.get("/api/shorturl/new/:url(*)", async (req, res, next) => {
  const { url } = req.params;
  const shorturl = await shortUrlModel
    .find({ shortUrl: url })
    .then(data =>
      data.map(d => {
        const re = new RegExp("^(http|https)://", "i");
        const validUrl = d.originalUrl;
        if (re.test(validUrl)) {
          res.redirect(301, d.originalUrl);
        } else {
         res.redirect(301, "http://" + d.originalUrl); 
        }
      })
    )
    .catch(err => res.status(500).send(err));
});

//post request
app.post("/api/shorturl/new/", async (req, res, next) => {
  const { url } = req.body;
  const expression = /[-a-zA-Z0-9@:%\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%\+.~#?&//=]*)?/gi;
  const short = Math.floor(Math.random() * 100000).toString();
  let data;

  try {
    if (expression.test(url)) {
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
