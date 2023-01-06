var values = {
    dev: {
        "max_hp_g3_s4": 120,
        "att_g3_s4": 24,
        "def_g3_s4": 12,
        "def_rate_g4_s4": .024,
        "def_rate_g5_s4": .036,
        "def_rate_g5_s2": .043,
        "att_rate_g4_s2": .029,
        "att_rate_g4_s4": .024,
        "att_rate_g5_s2": .043,
        "att_rate_g5_s4": .036,
        "cri_g4_s2": .043,
        "cri_g4_s4": .036,
        "cri_g5_s4": .048,
        "speed_g5_s4": 4,
        "speed_g4_s4": 3,
        "speed_g4_s2": 4,
        "speed_g3_s4": 2,
        "max_def_rate_g4_s2": .029,
        "max_hp_rate_g4_s4": .024,
        "max_hp_rate_g4_s2": .029,
        "max_hp_rate_g5_s4": .036,
        "max_hp_rate_g5_s2": .043,
        "acc_g4_s2": .043,
        "acc_g4_s4": .036,
        "acc_g5_s4": .048,
        "res_g4_s2": .043,
        "res_g4_s4": .036,
        "res_g5_s4": .048,
        "coop_g4_s4": .007,
        "coop_g5_s2": .009
    },
    self: {
        "max_hp_g3": 180,
        "att_g3": 36,
        "def_g3": 18,
        "res_g3": .045,
        "max_hp_rate_g5": .06,
        "max_hp_rate_g4": .04,
        "def_rate_g4": 0.04,
        "def_rate_g5": .06,
        "att_rate_g4": .04,
        "att_rate_g5": .06,
        "cri_g3": .028,
        "cri_g4": .042,
        "cri_g5": .056,
        "res_g4": .068,
        "res_g5": .09,
        "acc_g5": .09,
        "acc_g4": .068,
        "acc_g3": .045,
        "coop_g3": .009,
        "coop_g4": .014,
        "coop_g5": .02
    }
}

exports.set = function(hero) {
    var devotionRanks = ["Z", "D", "C", "B", "A", "S", "SS", "SSS"];
    devotionRanks.splice(0, (hero.rarity || 5) - 2);

    var value;

    hero.devotion && (value=values.dev[hero.devotion?.type+'_g'+hero.rarity+'_s'+hero.devotion.slots].filter(x=>x).length) && (hero.devotion.grades = {}) && devotionRanks.forEach((r, i) => {
        hero.devotion.grades[r] = value + i * (value / 2)
    })
    hero.self_devotion && (value=values.self[hero.self_devotion?.type+'_g'+hero.rarity].filter(x=>x).length) && (hero.self_devotion.grades = {}) && devotionRanks.forEach((r, i) => {
        hero.self_devotion.grades[r] = value + i * (value / 2)
    })
}