import { db } from './index.ts';
import { users, roles } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name: string, retries = 3): Promise<any> {
  try {
    // 1. Check if user already exists (performance-friendly)
    const existing = await db.select().from(users).where(eq(users.uid, uid));
    if (existing.length > 0) {
      return existing[0];
    }

    // 2. Fetch the 'customer' role
    const customerRole = await db.select().from(roles).where(eq(roles.name, 'customer'));
    let roleId = 1; // Fallback
    if (customerRole.length > 0) {
      roleId = customerRole[0].id;
    } else {
      // If roles aren't seeded yet, let's insert 'customer' role
      const newRole = await db.insert(roles).values({
        name: 'customer',
        permissions: JSON.stringify(['view_rooms', 'book_room', 'manage_own_bookings']),
      }).returning();
      roleId = newRole[0].id;
    }

    // 3. Insert new user
    const result = await db.insert(users)
      .values({
        uid,
        email,
        name: name || email.split('@')[0],
        roleId,
        disabled: false,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          name: name || email.split('@')[0],
        },
      })
      .returning();

    return result[0];
  } catch (error: any) {
    console.error('Error in getOrCreateUser:', error.message);
    if (retries > 0 && (error.message.includes('Connection terminated') || error.message.includes('server closed the connection'))) {
      console.log(`Retrying getOrCreateUser... (${retries} attempts left)`);
      // Wait a short delay before retrying to allow the database connection to re-establish
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getOrCreateUser(uid, email, name, retries - 1);
    }
    throw new Error('Failed to synchronize user profile with database.', { cause: error });
  }
}

