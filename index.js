const express = require("express");

const app = express();

const fs = require('fs')

const path = require('path')

const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const heroes = getDirectories(path.join(process.cwd(), 'db', 'heroes'));

var Heroes = {};
getDirectories(path.join(process.cwd(), 'db', 'heroes')).forEach(hero => {
  var res = {_id: hero};
  ['main', 'imprint', 'camping', 'skills', 'story', 'ee', 'modifiers'].forEach(file => {
    try {
      var fPath = JSON.parse(path.join(process.cwd(), 'db', 'heroes', hero, file+'.json'))
      var r = fs.readFileSync(fPath)
      Object.assign(res[hero], r)
    } catch(err) {
      //
    }
  })
  Heroes[hero] = res;
})

app.get("/heroes", (req, res) => {
  res.send(Heroes);
})

app.get("/heroes/:id", (req, res) => {
  var data = Heroes[req.params.id];
  if (data) {
    res.send(data)
  } else {
    res.status(404).send()
  }
})

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
