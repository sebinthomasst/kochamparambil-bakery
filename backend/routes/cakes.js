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
        let query = db.from('cakes').select('*, categories(name)');
        
        if (category_id) {
            query = query.eq('category_id', category_id);
        }
        
        const { data: cakes, error } = await query;
        if (error) throw error;
        
        // Map the categories(name) to category_name to match previous API
        const formattedCakes = cakes ? cakes.map(c => ({
            ...c,
            category_name: c.categories ? c.categories.name : null,
            categories: undefined
        })) : [];

        res.json(formattedCakes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { name, description, price, category_id, image_url, weight_options } = req.body;
    const db = req.app.get('db');
    try {
        const { data, error } = await db
            .from('cakes')
            .insert([{ name, description, price, category_id, image_url, weight_options }])
            .select();
            
        if (error) throw error;
        res.json({ id: data[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, weight_options } = req.body;
    const db = req.app.get('db');
    try {
        const { error } = await db
            .from('cakes')
            .update({ name, description, price, category_id, image_url, weight_options })
            .eq('id', id);
            
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const db = req.app.get('db');
    try {
        const { error } = await db.from('cakes').delete().eq('id', id);
        if (error) throw error;
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
        const { data: categories, error } = await db.from('categories').select('*');
        if (error) throw error;
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
