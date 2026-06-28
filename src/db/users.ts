import { db } from './index.ts';
import { users, roles } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name: string) {
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
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Failed to synchronize user profile with database.', { cause: error });
  }
}
