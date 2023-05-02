const express = require("express");
const { client } = require("../helpers/redis");

const authentication = async (req, res, next) => {
  const token = req.headers?.authorization;
  if (!token) return res.send("please login");

  const blacklisted = await client.get("blacklist_token");

  if (blacklisted) return res.send({ msg: "please login" });

  next();
};

module.exports = { authentication };
