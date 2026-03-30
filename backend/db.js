const fs = require('fs/promises');
const path = require('path');

class JsonDB {
    constructor() {
        this.filePath = path.join(__dirname, 'bakery_db.json');
        this.data = {
            admin_users: [],
            categories: [],
            cakes: [],
            bookings: [],
            settings: {}
        };
    }

    async init() {
        try {
            const content = await fs.readFile(this.filePath, 'utf8');
            this.data = JSON.parse(content);
        } catch (err) {
            await this.seed();
        }
        return this;
    }

    async seed() {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('bakery@admin123', 10);
        
        this.data.admin_users = [{ id: 1, username: 'admin', password: hashedPassword }];
        this.data.categories = [
            { id: 1, name: 'Birthday Cakes' },
            { id: 2, name: 'Wedding Cakes' },
            { id: 3, name: 'Anniversary Cakes' },
            { id: 4, name: 'Custom Cakes' },
            { id: 5, name: 'Pastries' }
        ];
        this.data.settings = {
            bakery_name: 'Kochamparambil Coolbar and Bakery',
            phone: '+91 XXXXX XXXXX',
            whatsapp: '+91 XXXXX XXXXX',
            email: 'info@kochamparambilbakery.com',
            address: 'Pooppally Junction, Nedumudy, Alappuzha, Kerala – 688501',
            hours: '8:00 AM - 9:00 PM'
        };
        
        // Sample cakes
        this.data.cakes = [
            { id: 1, name: 'Red Velvet Delight', description: 'Classic red velvet cake with cream cheese frosting.', price: 650, category_id: 1, image_url: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', weight_options: '500g, 1kg, 2kg' },
            { id: 2, name: 'Chocolate Truffle', description: 'Rich dark chocolate cake with ganache layering.', price: 750, category_id: 1, image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', weight_options: '500g, 1kg, 2kg' },
            { id: 3, name: 'Strawberry Dream', description: 'Fresh strawberry cream cake with fruit chunks.', price: 600, category_id: 2, image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', weight_options: '500g, 1kg' }
        ];

        await this.save();
    }

    async save() {
        await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
    }

    // Generic helpers
    get(table, filter) {
        return this.data[table].find(item => Object.entries(filter).every(([k, v]) => item[k] == v));
    }

    all(table, filter = {}) {
        let items = this.data[table];
        if (filter.category_id) {
            items = items.filter(c => c.category_id == filter.category_id);
        }
        // Join category name for cakes
        if (table === 'cakes') {
            return items.map(c => ({
                ...c,
                category_name: this.data.categories.find(cat => cat.id == c.category_id)?.name
            }));
        }
        if (table === 'bookings') {
            return items.map(b => ({
                ...b,
                cake_name: this.data.cakes.find(c => c.id == b.cake_id)?.name
            })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        return items;
    }

    async run(query, params) {
        // Simple implementation for inserts/updates
        // Since we aren't actually parsing SQL, we'll map common operations
        return { lastID: Date.now() }; 
    }

    // Specific methods to mimic sqlite-wrapper API
    async getAsync(table, filter) { return this.get(table, filter); }
    
    async insert(table, item) {
        const id = Date.now();
        const newItem = { id, ...item, created_at: new Date().toISOString() };
        this.data[table].push(newItem);
        await this.save();
        return { lastID: id };
    }

    async update(table, id, updates) {
        const idx = this.data[table].findIndex(item => item.id == id);
        if (idx !== -1) {
            this.data[table][idx] = { ...this.data[table][idx], ...updates };
            await this.save();
        }
    }

    async delete(table, id) {
        this.data[table] = this.data[table].filter(item => item.id != id);
        await this.save();
    }
}

async function initDb() {
    const db = new JsonDB();
    await db.init();
    
    // Mocking the sqlite-wrapper API
    return {
        get: async (q, p) => {
            if (q.includes('admin_users')) return db.get('admin_users', { username: p[0] });
            if (q.includes('cakes')) return { count: db.data.cakes.length };
            return null;
        },
        all: async (q, p) => {
            console.log('Query:', q);
            if (/FROM\s+cakes/i.test(q)) {
                const category_id = p && p.length > 0 ? p[0] : null;
                return db.all('cakes', { category_id });
            }
            if (/FROM\s+categories/i.test(q)) return db.all('categories');
            if (/FROM\s+bookings/i.test(q)) return db.all('bookings');
            if (/FROM\s+settings/i.test(q)) return Object.entries(db.data.settings).map(([key, value]) => ({ key, value }));
            return [];
        },
        run: async (q, p) => {
            if (q.startsWith('INSERT INTO cakes')) {
                return db.insert('cakes', { name: p[0], description: p[1], price: p[2], category_id: p[3], image_url: p[4], weight_options: p[5] });
            }
            if (q.startsWith('UPDATE cakes')) {
                return db.update('cakes', p[6], { name: p[0], description: p[1], price: p[2], category_id: p[3], image_url: p[4], weight_options: p[5] });
            }
            if (q.startsWith('DELETE FROM cakes')) {
                return db.delete('cakes', p[0]);
            }
            if (q.startsWith('INSERT INTO bookings')) {
                return db.insert('bookings', { customer_name: p[0], phone_number: p[1], email: p[2], cake_id: p[3], weight: p[4], message_on_cake: p[5], delivery_date: p[6], delivery_time: p[7], delivery_option: p[8], address: p[9], notes: p[10] });
            }
            if (q.startsWith('UPDATE bookings')) {
                return db.update('bookings', p[1], { status: p[0] });
            }
            if (q.startsWith('INSERT OR REPLACE INTO settings')) {
                db.data.settings[p[0]] = p[1];
                await db.save();
                return {};
            }
            return {};
        }
    };
}

module.exports = { initDb };
