const express = require("express");
const cors = require("cors");
const recordsRoutes = require("./routes/records.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/records", recordsRoutes);

module.exports = app;
