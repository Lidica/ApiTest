const path = require('path')
const fs = require('fs')
const express = require("express");
const app = express();
var bodyParser = require("body-parser");

const imprintHero = require('./js/imprint')

const supportedLanguages = ['en', 'jp'];
const fallbackLanguage = supportedLanguages[0];


app.use(express.json({limit:'100mb'}));
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

const getJsonFiles = source => {
  try {
    return fs.readdirSync(source, { withFileTypes: true })
      .filter(dirent => !dirent.isDirectory() && /\.json$/i.test(dirent.name))
      .map(dirent => dirent.name)
  } catch(err) {
    return []
  }
}

function getJSON (source) {
  try {
    return JSON.parse(fs.readFileSync(source))
  } catch(err) {
    return null
  }
}


// Build Buffs 
var Buffs = {},
    Debuffs = {},
    Common = {};
[[Buffs, 'buffs'], [Debuffs, 'debuffs'], [Common, 'common']].forEach(type => {
  supportedLanguages.forEach(lang => { type[0][lang] = {} })
  getJsonFiles(path.join(process.cwd(), 'db', type[1])).forEach(buffFile => {
    var data = getJSON(path.join(process.cwd(), 'db', type[1], buffFile))
    var _id = buffFile.replace(/\.json$/i, '')
    if (data)
      supportedLanguages.forEach(lang => {
        type[0][lang][_id] = Object.assign({id: data.id, _id: _id}, data[lang] || data[fallbackLanguage] || {name: 'MISSING BUFF TRANSLATION', description: 'MISSING BUFF TRANSLATION'});
      });
  })
})

var Heroes = {},
    EnhanceData = {};
// getDirectories(path.join(process.cwd(), 'db', 'heroes')).forEach(hero => {
//   var res = {_id: hero};
//   ['index', 'imprint', 'story'].forEach(file => {
//     var result = getJSON(path.join(process.cwd(), 'db', 'heroes', hero, file+'.json'))
//     if (result)
//       Object.assign(res, result);
//   });
  
//   [
//     ['stats', 'stats'],
//     ['ee', 'ex_equip'],
//     ['skills', 'skills'],
//     ['camping', 'camping'],
//     ['specialty_change', 'specialty_change'],
//     ['skin', 'skin']
//   ].forEach(file => {
//     var result = getJSON(path.join(process.cwd(), 'db', 'heroes', hero, file[0]+'.json'))
//     if (result)
//       Object.assign(res, {[file[1]]: result});
//   });

//   // add buffs/debuffs/common
//   res['buffs'] = [],
//   res['debuffs'] = [],
//   res['common'] = [];

//   (res.skills || []).forEach(skill => {
//     ['debuffs', 'buffs', 'common'].forEach(type => {
//       if (!skill[type])
//         return;
//       skill[type].forEach(el => {
//         if (!res[type].includes(el))
//           res[type].push(el)
//       })
//     })
//   });

//   [[Buffs, 'buffs'], [Debuffs, 'debuffs'], [Common, 'common']].forEach(type => {
//     for (var i = 0; i < res[type[1]].length; i++) {
//       var el = res[type[1]][i]
//       if (type[0]['jp'][el]) res[type[1]][i] = type[0]['jp'][el]
//     }
//   })

//   imprintHero(res)

//   Heroes[hero] = res;
// })

JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db', 'enhancements.json'))).forEach(eh => {
  EnhanceData[eh._id] = eh.name
})

JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db', 'heroes.json'))).forEach(hero => {
  hero.name = hero.name?.en || ''
  hero.description = hero.description?.en || ''
  hero.story = hero.story?.en || ''
  hero.get_line = hero.get_line?.en || ''
  hero.skills?.forEach(skill => {
    skill.name = skill.name?.en || ''
    skill.description = skill.description?.en || ''
    if (skill.awakened) {
      skill.awakened.description = skill.awakened.description?.en || ''
      if (!skill.awakened.values || !skill.awakened.values.length) {
        skill.awakened.values = skill.values || []
      }
    }
    if (skill.soul_description) {
      skill.soul_description = skill.soul_description?.en || ''
    }
    skill.enhancements?.forEach(enh => {
      enh.string = EnhanceData[enh.string]?.en || ''
    })
  })
  hero.ex_equip?.forEach(eq => {
    eq.name = eq.name?.en || ''
    eq.description = eq.description?.en || ''
    eq.skills?.forEach(skill => {
      skill.description = skill.description?.en || ''
      skill.skill_description = skill.skill_description?.en || ''
    })
  })
  hero.skin?.forEach(skin => {
    skin.name = skin.name?.en || ''
    skin.description = skin.description?.en || ''
  })

  imprintHero(hero)

  Heroes[hero._id] = hero
})

// var temp = {}
// for (var hero in Heroes) {
//   var d = Heroes[hero];
//   temp[d._id] = {
//     id: d.id,
//     _id: d._id,
//     name: {en: d.name},
//     base_id: null,
//     specialty_id: null,
//     rarity: d.rarity,
//     attribute: d.attribute,
//     role: d.role,
//     zodiac: d.zodiac,
//     sex: d.sex,
//     release_dt: {en: ''},
//     tags: [],
//     get_line: {},
//     story: {},
//     description: {},
//     relationships: {},
//     specialty: {},
//     camping: {},
//     stats: d.stats,
//     devotion: {type: d.devotion.type, slots: d.devotion.slots},
//     self_devotion: {type: d.self_devotion.type},
//     skills: [],
//     ex_equip: [],
//     skin: [],
//     changelog: []
//   }
// }
// fs.writeFileSync( path.join(process.cwd(), 'db', 'heroes.json'), JSON.stringify(temp, 0, 4) )


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


app.get("/fulldata", (req, res) => {
  try {
    res.send({
      heroes: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db', 'heroes.json'))),
      artifacts: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db', 'artifacts.json'))),
      buffs: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db', 'buffs.json'))),
      debuffs: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db', 'debuffs.json'))),
      common: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db', 'common.json'))),
      enhancements: JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db', 'enhancements.json')))
    })
  } catch (err) {
    res.status(200).send(err)
  }
})

app.post("/savedatabase", function(req,res){
  var errors = [];
  [
    ['heroes', 'heroes.json'],
    ['artifacts', 'artifacts.json'],
    ['buffs', 'buffs.json'],
    ['debuffs', 'debuffs.json'],
    ['common', 'common.json'],
    ['enhancements',  'enhancements.json']
  ].forEach(type => {
    if (req.body[type[0]])
      try {
        fs.writeFileSync( path.join(process.cwd(), 'db', type[1]), JSON.stringify(req.body[type[0]], 0, 4) )
      } catch (err) {
        errors.push(type[0])
      }
  })
  res.send(errors)
})


app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
