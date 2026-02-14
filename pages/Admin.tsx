
import React, { useState, useEffect } from 'react';
import { Icons, getRooms, Logo } from '../constants';
import { RoomStatus, Room, UserProfile, Booking } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';

interface AdminProps {
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ theme, toggleTheme, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rooms' | 'bookings'>('dashboard');
  const [rooms, setRooms] = useState<Room[]>(getRooms());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<Room | null>(null);
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    localStorage.setItem('wiz_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        } else {
          setUserProfile({
            uid: auth.currentUser.uid,
            email: auth.currentUser.email || '',
            displayName: auth.currentUser.displayName || 'Operator',
            role: 'Operator',
            joinedAt: new Date().toISOString()
          });
        }
      }

      setIsLoadingBookings(true);
      try {
        const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingBookings(false);
      }
    };
    fetchData();
  }, []);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusColor = (status: RoomStatus | string) => {
    switch (status) {
      case RoomStatus.AVAILABLE: return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case RoomStatus.BOOKED: return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case RoomStatus.NOT_AVAILABLE: return 'text-zinc-600 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700';
      case 'Confirmed': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'Pending': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      default: return 'text-zinc-600 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700';
    }
  };

  const handleLogoutWithRedirect = async () => {
    await onLogout();
    navigate('/');
  };

  const addRecord = () => {
    if (activeTab === 'rooms') {
      const newId = `R${Date.now()}`;
      const newRoom: Room = { 
        id: newId, 
        name: 'New Luxury Unit',
        price: 100,
        priceFrequency: 'night',
        status: RoomStatus.AVAILABLE,
        location: 'TBD',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
        gallery: [],
        amenities: ['Wifi'],
        rating: 5.0
      };
      setIsEditing(newRoom);
    } else {
      notify('Manual booking entry is restricted.');
    }
  };

  const stats = [
    { label: 'Total Units', value: rooms.length, icon: <Icons.Home />, color: 'bg-red-600' },
    { label: 'Network Bookings', value: bookings.length, icon: <Icons.Check />, color: 'bg-zinc-950 dark:bg-zinc-900' },
    { label: 'Available Inventory', value: rooms.filter(r => r.status === RoomStatus.AVAILABLE).length, icon: <Icons.Star />, color: 'bg-green-600' },
    { label: 'Global Revenue', value: `GH₵${Math.round(bookings.reduce((acc, b) => acc + (b.total || 0), 0) / 1000 * 10) / 10}k`, icon: <div className="text-white font-bold">₵</div>, color: 'bg-red-700' },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {notification && (
        <div className="fixed bottom-8 right-8 z-[300] animate-in slide-in-from-right-10 duration-300">
          <div className="bg-zinc-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center space-x-4 border border-zinc-800">
            <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/50"></div>
            <p className="font-black text-xs uppercase tracking-widest">{notification}</p>
          </div>
        </div>
      )}

      {viewingRoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 animate-in zoom-in-95 duration-500 my-8">
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-4 h-96 gap-1 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800">
                <div className="md:col-span-2 overflow-hidden h-full">
                  <img src={viewingRoom.imageUrl} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="" />
                </div>
                <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-1 h-full">
                  <div className="overflow-hidden"><img src={viewingRoom.gallery?.[0] || viewingRoom.imageUrl} className="w-full h-full object-cover" alt="" /></div>
                  <div className="overflow-hidden"><img src={viewingRoom.gallery?.[1] || viewingRoom.imageUrl} className="w-full h-full object-cover" alt="" /></div>
                </div>
                <div className="hidden md:grid grid-cols-1 grid-rows-2 gap-1 h-full">
                  <div className="overflow-hidden"><img src={viewingRoom.gallery?.[2] || viewingRoom.imageUrl} className="w-full h-full object-cover" alt="" /></div>
                  <div className="overflow-hidden relative bg-zinc-900">
                    <img src={viewingRoom.gallery?.[3] || viewingRoom.imageUrl} className="w-full h-full object-cover opacity-50" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">
                       +{Math.max(0, (viewingRoom.gallery?.length || 0) - 4)} Photos
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 md:p-16">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-16 pb-12 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                       <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 shadow-sm ${getStatusColor(viewingRoom.status)}`}>{viewingRoom.status}</span>
                       <div className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-xs font-black">
                         <Icons.Star />
                         <span className="dark:text-white">{viewingRoom.rating}</span>
                       </div>
                    </div>
                    <h2 className="text-5xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter leading-none">{viewingRoom.name}</h2>
                    <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">{viewingRoom.location}</p>
                  </div>
                  <div className="bg-red-600 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-red-600/30 text-center min-w-[200px]">
                    <p className="text-4xl font-black tracking-tighter leading-none">GH₵{viewingRoom.price}</p>
                    <p className="text-white/60 font-black uppercase tracking-widest text-[9px] mt-2">Nightly Rate</p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                   <button onClick={() => setViewingRoom(null)} className="px-12 py-5 bg-zinc-950 text-white font-black uppercase tracking-widest text-xs rounded-2xl">Exit Overview</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className="w-80 bg-zinc-950 dark:bg-black text-white hidden lg:flex flex-col border-r border-zinc-900 sticky top-0 h-screen">
        <div className="p-12">
          <Link to="/" className="group flex justify-center mb-16">
            <Logo light className="h-16" />
          </Link>

          <nav className="space-y-5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Icons.Dashboard /> },
              { id: 'rooms', label: 'Inventory', icon: <Icons.Home /> },
              { id: 'bookings', label: 'Bookings', icon: <Icons.Check /> }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`w-full flex items-center space-x-5 px-8 py-5 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-red-600 text-white font-black shadow-xl shadow-red-600/30 scale-105' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
              >
                <div className={activeTab === tab.id ? 'text-white' : 'text-zinc-600'}>{tab.icon}</div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-12 space-y-6">
          {userProfile && (
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 mb-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xs uppercase">
                  {userProfile.displayName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white truncate">{userProfile.displayName}</p>
                  <p className="text-[8px] font-bold text-zinc-500 truncate uppercase tracking-widest">{userProfile.role}</p>
                </div>
              </div>
              <p className="text-[8px] font-bold text-zinc-600 truncate">{userProfile.email}</p>
            </div>
          )}
          <button onClick={toggleTheme} className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl bg-zinc-900 border border-zinc-800 font-black uppercase tracking-widest text-[10px]">
            {theme === 'light' ? 'Night Mode' : 'Day Mode'}
          </button>
          <button onClick={handleLogoutWithRedirect} className="w-full flex items-center justify-center space-x-3 px-6 py-5 rounded-2xl bg-red-600/10 border border-red-600/20 text-red-600 font-black uppercase tracking-widest text-[10px]">
            <Icons.LogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 dark:bg-black border-t border-zinc-800 z-50">
        <nav className="flex justify-around py-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Icons.Dashboard /> },
            { id: 'rooms', label: 'Inventory', icon: <Icons.Home /> },
            { id: 'bookings', label: 'Bookings', icon: <Icons.Check /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all ${activeTab === tab.id ? 'text-red-500' : 'text-zinc-500'}`}
            >
              <div className={activeTab === tab.id ? 'text-red-500' : 'text-zinc-500'}>{tab.icon}</div>
              <span className="text-[8px] uppercase tracking-wider font-black">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-grow p-8 md:p-16 overflow-y-auto pb-24 lg:pb-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
          <div>
            <h1 className="text-5xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter">{activeTab}</h1>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Network Management Console</p>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={addRecord} className="px-10 py-5 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-red-700 shadow-2xl flex items-center space-x-4 transition-all active:scale-95">
               <Icons.Plus />
               <span>New {activeTab === 'rooms' ? 'Unit' : 'Entry'}</span>
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 hover:shadow-2xl transition-all group overflow-hidden relative shadow-sm">
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-10 group-hover:scale-110 transition-transform shadow-xl`}>{stat.icon}</div>
                  <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{stat.label}</p>
                  <p className="text-5xl font-black dark:text-white tracking-tighter leading-none">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'rooms' || activeTab === 'bookings') && (
          <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden animate-in slide-in-from-right-10 duration-700 shadow-sm">
            {isLoadingBookings && activeTab === 'bookings' ? (
              <div className="p-20 text-center animate-pulse font-black uppercase tracking-widest text-zinc-500">Syncing Network Database...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b dark:border-zinc-800">
                      <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Guest Details</th>
                      <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Stay Period</th>
                      <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Financials</th>
                      <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-zinc-800">
                    {(activeTab === 'rooms' ? rooms : bookings).map((item: any) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                        <td className="px-12 py-10">
                          {activeTab === 'rooms' ? (
                            <div className="flex items-center space-x-8">
                              <div className="w-24 h-20 rounded-2xl overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 flex-shrink-0 relative bg-zinc-100 dark:bg-zinc-800">
                                <img src={item.imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=100'} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div>
                                <p className="font-black text-zinc-950 dark:text-white uppercase tracking-tighter text-xl">{item.name}</p>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2">ID: {item.id}</p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="font-black text-zinc-950 dark:text-white uppercase tracking-tighter text-lg">{item.guestName}</p>
                              <p className="text-zinc-500 text-[10px] font-bold mt-1">{item.guestEmail}</p>
                              <p className="text-zinc-400 text-[10px] font-bold mt-1">{item.guestPhone}</p>
                              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-2">Ref: {item.paymentReference}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-12 py-10">
                          {activeTab === 'rooms' ? (
                            <div className="space-y-2">
                              <p className="font-black text-zinc-950 dark:text-white text-2xl tracking-tighter">GH₵{item.price}</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="font-black text-zinc-950 dark:text-white text-sm tracking-tight">{item.checkIn} — {item.checkOut}</p>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.guests} Guest{item.guests > 1 ? 's' : ''}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-12 py-10">
                          {activeTab === 'rooms' ? (
                            <div className="flex items-center space-x-3">
                              <button className={`px-5 py-2.5 border-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                                {item.status}
                              </button>
                              <button onClick={() => setViewingRoom(item)} className="p-3 bg-white dark:bg-zinc-800 rounded-xl text-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-700">
                                <Icons.View />
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="font-black text-zinc-950 dark:text-white text-2xl tracking-tighter">GH₵{item.total}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-12 py-10">
                          {activeTab === 'rooms' ? null : (
                            <div className="flex items-center space-x-3">
                              <button className={`px-5 py-2.5 border-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${getStatusColor(item.status)}`}>
                                {item.status}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
