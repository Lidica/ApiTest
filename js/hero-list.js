import Heroes from './heroes.js'

var list = {};
for (var hero in Heroes) {
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

export default list