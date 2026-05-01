const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

async function sendTelegramNotification(bookingData, db) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) {
        console.log('Telegram bot token or chat ID not set, skipping notification.');
        return;
    }

    try {
        let cakeName = 'Unknown Cake';
        if (bookingData.cake_id) {
            const { data } = await db.from('cakes').select('name').eq('id', bookingData.cake_id).single();
            if (data) cakeName = data.name;
        }

        const message = `
🎂 *New Bakery Order!* 🎂

*Customer:* ${bookingData.customer_name}
*Phone:* ${bookingData.phone_number}
*Cake:* ${cakeName} (${bookingData.weight})
*Delivery Date:* ${bookingData.delivery_date}
*Option:* ${bookingData.delivery_option}
*Message on Cake:* ${bookingData.message_on_cake || 'None'}
*Notes:* ${bookingData.notes || 'None'}
`;

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
    } catch (err) {
        console.error('Failed to send Telegram notification:', err);
    }
}

router.post('/', async (req, res) => {
    const { customer_name, phone_number, email, cake_id, weight, message_on_cake, delivery_date, delivery_time, delivery_option, address, notes } = req.body;
    const db = req.app.get('db');
    try {
        const payload = { customer_name, phone_number, email, cake_id, weight, message_on_cake, delivery_date, delivery_time, delivery_option, address, notes };
        const { data, error } = await db
            .from('bookings')
            .insert([payload])
            .select();
            
        if (error) throw error;
        
        // Send notification asynchronously
        sendTelegramNotification(payload, db);
        
        res.json({ id: data[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    const db = req.app.get('db');
    try {
        const { data: bookings, error } = await db
            .from('bookings')
            .select('*, cakes(name)')
            .order('created_at', { ascending: false });
            
        if (error) throw error;

        // Format to match previous API response
        const formattedBookings = bookings ? bookings.map(b => ({
            ...b,
            cake_name: b.cakes ? b.cakes.name : null,
            cakes: undefined
        })) : [];

        res.json(formattedBookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const db = req.app.get('db');
    try {
        const { error } = await db.from('bookings').update({ status }).eq('id', id);
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

