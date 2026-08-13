require("dotenv").config();

const express = require("express");
const cors = require("cors");
require("./database/database");

const plantRoutes = require("./routes/plantRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Plant Tracker API" });
});

app.use("/api/plants", plantRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Plant Tracker API running on port ${PORT}`);
});
