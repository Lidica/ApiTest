import HeroDB from '../../js/heroes.js'
import { cors } from '../../js/middleware.js'

export default async function handler(req, res) {
    await cors(req, res)

    const { id } = req.query;
    var hero = HeroDB[id];
    if (hero) {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(hero))
    } else {
        return res.end('{"status": 404, "message": "Not found"}')
    }
}