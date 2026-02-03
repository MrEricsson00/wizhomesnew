
export enum RoomStatus {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
  NOT_AVAILABLE = 'Not Available'
}

export interface Room {
  id: string;
  name: string;
  price: number;
  priceFrequency: 'night' | 'month';
  status: RoomStatus;
  amenities: string[];
  imageUrl: string;
  gallery?: string[];
  rating: number;
  location: string;
  description: string;
}

export interface Booking {
  id: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  total: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'Operator' | 'Admin' | 'Guest';
  joinedAt: string;
}
