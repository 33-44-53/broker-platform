'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Gavel, TrendingUp, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { mockAuctions } from '@/mock-data/orders';
import { formatCurrency } from '@/utils/helpers';

export default function AuctionPage() {
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const auction = mockAuctions[0];

  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(auction.endTime).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  const handleBid = () => {
    if (parseFloat(bidAmount) > auction.currentBid) {
      alert('Bid placed successfully!');
      setBidAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-harar-cream">
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2 text-harar-brown hover:text-harar-gold transition">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="card mb-6">
              <img src={auction.productImage} alt={auction.productName} className="w-full h-96 object-cover rounded-xl" />
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-harar-brown mb-4">{auction.productName}</h2>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-harar-clay" />
                <span className="text-harar-brown/70">By {auction.artisanName}</span>
              </div>
              <p className="text-harar-brown/70">
                This is a rare antique basket handcrafted using traditional Harari techniques passed down through generations. 
                Features intricate geometric patterns and natural dyes.
              </p>
            </div>
          </div>

          <div>
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-harar-brown">Live Auction</h3>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                  Active
                </span>
              </div>

              <div className="bg-gradient-to-br from-harar-gold/10 to-harar-rust/10 rounded-xl p-6 mb-6">
                <p className="text-sm text-harar-brown/70 mb-2">Current Bid</p>
                <p className="text-4xl font-bold text-harar-gold mb-4">{formatCurrency(auction.currentBid)}</p>
                <div className="flex items-center gap-2 text-sm text-harar-brown/70">
                  <TrendingUp className="h-4 w-4" />
                  <span>{auction.bids.length} bids placed</span>
                </div>
              </div>

              <div className="bg-harar-sand/30 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-harar-brown" />
                  <span className="font-semibold text-harar-brown">Time Remaining</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="bg-white rounded-lg p-3 mb-2">
                        <span className="text-3xl font-bold text-harar-brown">{String(item.value).padStart(2, '0')}</span>
                      </div>
                      <span className="text-sm text-harar-brown/70">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-harar-brown mb-2">Place Your Bid</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min: ${auction.currentBid + 100} ETB`}
                    className="input-field flex-1"
                  />
                  <button onClick={handleBid} className="btn-primary flex items-center gap-2">
                    <Gavel className="h-5 w-5" />
                    Bid Now
                  </button>
                </div>
                <p className="text-sm text-harar-brown/60 mt-2">
                  Starting bid: {formatCurrency(auction.startingBid)}
                </p>
              </div>

              <div className="card bg-harar-sand/20">
                <h4 className="font-semibold text-harar-brown mb-4">Bid History</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {auction.bids.slice().reverse().map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-harar-brown">{bid.bidderName}</p>
                        <p className="text-xs text-harar-brown/60">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <span className="font-bold text-harar-gold">{formatCurrency(bid.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
