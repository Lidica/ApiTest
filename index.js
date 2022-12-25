const express = require("express");

const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  next()
})

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
  ['main', 'imprint', 'camping', 'skills', 'story'].forEach(file => {
    try {
      var fPath = path.join(process.cwd(), 'db', 'heroes', hero, file+'.json')
      var r = fs.readFileSync(fPath)
      Object.assign(res, JSON.parse(r))
    } catch(err) {
      //
    }
    try { // read exlcusive equipment
      var fPath = path.join(process.cwd(), 'db', 'heroes', hero, 'ee.json')
      var r = fs.readFileSync(fPath)
      Object.assign(res, {exclusive_equipment: JSON.parse(r)})
    } catch(err) {}
  })
  if (Object.keys(res).length>1)
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
