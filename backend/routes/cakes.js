const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
    const db = req.app.get('db');
    const { category_id } = req.query;
    try {
        let query = 'SELECT cakes.*, categories.name as category_name FROM cakes JOIN categories ON cakes.category_id = categories.id';
        const params = [];
        if (category_id) {
            query += ' WHERE category_id = ?';
            params.push(category_id);
        }
        const cakes = await db.all(query, params);
        res.json(cakes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { name, description, price, category_id, image_url, weight_options } = req.body;
    const db = req.app.get('db');
    try {
        const result = await db.run(
            'INSERT INTO cakes (name, description, price, category_id, image_url, weight_options) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, category_id, image_url, weight_options]
        );
        res.json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, weight_options } = req.body;
    const db = req.app.get('db');
    try {
        await db.run(
            'UPDATE cakes SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, weight_options = ? WHERE id = ?',
            [name, description, price, category_id, image_url, weight_options, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const db = req.app.get('db');
    try {
        await db.run('DELETE FROM cakes WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

router.get('/categories', async (req, res) => {
    const db = req.app.get('db');
    try {
        const categories = await db.all('SELECT * FROM categories');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
