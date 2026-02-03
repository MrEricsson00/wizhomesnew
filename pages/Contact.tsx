import React, { useState } from 'react';
import { Icons } from '../constants';

const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Contact Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl font-black text-zinc-900 dark:text-white mb-6 leading-tight">Get in Touch with <br/><span className="text-red-600">Concierge</span></h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-md">
              Have a special request or need assistance planning your stay? Our dedicated team is ready to curate your perfect experience.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-6 group cursor-pointer" onClick={() => window.open('tel:+233552795947')}>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0 border dark:border-red-900/50 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Direct Line</h4>
                <p className="text-zinc-500 dark:text-zinc-400">+233 55 279 5947</p>
              </div>
            </div>

            <div className="flex items-start space-x-6 group cursor-pointer" onClick={() => window.open('mailto:wizhomes1@gmail.com')}>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0 border dark:border-red-900/50 group-hover:scale-110 transition-transform">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Email Concierge</h4>
                <p className="text-zinc-500 dark:text-zinc-400">wizhomes1@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 transition-all min-h-[500px] flex items-center justify-center">
          {isSubmitted ? (
            <div className="text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.Check />
              </div>
              <h2 className="text-3xl font-black mb-4">Message Sent!</h2>
              <p className="text-zinc-500 mb-8">Our concierge team will review your request and get back to you within 2 hours.</p>
              <button onClick={() => setIsSubmitted(false)} className="px-8 py-3 border border-zinc-950 dark:border-white font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                  <input type="text" required placeholder="John Doe" className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                  <input type="email" required placeholder="john@example.com" className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Your Message</label>
                <textarea rows={5} required placeholder="How can we help you?" className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 resize-none"></textarea>
              </div>
              <button type="submit" disabled={loading} className="w-full py-5 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all flex items-center justify-center">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;