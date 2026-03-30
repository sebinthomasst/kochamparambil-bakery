const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/', async (req, res) => {
    const db = req.app.get('db');
    try {
        const settings = await db.all('SELECT * FROM settings');
        const settingsMap = {};
        settings.forEach(s => settingsMap[s.key] = s.value);
        res.json(settingsMap);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', authenticateToken, async (req, res) => {
    const settings = req.body;
    const db = req.app.get('db');
    try {
        for (const [key, value] of Object.entries(settings)) {
            await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
