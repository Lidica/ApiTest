import HeroList from '../../js/hero/hero-list.js'
import { cors } from '../../js/middleware.js'

export default async function handler(req, res) {
    await cors(req, res);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(HeroList));
}