const { UserModel } = require("../models/user.model");
const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { client } = require("../helpers/redis");
const { authentication } = require("../middlewares/authentication.middleware");

userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send({ msg: users });
  } catch (err) {
    res.send(err);
  }
});

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const IPAddress = req.socket.remoteAddress;

  bcrypt.hash(password, 8, async function (err, hash) {
    // Store hash in your password DB.
    if (hash) {
      const user = new UserModel({ name, email, password: hash, IPAddress });
      await user.save();
      res.send("user is created");
    } else {
      res.send(err.message);
    }
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  console.log(user);
  const token = jwt.sign(
    { userID: user._id, IPAddress: user.IPAddress },
    "token",
    { expiresIn: 180 }
  );
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      res.send({ msg: "login successful", token: token });
    } else {
      res.send(err.message);
    }
  });
});

userRouter.get("/logout", authentication, async (req, res) => {
  try {
    const token = req.headers?.authorization;
    if (!token) return res.send({ msg: "please login" });
    await client.set("blacklist_token", token, "EX", 30 * 60);
    //console.log(await client.sIsMember("blacklist", token));
    res.send("logout successful");
  } catch (err) {
    res.send({ err: err.message });
  }
});

module.exports = { userRouter };
