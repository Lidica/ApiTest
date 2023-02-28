import HeroList from '../../js/hero-list.js'

export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(HeroList));
}