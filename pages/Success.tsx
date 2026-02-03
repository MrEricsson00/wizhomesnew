
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Logo, Icons } from '../constants';

const Success: React.FC = () => {
  const { state } = useLocation();

  if (!state || !state.bookingId) {
    return <Navigate to="/" replace />;
  }

  const { bookingId, room, checkIn, checkOut, total, reference, guestName } = state;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 sm:p-12 transition-colors duration-1000">
      <div className="w-full max-w-2xl text-center space-y-12 animate-in fade-in zoom-in duration-1000">
        <Logo light className="h-16 mb-8 mx-auto" />
        
        <div className="relative">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white mx-auto shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-in slide-in-from-bottom-10">
            <Icons.Check />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-red-600 rounded-full animate-ping opacity-10"></div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">Stay Authorized.</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px]">Reference: {reference || bookingId.slice(-10).toUpperCase()}</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-[2.5rem] p-8 md:p-12 text-left grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
           <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Traveler</p>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">{guestName || 'WIZ Guest'}</h3>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Residence</p>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">{room.name}</h3>
              </div>
           </div>
           <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Duration</p>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">{checkIn} — {checkOut}</h3>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Financial State</p>
                <h3 className="text-lg font-black text-green-500 uppercase tracking-tight">GH₵{total.toFixed(2)} Verified</h3>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <button 
             onClick={handlePrint}
             className="w-full sm:w-auto px-10 py-5 bg-white text-zinc-950 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95"
           >
             Save Confirmation
           </button>
           <Link to="/" className="w-full sm:w-auto px-10 py-5 border border-zinc-800 text-zinc-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:text-white hover:border-white transition-all">
             Exit to Lobby
           </Link>
        </div>

        <div className="pt-12">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-800">
            A secure digital key will be dispatched to your email on the arrival date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
