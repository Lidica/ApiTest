import HeroList from '../../js/hero-list.js'
import { cors } from '../../js/middleware.js'

export default function handler(req, res) {
    cors(req, res);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(HeroList));
}