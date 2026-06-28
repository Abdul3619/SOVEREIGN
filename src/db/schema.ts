import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// 1. Roles Table
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(), // e.g., 'super_admin', 'hotel_manager', 'receptionist', 'accountant', 'customer'
  permissions: text('permissions').notNull(), // JSON string representing array of permissions
});

// 2. Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  roleId: integer('role_id').references(() => roles.id).notNull(),
  disabled: boolean('disabled').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Room Categories Table
export const roomCategories = pgTable('room_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(), // e.g., 'Deluxe Suite', 'Executive Penthouse', 'Royal Villa'
  description: text('description').notNull(),
  basePrice: integer('base_price').notNull(), // price in USD cents or cents-equivalent
  capacity: integer('capacity').notNull(), // maximum guests
  amenities: text('amenities').notNull(), // JSON string array e.g., '["WiFi", "Ocean View", "Private Pool", "Mini Bar"]'
  images: text('images').notNull(), // JSON string array of image URLs
  seasonalPricing: text('seasonal_pricing').default('{}').notNull(), // JSON string of seasonal pricing data
});

// 4. Rooms Table
export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  roomNumber: text('room_number').notNull().unique(),
  categoryId: integer('category_id').references(() => roomCategories.id).notNull(),
  status: text('status').default('available').notNull(), // e.g., 'available', 'occupied', 'maintenance'
  floor: text('floor').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Bookings Table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  roomId: integer('room_id').references(() => rooms.id).notNull(),
  checkIn: text('check_in').notNull(), // 'YYYY-MM-DD'
  checkOut: text('check_out').notNull(), // 'YYYY-MM-DD'
  guestsCount: integer('guests_count').notNull(),
  totalPrice: integer('total_price').notNull(), // overall price in cents
  status: text('status').default('pending').notNull(), // 'pending', 'approved', 'rejected', 'cancelled'
  specialRequests: text('special_requests'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Services Table
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., Restaurant, Bar, Laundry, Event Hall, Spa, Gym, Room Service
  description: text('description').notNull(),
  price: integer('price').notNull(), // price in cents (0 if free/included)
  icon: text('icon').notNull(), // Lucide icon name e.g., 'Utensils', 'Wine', 'Activity'
  category: text('category').notNull(), // e.g., 'dining', 'wellness', 'utilities'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Payments Table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').references(() => bookings.id).notNull(),
  amount: integer('amount').notNull(), // amount in cents
  paymentMethod: text('payment_method').notNull(), // e.g., 'Bank Transfer', 'Credit Card', 'Crypto'
  status: text('status').default('pending').notNull(), // 'pending', 'verified', 'rejected'
  receiptUrl: text('receipt_url').notNull(), // URL or dataURI of uploaded receipt
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  verifiedAt: timestamp('verified_at'),
});

// 8. Invoices Table
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').references(() => bookings.id).notNull(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  amount: integer('amount').notNull(),
  status: text('status').default('unpaid').notNull(), // 'unpaid', 'paid'
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
  dueDate: timestamp('due_date').notNull(),
});

// 9. Notifications Table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // 'email', 'whatsapp', 'system'
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10. Gallery Table
export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(), // 'photo', 'video'
  category: text('category').notNull(), // e.g., 'rooms', 'restaurant', 'spa', 'exterior'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. Contact Messages Table
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('pending').notNull(), // 'pending', 'read', 'replied'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 12. Staff Table
export const staff = pgTable('staff', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  department: text('department').notNull(), // e.g., 'Management', 'Front Desk', 'Housekeeping', 'F&B'
  shift: text('shift').notNull(), // e.g., 'Day', 'Night', 'Swing'
  salary: integer('salary').notNull(), // salary in cents per month
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// RELATIONS DEFINITIONS

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  bookings: many(bookings),
  notifications: many(notifications),
  staff: one(staff, {
    fields: [users.id],
    references: [staff.userId],
  }),
}));

export const roomCategoriesRelations = relations(roomCategories, ({ many }) => ({
  rooms: many(rooms),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  category: one(roomCategories, {
    fields: [rooms.categoryId],
    references: [roomCategories.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [bookings.roomId],
    references: [rooms.id],
  }),
  payments: many(payments),
  invoices: many(invoices),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  booking: one(bookings, {
    fields: [invoices.bookingId],
    references: [bookings.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const staffRelations = relations(staff, ({ one }) => ({
  user: one(users, {
    fields: [staff.userId],
    references: [users.id],
  }),
}));
