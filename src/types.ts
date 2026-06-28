export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export interface User {
  id: number;
  uid: string;
  email: string;
  name: string;
  phone: string | null;
  roleId: number;
  disabled: boolean;
  createdAt: string;
  role?: Role;
}

export interface SeasonalPrice {
  rate: number;
  label: string;
}

export interface RoomCategory {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  capacity: number;
  amenities: string[];
  images: string[];
  seasonalPricing: Record<string, SeasonalPrice>;
  totalRooms: number;
  availableCount: number;
}

export interface Room {
  id: number;
  roomNumber: string;
  categoryId: number;
  status: 'available' | 'occupied' | 'maintenance';
  floor: string;
  categoryName?: string;
  category?: RoomCategory;
}

export interface Booking {
  id: number;
  userId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  specialRequests: string | null;
  createdAt: string;
  room?: Room;
  user?: User;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'verified' | 'rejected';
  receiptUrl: string;
  submittedAt: string;
  verifiedAt: string | null;
  booking?: Booking;
  user?: User;
}

export interface Invoice {
  id: number;
  bookingId: number;
  invoiceNumber: string;
  amount: number;
  status: 'unpaid' | 'paid';
  issuedAt: string;
  dueDate: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'email' | 'whatsapp' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  url: string;
  type: 'photo' | 'video';
  category: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  createdAt: string;
}

export interface Staff {
  id: number;
  userId: number;
  department: string;
  shift: string;
  salary: number;
  name?: string;
  email?: string;
  phone?: string | null;
  role?: string;
  roleId?: number;
}

export interface CMSConfig {
  heroTitle: string;
  heroSubtitle: string;
  hotelStory: string;
  faqs: { q: string; a: string }[];
  contactInfo: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    googleMapEmbed: string;
  };
}
