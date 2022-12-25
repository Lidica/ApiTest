const express = require("express");

const app = express();

import { readFileSync } from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'db', 'heroes', 'alencia', 'data.json');
const stringified = readFileSync(file, 'utf8');

var data = {file: stringified, meta: Date.now()}

app.get("/", (req, res) => {
  res.send(data);
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
