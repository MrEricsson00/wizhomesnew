
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { Logo, Icons } from '../constants';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const Checkout: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGatewayReady, setIsGatewayReady] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const checkScript = () => {
      if (window.PaystackPop) {
        setIsGatewayReady(true);
      } else {
        setTimeout(checkScript, 500);
      }
    };
    checkScript();
  }, []);

  if (!state || !state.room) {
    return <Navigate to="/rooms" replace />;
  }

  const { room, checkIn, checkOut, guests, total, nights } = state;

  const recordBooking = async (reference: string) => {
    try {
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        userId: 'guest',
        guestName: fullName,
        guestEmail: email,
        guestPhone: phone,
        roomName: room.name,
        checkIn,
        checkOut,
        guests,
        total,
        status: 'Confirmed',
        paymentReference: reference,
        gateway: 'Paystack-Live-V1',
        createdAt: new Date().toISOString()
      });

      navigate('/success', { 
        state: { 
          bookingId: bookingRef.id, 
          room, 
          checkIn, 
          checkOut, 
          total,
          reference,
          guestName: fullName
        } 
      });
    } catch (err: any) {
      console.error("Critical Storage Error:", err);
      setError("Payment confirmed, but reservation storage failed. Please save this reference: " + reference);
      setIsProcessing(false);
    }
  };

  const handlePaystackPayment = () => {
    if (!fullName || !email || !phone) {
      setError("Incomplete Identity: Please provide your name, email, and phone number.");
      return;
    }

    if (!window.PaystackPop) {
      setError("Gateway Error: The security module is still initializing. Please wait.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Paystack amount is in Pesewas (smallest unit) for GHS
      const amountInPesewas = Math.floor(total * 100);

      const handler = window.PaystackPop.setup({
        key: 'pk_live_aa8d4145f79140317df7cf62b70458e4c4091b6f',
        email: email.trim(),
        amount: amountInPesewas,
        currency: 'GHS', // Changed from NGN to GHS
        ref: `GUEST-WIZ-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: "Guest Name", variable_name: "guest_name", value: fullName },
            { display_name: "Phone Number", variable_name: "phone_number", value: phone }
          ]
        },
        callback: function(response: any) {
          recordBooking(response.reference);
        },
        onClose: function() {
          setIsProcessing(false);
          setError("Session Interrupted: Payment window closed before authorization.");
        }
      });

      handler.openIframe();
      
    } catch (err: any) {
      console.error("Initialization Exception:", err);
      setIsProcessing(false);
      setError(`System Error: Could not establish connection with Paystack.`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors duration-500">
      <div className="w-full md:w-[450px] lg:w-[500px] bg-zinc-950 dark:bg-black p-8 md:p-12 text-white flex flex-col justify-between border-r border-zinc-900 order-2 md:order-1">
        <div>
          <Logo light className="h-10 mb-12 opacity-50" />
          <div className="space-y-10">
            <div className="flex space-x-6 items-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-800">
                <img src={room.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-1">Reservation Details</p>
                <h3 className="text-xl font-black uppercase tracking-tighter leading-none">{room.name}</h3>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-2">{room.location}</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800/50 space-y-4">
               <div className="flex justify-between items-center text-zinc-400">
                  <span className="text-[9px] font-black uppercase tracking-widest">Stay Duration</span>
                  <span className="text-xs font-black text-white">{nights} Nights</span>
               </div>
               <div className="flex justify-between items-center text-zinc-400">
                  <span className="text-[9px] font-black uppercase tracking-widest">Party Size</span>
                  <span className="text-xs font-black text-white">{guests} Adult{guests > 1 ? 's' : ''}</span>
               </div>
            </div>

            <div className="pt-8 border-t border-zinc-900">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Settlement Total</span>
                  <span className="text-3xl font-black tracking-tighter">GH₵{total.toFixed(2)}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow p-8 md:p-16 lg:p-20 overflow-y-auto order-1 md:order-2">
        <div className="max-w-xl mx-auto">
          <Link to={`/rooms/${room.id}`} className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors mb-12">
            <Icons.ArrowLeft />
            <span>Return to Suite</span>
          </Link>

          <header className="mb-10">
            <h1 className="text-5xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter leading-none mb-4">Guest Checkout</h1>
            <p className="text-zinc-500 font-medium italic">Instant reservation without an account.</p>
          </header>

          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-5">
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Legal Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Alexander WIZ"
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-600/20 text-sm font-bold dark:text-white outline-none"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Electronic Mail</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="recipient@domain.com"
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-600/20 text-sm font-bold dark:text-white outline-none"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Direct Dial (WhatsApp/Phone)</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233..."
                    className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-600/20 text-sm font-bold dark:text-white outline-none"
                  />
               </div>
            </div>

            <div className="p-8 md:p-12 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#09A5DB] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="5"/></svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Settlement Partner</p>
                    <p className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-widest">Paystack Secure (GHS)</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest transition-all duration-700 ${isGatewayReady ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  {isGatewayReady ? 'Protection Active' : 'Initializing...'}
                </div>
              </div>

              {error && (
                <div className="p-5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center animate-in shake duration-500">
                  {error}
                </div>
              )}

              <button 
                onClick={handlePaystackPayment}
                disabled={isProcessing || !isGatewayReady}
                className="w-full py-6 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirming...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Icons.Lock />
                    <span>Authorize GH₵{total.toFixed(2)}</span>
                  </div>
                )}
              </button>

              <div className="flex items-center justify-center space-x-10 opacity-30 grayscale filter grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
