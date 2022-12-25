const express = require("express");

const app = express();

const fs = require('fs')

import path from 'path';

const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const heroes = getDirectories(path.join(process.cwd(), 'db', 'heroes'));

var Heroes = getDirectories(path.join(process.cwd(), 'db', 'heroes')).map(hero => {
  var res = {};
  ['data', 'imprint', 'camping', 'skills', 'story'].forEach(file => {
    var fPath = path.join(process.cwd(), 'db', 'heroes', hero, file+'.json')
    if (fs.existsSync(fPath) {
      var r = fs.readFileSync(fPath)
      Object.assign(res, JSON.parse(r))
    }
  })
  return res
})

app.get("/", (req, res) => {
  res.send(Heroes);
})

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
