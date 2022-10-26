const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const MOGO_URL = process.env.MONGODB_URL;

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDb connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MOGO_URL);
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}..`);
  });
}

startServer();
