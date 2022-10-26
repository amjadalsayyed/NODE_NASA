const { parse } = require("csv-parse");
const planets = require("./planets.mongo");
const fs = require("fs");
const path = require("path");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
function loadPlanetsData() {
  const keplerFilePath = "../data/kepler_data.csv";
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, keplerFilePath))
      .pipe(parse({ columns: true, comment: "#" }))
      .on("data", async (dataItem) => {
        if (isHabitablePlanet(dataItem)) {
          savePlanet(dataItem);
        }
      })
      .on("error", (err) => {
        console.error(err);
        reject();
      })
      .on("end", async () => {
        const countplanetsFound = (await getALLPlanets()).length;
        console.log(`${countplanetsFound} has been found`);
        resolve();
      });
  });
}

async function getALLPlanets() {
  return await planets.find({});
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`could not save planet ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getALLPlanets,
};
