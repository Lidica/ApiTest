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

function getJSON (source) {
  try {
    return JSON.parse(fs.readFileSync(source))
  } catch(err) {
    return null
  }
}

const heroes = getDirectories(path.join(process.cwd(), 'db', 'heroes'));

var Heroes = {};
getDirectories(path.join(process.cwd(), 'db', 'heroes')).forEach(hero => {
  var res = {_id: hero};
  ['index', 'imprint', 'story'].forEach(file => {
    var result = getJSON(path.join(process.cwd(), 'db', 'heroes', hero, file+'.json'))
    if (result)
      Object.assign(res, result);
  });
  [['stats', 'stats'], ['ee', 'exclusive_equipment'], ['skills', 'skills'], ['camping', 'camping'], ['speciality_tree', 'speciality_tree']].forEach(file => {
    var result = getJSON(path.join(process.cwd(), 'db', 'heroes', hero, file[0]+'.json'))
    if (result)
      Object.assign(res, {[file[1]]: result});
  })
  
  if (Object.keys(res).length>1)
    Heroes[hero] = res;
})

app.get("/hero", (req, res) => {
  var list = {};
  for (hero in Heroes) {
    var h = Heroes[hero]
    list[hero] = {
      id: h.id,
      _id: hero,
      name: h.name,
      role: h.role,
      attribute: h.attribute,
      zodiac: h.zodiac,
      rarity: h.rarity,
      sex: h.sex || 0
    }
  }
  res.send(list);
})

app.get("/hero/:id", (req, res) => {
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
