
import React from 'react';

const Concierge: React.FC = () => {
  const whatsappLink = "https://wa.me/message/47XDNT6LC4ZAL1";

  return (
    <div className="fixed bottom-8 right-8 z-[150] group">
      {/* Tooltip Label */}
      <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0">
        <div className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-2xl border border-white/10 dark:border-black/10">
          Chat with Concierge
        </div>
      </div>

      {/* Pulsing Notification Ring */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 scale-125"></div>

      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white dark:border-zinc-900 group shadow-[#25D366]/30"
        aria-label="Chat with WIZ HOMES on WhatsApp"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="drop-shadow-sm"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" fill="currentColor"/>
          <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" fill="currentColor"/>
          <path d="M9.5 13c0 1.1.9 2 2 2s2-.9 2-2" stroke="currentColor"/>
          {/* Custom WhatsApp Icon Path for better recognition */}
          <path 
            fill="currentColor" 
            stroke="none"
            d="M12.004 2C6.48 2 2.004 6.477 2.004 12c0 1.767.461 3.427 1.267 4.873l-1.348 4.925 5.038-1.323A9.957 9.957 0 0012.004 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.333c-1.554 0-3.045-.407-4.346-1.178l-.312-.185-3.23.848.863-3.151-.204-.324a8.289 8.289 0 01-1.272-4.343c0-4.577 3.724-8.301 8.301-8.301 4.578 0 8.301 3.724 8.301 8.301 0 4.578-3.723 8.301-8.301 8.301z"
          />
        </svg>

        {/* Brand Dot */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-red-600 border-2 border-white dark:border-zinc-900 rounded-full animate-pulse"></div>
      </a>
    </div>
  );
};

export default Concierge;
