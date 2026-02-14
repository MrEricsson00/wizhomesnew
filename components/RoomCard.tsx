
import React from 'react';
import { Room, RoomStatus } from '../types';
import { Icons } from '../constants';
import { useNavigate } from 'react-router-dom';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case RoomStatus.BOOKED: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case RoomStatus.NOT_AVAILABLE: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  const handleCardClick = () => {
    navigate(`/rooms/${room.id}`);
  };

  return (
    <div className="group cursor-pointer" onClick={handleCardClick}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 mb-4 border border-zinc-100 dark:border-zinc-800">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-colors border border-white/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">{room.name}</h3>
          <div className="flex items-center space-x-1">
            <Icons.Star />
            <span className="text-sm font-medium dark:text-zinc-300">{room.rating}</span>
          </div>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{room.location}</p>
        <div className="flex items-center space-x-1 text-sm text-zinc-400 dark:text-zinc-500 py-1">
          {room.amenities.slice(0, 3).map((a, i) => (
            <React.Fragment key={a}>
              <span>{a}</span>
              {i < Math.min(room.amenities.length, 3) - 1 && <span>•</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="pt-2">
          <span className="font-bold text-lg dark:text-zinc-100">GH₵{room.price}</span>
          <span className="text-zinc-500 dark:text-zinc-500 text-sm"> / {room.priceFrequency}</span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
