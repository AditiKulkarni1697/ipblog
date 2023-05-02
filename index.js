const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { apiRouter } = require("./routes/api.routes");
const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(9090, async () => {
  try {
    await connection;
    console.log("DB is connected to server");
  } catch (err) {
    console.log({ msg: err.message });
  }
  console.log("Server is running at port 9090");
});
