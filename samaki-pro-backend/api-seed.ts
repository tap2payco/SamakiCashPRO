const API_URL = 'http://localhost:3000';

async function seed() {
    console.log('🌱 Seeding via API...');

    // 1. Register User
    console.log('Creating Farmer...');
    const farmerRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fullName: 'Juma K (API Seed)',
            phone: '+255755123456',
            password: 'password123',
            role: 'FARMER'
        })
    });

    let farmerData;
    if (farmerRes.ok) {
        const body = await farmerRes.json();
        farmerData = body.profile || body; // Handle structure
        console.log('✅ Farmer created:', farmerData.id);
    } else {
        // Build login fallback if already exists
        console.log('⚠️ Farmer might exist, trying login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: '+255755123456',
                password: 'password123'
            })
        });
        if (!loginRes.ok) {
            console.error('❌ Login failed:', await loginRes.text());
            process.exit(1);
        }
        const body = await loginRes.json();
        farmerData = body.profile;
        console.log('✅ Logged in as:', farmerData.id);
    }

    // 2. Create Listings
    const listings = [
        {
            title: 'Fresh Tilapia (Sato) - API Seed',
            description: 'Premium quality Tilapia harvested this morning.',
            price: 12000,
            quantity: 50,
            unit: 'kg',
            sellerId: farmerData.id
        },
        {
            title: 'Nile Perch (Sangara)',
            description: 'Large Nile Perch from Mwanza.',
            price: 18000,
            quantity: 100,
            unit: 'kg',
            sellerId: farmerData.id
        }
    ];

    for (const l of listings) {
        const res = await fetch(`${API_URL}/marketplace/listings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(l)
        });

        if (res.ok) {
            const data = await res.json();
            console.log(`📦 Created listing: ${data.title}`);
        } else {
            console.error('❌ Failed to create listing:', await res.text());
        }
    }

    console.log('✅ API Seeding Complete');
}

seed();
