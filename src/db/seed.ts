import { db } from './index.ts';
import { roles, roomCategories, rooms, services, gallery, users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    console.log('Checking database state for seeding...');

    // 1. Seed Roles
    const existingRoles = await db.select().from(roles);
    if (existingRoles.length === 0) {
      console.log('Seeding roles...');
      await db.insert(roles).values([
        {
          name: 'super_admin',
          permissions: JSON.stringify(['all_access']),
        },
        {
          name: 'hotel_manager',
          permissions: JSON.stringify(['manage_rooms', 'manage_bookings', 'manage_payments', 'view_customers', 'manage_cms']),
        },
        {
          name: 'receptionist',
          permissions: JSON.stringify(['view_rooms', 'manage_bookings', 'view_customers']),
        },
        {
          name: 'accountant',
          permissions: JSON.stringify(['view_payments', 'verify_payments', 'generate_invoices']),
        },
        {
          name: 'customer',
          permissions: JSON.stringify(['view_rooms', 'book_room', 'manage_own_bookings']),
        },
      ]);
    }

    // 2. Seed Room Categories
    const existingCategories = await db.select().from(roomCategories);
    if (existingCategories.length === 0) {
      console.log('Seeding room categories...');
      await db.insert(roomCategories).values([
        {
          name: 'Deluxe Ocean Suite',
          description: 'A masterpiece of contemporary coastal elegance. Features private oceanfront balcony, plush king bed, freestanding soaking tub, state-of-the-art media console, and fully equipped wet bar.',
          basePrice: 45000, // $450.00
          capacity: 2,
          amenities: JSON.stringify(['Private Balcony', 'Ocean View', 'Freestanding Tub', 'King Bed', 'In-room Bar', 'High-Speed Wi-Fi', 'Nespresso Machine']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
          ]),
          seasonalPricing: JSON.stringify({
            summer: { rate: 52000, label: 'Summer Peak (Jun - Aug)' },
            winter: { rate: 39000, label: 'Winter Cosy (Dec - Feb)' }
          }),
        },
        {
          name: 'Executive Penthouse',
          description: 'Perched on our highest levels, this penthouse offers 360-degree skyline and sea views. Features dynamic double-height ceilings, a sprawling dining terrace, fully stocked wine cellar, and dedicated butler service.',
          basePrice: 120000, // $1,200.00
          capacity: 4,
          amenities: JSON.stringify(['360 Panoramic Views', 'Private Sprawling Terrace', 'Butler Service', 'Wine Cellar', 'Walk-in Closet', 'Home Theatre', 'Chef Kitchen']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'
          ]),
          seasonalPricing: JSON.stringify({
            summer: { rate: 145000, label: 'Summer Peak (Jun - Aug)' },
            winter: { rate: 110000, label: 'Winter Peak (Dec - Feb)' }
          }),
        },
        {
          name: 'Royal Garden Villa',
          description: 'A secluded sanctuary surrounded by lush tropical flora and flowing waterways. Boasts an infinity-edge plunge pool, open-air sun salon, private massage pavilion, and personalized 24/7 concierge.',
          basePrice: 85000, // $850.00
          capacity: 4,
          amenities: JSON.stringify(['Infinity Plunge Pool', 'Private Garden Sanctuary', 'Massage Pavilion', '24/7 Concierge', 'Outdoor Rain Shower', 'In-villa Dining', 'Espresso Station']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
          ]),
          seasonalPricing: JSON.stringify({
            summer: { rate: 98000, label: 'Summer Peak (Jun - Aug)' },
            winter: { rate: 80000, label: 'Winter Cosy (Dec - Feb)' }
          }),
        },
        {
          name: 'Classic Heritage Room',
          description: 'Sophisticated traditional style combined with absolute comfort. Features premium courtyard views, working marble fireplace, premium Egyptian cotton sheets, and elegant writing desk.',
          basePrice: 25000, // $250.00
          capacity: 2,
          amenities: JSON.stringify(['Courtyard View', 'Egyptian Cotton Sheets', 'Marble Fireplace', 'Writing Desk', 'Premium Toiletries', 'Wi-Fi', 'Mini Fridge']),
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1611891405214-f9c16798e3b0?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
          ]),
          seasonalPricing: JSON.stringify({
            summer: { rate: 29000, label: 'Summer Peak (Jun - Aug)' },
            winter: { rate: 22000, label: 'Winter Cosy (Dec - Feb)' }
          }),
        },
      ]);
    }

    // 3. Seed Rooms
    const existingRooms = await db.select().from(rooms);
    if (existingRooms.length === 0) {
      console.log('Seeding rooms...');
      // Fetch seeded categories to map IDs
      const categoriesList = await db.select().from(roomCategories);
      const deluxId = categoriesList.find(c => c.name === 'Deluxe Ocean Suite')?.id || 1;
      const penthouseId = categoriesList.find(c => c.name === 'Executive Penthouse')?.id || 2;
      const villaId = categoriesList.find(c => c.name === 'Royal Garden Villa')?.id || 3;
      const classicId = categoriesList.find(c => c.name === 'Classic Heritage Room')?.id || 4;

      await db.insert(rooms).values([
        // Deluxe Ocean Suites (Floor 3 & 4)
        { roomNumber: '301', categoryId: deluxId, status: 'available', floor: 'Third Floor' },
        { roomNumber: '302', categoryId: deluxId, status: 'available', floor: 'Third Floor' },
        { roomNumber: '401', categoryId: deluxId, status: 'available', floor: 'Fourth Floor' },
        { roomNumber: '402', categoryId: deluxId, status: 'available', floor: 'Fourth Floor' },
        
        // Penthouses (Floor 8 - top)
        { roomNumber: '801', categoryId: penthouseId, status: 'available', floor: 'Penthouse Floor' },
        { roomNumber: '802', categoryId: penthouseId, status: 'available', floor: 'Penthouse Floor' },
        
        // Villas (Ground Level)
        { roomNumber: 'G01', categoryId: villaId, status: 'available', floor: 'Ground Villa Estate' },
        { roomNumber: 'G02', categoryId: villaId, status: 'available', floor: 'Ground Villa Estate' },
        
        // Classic Heritage (Floor 1 & 2)
        { roomNumber: '101', categoryId: classicId, status: 'available', floor: 'First Floor' },
        { roomNumber: '102', categoryId: classicId, status: 'available', floor: 'First Floor' },
        { roomNumber: '201', categoryId: classicId, status: 'available', floor: 'Second Floor' },
        { roomNumber: '202', categoryId: classicId, status: 'available', floor: 'Second Floor' },
      ]);
    }

    // 4. Seed Services
    const existingServices = await db.select().from(services);
    if (existingServices.length === 0) {
      console.log('Seeding services...');
      await db.insert(services).values([
        {
          name: 'The Gilded Orchid Restaurant',
          description: 'Michelin-starred fine dining showcasing local heritage ingredients with modern culinary arts. Open for lunch and dinner.',
          price: 15000, // Average tasting menu $150.00
          icon: 'Utensils',
          category: 'dining',
        },
        {
          name: 'The Astral Sky Bar',
          description: 'A rooftop escape offering artisan custom cocktails, select vintage wines, and acoustic live jazz under the starry night.',
          price: 2500, // Cocktails average $25.00
          icon: 'Wine',
          category: 'dining',
        },
        {
          name: 'Ananda Botanical Spa',
          description: 'Revitalizing full-body therapies, hydrotherapy pools, and custom botanical facials. The ultimate wellness refuge.',
          price: 18000, // Treatment average $180.00
          icon: 'HeartPulse',
          category: 'wellness',
        },
        {
          name: 'Valet & Express Laundry',
          description: 'Delicate care, dry cleaning, and hand-pressed finishing returned to your wardrobe within 6 hours.',
          price: 3500, // Standard bundle $35.00
          icon: 'Shirt',
          category: 'utilities',
        },
        {
          name: 'The Sovereign Event Hall',
          description: 'A majestic ballroom with custom chandelier ceilings, state-of-the-art acoustics, and sweeping ocean views for weddings and summits.',
          price: 500000, // Daily booking fee $5,000.00
          icon: 'Calendar',
          category: 'events',
        },
      ]);
    }

    // 5. Seed Gallery
    const existingGallery = await db.select().from(gallery);
    if (existingGallery.length === 0) {
      console.log('Seeding gallery...');
      await db.insert(gallery).values([
        { title: 'Hotel Exterior Sunset', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', type: 'photo', category: 'exterior' },
        { title: 'The Gilded Orchid Dining Room', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', type: 'photo', category: 'restaurant' },
        { title: 'Rooftop Infinity Edge Pool', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80', type: 'photo', category: 'exterior' },
        { title: 'Ananda Spa Serenity Lounge', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', type: 'photo', category: 'spa' },
        { title: 'Deluxe Ocean Suite Master Bed', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', type: 'photo', category: 'rooms' },
        { title: 'Astral sky lounge custom cocktail', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80', type: 'photo', category: 'restaurant' },
      ]);
    }

    // 6. Ensure Super Admin Account Pre-seeded if we want to log in as admin
    // Let's create a placeholder admin account in database so we can log in and test.
    // uid of local admin or the user email (will match users signed in via the workspace!)
    console.log('Database check completed. Seeding finished.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}
