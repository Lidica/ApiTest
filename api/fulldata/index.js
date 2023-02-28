import { readFileSync } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    await cors(req, res)
    try {
        res.setHeader('Content-Type', 'application/json');
        res.json({
            heroes: JSON.parse(readFileSync(path.join(process.cwd(), 'db', 'heroes.json'))),
            artifacts: JSON.parse(readFileSync(path.join(process.cwd(), 'db', 'artifacts.json'))),
            buffs: JSON.parse(readFileSync(path.join(process.cwd(), 'db', 'buffs.json'))),
            debuffs: JSON.parse(readFileSync(path.join(process.cwd(), 'db', 'debuffs.json'))),
            common: JSON.parse(readFileSync(path.join(process.cwd(), 'db', 'common.json'))),
            enhancements: JSON.parse(readFileSync(path.join(process.cwd(), 'db', 'enhancements.json')))
        })
    } catch (err) {
        return res.status(200).end("\"code\": 400, \"message\": "+err.message)
    }
}