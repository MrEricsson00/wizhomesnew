
import React, { useState, useMemo } from 'react';
import { Icons, getRooms } from '../constants';
import RoomCard from '../components/RoomCard';

const Rooms: React.FC = () => {
  const rooms = useMemo(() => getRooms(), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-16">
        <span className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px]">Curated Selection</span>
        <h1 className="text-5xl font-black text-zinc-900 dark:text-white mt-4 uppercase tracking-tighter">Available Inventory</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-4 max-w-xl mx-auto">Discover our two exclusive habitation models: premium short-stay luxury and value-driven urban residence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {rooms.map(room => (
          <div key={room.id} className="animate-in fade-in zoom-in duration-700">
            <RoomCard room={room} />
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 text-center max-w-4xl mx-auto shadow-sm">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight mb-4">WIZ Guarantee</h3>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed italic">"Whether booking for a night or a month, we ensure the same level of architectural integrity and dedicated service across our entire portfolio."</p>
      </div>
    </div>
  );
};

export default Rooms;
