
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Booking, Room } from '../types';
import { Logo, Icons, getRooms } from '../constants';
import { useNavigate, Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const rooms = getRooms();

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(fetched);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserBookings();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-32">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl">
                {auth.currentUser?.displayName?.charAt(0) || 'G'}
              </div>
              <div>
                <h1 className="text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter">
                  {auth.currentUser?.displayName || 'Guest Traveler'}
                </h1>
                <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Private Collection Member</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="px-8 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition-all active:scale-95 shadow-sm"
          >
            End Session
          </button>
        </header>

        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight dark:text-white mb-8">Your Itinerary</h2>
            
            {loading ? (
              <div className="p-20 text-center animate-pulse text-zinc-400 font-black uppercase tracking-widest text-xs">
                Synchronizing with Global Server...
              </div>
            ) : bookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {bookings.map((booking: any) => {
                  const room = rooms.find(r => r.name === booking.roomName);
                  return (
                    <div key={booking.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-8">
                      <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0">
                        <img src={room?.imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {booking.status || 'Confirmed'}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">REF: {booking.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">{booking.roomName}</h3>
                        <p className="text-sm font-bold text-zinc-500">{booking.checkIn} — {booking.checkOut}</p>
                      </div>
                      <div className="text-right w-full md:w-auto">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Settlement</p>
                        <p className="text-3xl font-black tracking-tighter dark:text-white">GH₵{booking.total}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-20 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 text-center">
                <p className="text-zinc-500 font-medium mb-6">Your collection is currently empty.</p>
                <Link to="/rooms" className="inline-block px-10 py-4 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-red-600/30">
                  Explore Inventory
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
