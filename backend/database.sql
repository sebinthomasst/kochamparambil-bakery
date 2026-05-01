-- Run this script in your Supabase SQL Editor

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- 2. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- 3. Create cakes table
CREATE TABLE IF NOT EXISTS public.cakes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    weight_options TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id SERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    cake_id INTEGER REFERENCES public.cakes(id) ON DELETE SET NULL,
    weight TEXT,
    message_on_cake TEXT,
    delivery_date DATE,
    delivery_time TEXT,
    delivery_option TEXT,
    address TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- 6. Insert default settings
INSERT INTO public.settings (key, value) VALUES
    ('bakery_name', 'Kochamparambil Bakery and Cakes'),
    ('phone', '+91 XXXXX XXXXX'),
    ('whatsapp', '+91 XXXXX XXXXX'),
    ('instagram', 'https://instagram.com/yourbakery'),
    ('email', 'info@kochamparambilbakery.com'),
    ('address', 'Pooppally Junction, Nedumudy, Alappuzha, Kerala – 688501'),
    ('hours', '8:00 AM - 9:00 PM')
ON CONFLICT (key) DO NOTHING;

-- 7. Insert default admin user (Password: bakery@admin123)
INSERT INTO public.admin_users (username, password) VALUES
    ('admin', '$2b$10$9.psAMSVDPlhzlITjPTwBueo.KSC7MH/rdYx0AINluj5y8LdWXrj2')
ON CONFLICT (username) DO NOTHING;

-- 8. Insert default categories
INSERT INTO public.categories (name) VALUES
    ('Birthday Cakes'),
    ('Wedding Cakes'),
    ('Anniversary Cakes'),
    ('Custom Cakes'),
    ('Pastries')
ON CONFLICT DO NOTHING;
