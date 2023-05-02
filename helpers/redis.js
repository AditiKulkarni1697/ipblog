const Redis = require("ioredis");
require("dotenv").config();

let configuration = {
  host: "redis-14834.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  port: 14834,
  username: "default",
  password: process.env.redis_password,
};

const client = new Redis(configuration);

//if (client) console.log("redis is running", client);

module.exports = { client };
