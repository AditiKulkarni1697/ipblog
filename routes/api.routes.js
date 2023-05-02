const { UserModel } = require("../models/user.model");
const express = require("express");
const { client } = require("../helpers/redis");
const axios = require("axios");
var getJSON = require("get-json");
const apiRouter = express.Router();

apiRouter.get("/", async (req, res) => {
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  console.log(req.ip);
 // res.send(ip);
  try {
    const is_ip_in_cache = await client.get(ip);
    // console.log(city);
    if (is_ip_in_cache) return res.status(200).send({ data: is_ip_in_cache });
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const ipInfo = response.data;
    client.set(ipInfo, JSON.stringify(ipInfo), "EX", 6 * 60);
    console.log(client.get(ipInfo));
    res.send(ipInfo.city)
    // await CityModel.findByIdAndUpdate(
    //   { userID: req.body.userID },
    //   { userID: req.body.userID, $push: { previous_searches: city } },
    //   { new: true, upsert: true, setDefaultsOnInsert: true }
    // );
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = { apiRouter };
