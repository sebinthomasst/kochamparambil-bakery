const API_BASE_URL = 'http://localhost:5000/api';

export async function getCakes(categoryId?: number) {
    const url = categoryId ? `${API_BASE_URL}/cakes?category_id=${categoryId}` : `${API_BASE_URL}/cakes`;
    const res = await fetch(url, { cache: 'no-store' });
    return res.json();
}

export async function getCategories() {
    const res = await fetch(`${API_BASE_URL}/cakes/categories`, { cache: 'no-store' });
    return res.json();
}

export async function getSettings() {
    const res = await fetch(`${API_BASE_URL}/settings`, { cache: 'no-store' });
    return res.json();
}

export async function submitBooking(bookingData: any) {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    return res.json();
}

// Admin Functions
export async function adminLogin(credentials: any) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    return res.json();
}

const getAdminHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('adminToken') || ''
});

export async function getAdminBookings() {
    const res = await fetch(`${API_BASE_URL}/bookings`, { headers: getAdminHeaders() });
    return res.json();
}

export async function updateBookingStatus(id: number, status: string) {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status })
    });
    return res.json();
}

export async function saveCake(cakeData: any, id?: number) {
    const url = id ? `${API_BASE_URL}/cakes/${id}` : `${API_BASE_URL}/cakes`;
    const res = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(cakeData)
    });
    return res.json();
}

export async function deleteCake(id: number) {
    const res = await fetch(`${API_BASE_URL}/cakes/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
    });
    return res.json();
}

export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/cakes/upload`, {
        method: 'POST',
        headers: { 'Authorization': localStorage.getItem('adminToken') || '' },
        body: formData
    });
    return res.json();
}

export async function updateSettings(settings: any) {
    const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(settings)
    });
    return res.json();
}
