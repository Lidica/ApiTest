const express = require("express");

const app = express();

import { readdirSync, readFileSync } from 'fs';

import path from 'path';

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const heroes = getDirectories(path.join(process.cwd(), 'db', 'heroes'));

var data = {dir: heroes, meta: Date.now()}

app.get("/", (req, res) => {
  res.send(data);
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
