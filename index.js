const path = require('path')
const fs = require('fs')
const express = require("express");
const app = express();
const supportedLanguages = ['en'];
const fallbackLanguage = supportedLanguages[0];

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next()
})

const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const getJsonFiles = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => !dirent.isDirectory() && /\.json$/i.test(dirent.name))
    .map(dirent => dirent.name)

function getJSON (source) {
  try {
    return JSON.parse(fs.readFileSync(source))
  } catch(err) {
    return null
  }
}


// Build Buffs 
var Buffs = {}
supportedLanguages.forEach(lang => {
  Buffs[lang] = {}
  getJsonFiles(path.join(process.cwd(), 'db', 'buffs')).forEach(buffFile => {
    var buff = getJSON(path.join(process.cwd(), 'db', 'buffs', buffFile))
    if (buff) {
      Buffs[lang][buffFile.replace(/\.json$/i, '')] = Object.assign({id: buff.id}, buff[lang] || buff[fallbackLanguage] || {name: 'MISSING BUFF TRANSLATION', description: 'MISSING BUFF TRANSLATION'});
    }
  })
})

var Heroes = {};
getDirectories(path.join(process.cwd(), 'db', 'heroes')).forEach(hero => {
  var res = {_id: hero};
  ['index', 'imprint', 'story'].forEach(file => {
    var result = getJSON(path.join(process.cwd(), 'db', 'heroes', hero, file+'.json'))
    if (result)
      Object.assign(res, result);
  });
  [['stats', 'stats'], ['ee', 'exclusive_equipment'], ['skills', 'skills'], ['camping', 'camping'], ['specialty_change', 'specialty_change']].forEach(file => {
    var result = getJSON(path.join(process.cwd(), 'db', 'heroes', hero, file[0]+'.json'))
    if (result)
      Object.assign(res, {[file[1]]: result});
  })

  // add buffs/debuffs/common
  res['buffs'] = ['attack_buff'],
  res['debuffs'] = [],
  res['common'] = [];

  (res.skills || []).forEach(skill => {
    ['debuffs', 'buffs', 'common'].forEach(type => {
      if (!skill[type])
        return;
      skill[type].forEach(el => {
        if (!res[type].includes(el))
          res[type].push(el)
      })
    })
  })

  for (var i = 0; i < res.buffs.length; i++) {
    if (Buffs[fallbackLanguage][res.buffs[i]]) res.buffs[i] = Buffs[fallbackLanguage][res.buffs[i]]
  }
  
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
