const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_here';

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get('db'); // this is the supabase client now

    try {
        const { data: users, error } = await db
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .limit(1);

        if (error) throw error;
        const user = users && users.length > 0 ? users[0] : null;

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
            res.json({ token, user: { username: user.username } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

