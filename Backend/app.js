const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const authMiddleware = require("./middleware/auth.middleware");
const applicationRoutes = require("./Routes/application.routes");
const authRoutes = require("./Routes/auth.routes");


const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/applications", applicationRoutes);

app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});
module.exports = app;