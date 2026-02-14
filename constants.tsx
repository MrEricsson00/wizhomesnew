
import React from 'react';
import { Room, RoomStatus, Booking } from './types';

const UNIFORM_AMENITIES = [
  'High speed Wi-Fi connection',
  'Air conditioning',
  'Beach access (Guests can be driven to nearby beaches)',
  'Dedicated workspace (An area for focused activities that includes a desk or table and a power source)',
  'Exercise equipment',
  'Fire extinguisher',
  'Free parking on premise (Parking on-site that\'s free of charge)',
  'Kitchen',
  'Smoke alarms',
  'Tv'
];

const LONG_STAY_AMENITIES = [
  'High speed Wi-Fi connection',
  'Air conditioning',
  'Beach access (Guests can be driven to nearby beaches)',
  'Exercise equipment',
  'Fire extinguisher',
  'Free parking on premise (Parking on-site that\'s free of charge)',
  'Kitchen',
  'Smoke alarms',
];

export const MOCK_ROOMS: Room[] = [
  {
    id: 'wiz-short-stay-01',
    name: 'WIZ Short Stay Apartment',
    price: 1000,
    priceFrequency: 'night',
    status: RoomStatus.AVAILABLE,
    amenities: UNIFORM_AMENITIES,
    imageUrl: '/room1.jpeg',
    gallery: [
      '/room1.jpeg',
      '/room2.jpeg',
      '/room3.jpeg',
      '/room4,.jpeg',
      '/room5,.jpeg',
      '/room6,.jpeg',
      '/room7,.jpeg',
      '/room8,.jpeg',
      '/room9,.jpeg',
      '/room10..jpeg',
      '/room11,,.jpeg',
      '/room13 (2).jpeg'
    ],
    rating: 4.8,
    location: 'Wiz Homes',
    description: 'Perfect for short stays, this modern apartment offers all the amenities you need for a comfortable visit. Ideal for business travelers or tourists exploring the city. Features a cozy bedroom, fully equipped kitchen, and convenient location.'
  },
  {
    id: 'wiz-apt-02',
    name: 'WIZ Long Stay Apartments',
    price: 4000,
    priceFrequency: 'month',
    status: RoomStatus.AVAILABLE,
    amenities: LONG_STAY_AMENITIES,
    imageUrl: '/wiz urban residence 1.jpeg',
    gallery: [
      '/wiz urban residence 1.jpeg',
      '/urban residence 2.jpeg',
      '/urban residence 3.jpeg',
      '/urban residence 4.jpeg'
    ],
    rating: 4.7,
    location: 'Wiz Homes',
    description: 'Premier long-term residence at an unbeatable value. This modern apartment offers a spacious layout, high ceilings, and full access to building amenities. Perfect for professionals looking for a stable, high-quality home base.'
  }
];

export const getRooms = (): Room[] => {
  return MOCK_ROOMS;
};

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'B1', guestName: 'Alexander Wiz', roomName: 'WIZ Luxe Furnished Suite', checkIn: '2026-01-01', checkOut: '2026-01-05', status: 'Confirmed', total: 5000 },
  { id: 'B2', guestName: 'Sarah Jenkins', roomName: 'WIZ Urban Residence', checkIn: '2026-02-01', checkOut: '2026-03-01', status: 'Confirmed', total: 4000 }
];

export const Logo: React.FC<{ className?: string; light?: boolean }> = ({ className = "h-12", light = false }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <div className="relative flex items-end">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-end space-x-1 h-6">
        <div className={`w-3 h-1 ${light ? 'bg-white' : 'bg-zinc-950 dark:bg-white'} rotate-[-45deg] origin-bottom-right transform translate-x-1 translate-y-[-2px]`}></div>
        <div className={`w-3 h-1 ${light ? 'bg-white' : 'bg-zinc-950 dark:bg-white'} rotate-[-45deg] origin-bottom-right transform translate-x-1 translate-y-[-2px]`}></div>
        <div className="w-5 h-1.5 bg-red-600 rotate-[45deg] origin-bottom-left transform translate-y-[-4px]"></div>
      </div>
      <div className="flex font-black tracking-tighter text-3xl leading-none">
        <span className={light ? 'text-white' : 'text-zinc-950 dark:text-white'}>WIZ</span>
        <span className="text-red-600 ml-1">HOMES</span>
      </div>
    </div>
    <div className="flex items-center space-x-2 w-full mt-1.5 overflow-hidden">
      <div className={`h-[1px] flex-grow ${light ? 'bg-white/30' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
      <span className={`text-[8px] font-black uppercase tracking-[0.4em] ${light ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400'}`}>Exteriors</span>
      <div className={`h-[1px] flex-grow ${light ? 'bg-white/30' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
    </div>
  </div>
);

export const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Star: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
  View: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.72V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.17a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  CreditCard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>,
};
