const express = require("express");
const fs = require("fs")

const app = express();

var data = {file: fs.readFileSync('./db/heroes/alencia/data.json'), meta: Date.now()}

app.get("/", (req, res) => {
  res.send(data);
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;