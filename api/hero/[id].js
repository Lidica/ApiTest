import { readFileSync } from 'fs';
import path from 'path';
import imprint from '../../js/imprint'

export default function handler(req, res) {
    try {
        const { id } = req.query;
        const file = path.join(process.cwd(), 'db', 'heroes.json');
        var hero = JSON.parse(readFileSync(file, 'utf8'));
        for (var i = 0; i < hero.length; i++) {
            if (hero[i]._id === id) {
                hero = hero[i]
                break
            }
        }
        if (hero) {
            JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db', 'enhancements.json'))).forEach(eh => {
                EnhanceData[eh._id] = eh.name
            })
            
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
            
            imprint(hero)

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(hero))
        } else {
            return res.end('{"status": 404, "message": "Not found"}')
        }
    } catch(err) {
        return res.end(err.message)
    }
}