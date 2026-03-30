const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.post('/', async (req, res) => {
    const { customer_name, phone_number, email, cake_id, weight, message_on_cake, delivery_date, delivery_time, delivery_option, address, notes } = req.body;
    const db = req.app.get('db');
    try {
        const result = await db.run(
            'INSERT INTO bookings (customer_name, phone_number, email, cake_id, weight, message_on_cake, delivery_date, delivery_time, delivery_option, address, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [customer_name, phone_number, email, cake_id, weight, message_on_cake, delivery_date, delivery_time, delivery_option, address, notes]
        );
        res.json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    const db = req.app.get('db');
    try {
        const bookings = await db.all('SELECT bookings.*, cakes.name as cake_name FROM bookings LEFT JOIN cakes ON bookings.cake_id = cakes.id ORDER BY created_at DESC');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const db = req.app.get('db');
    try {
        await db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
