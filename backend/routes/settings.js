const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/', async (req, res) => {
    const db = req.app.get('db');
    try {
        const { data: settings, error } = await db.from('settings').select('*');
        if (error) throw error;

        const settingsMap = {};
        if (settings) {
            settings.forEach(s => settingsMap[s.key] = s.value);
        }
        res.json(settingsMap);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', authenticateToken, async (req, res) => {
    const settings = req.body;
    const db = req.app.get('db');
    try {
        const upserts = Object.entries(settings).map(([key, value]) => ({ key, value }));
        
        const { error } = await db.from('settings').upsert(upserts, { onConflict: 'key' });
        if (error) throw error;
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

