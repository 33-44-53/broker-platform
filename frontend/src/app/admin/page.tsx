'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import { formatDate } from '@/utils/helpers';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'auctions' | 'disputes'>('overview');
  const [pendingArtisans, setPendingArtisans] = useState<any[]>([]);
  const [pendingAuctions, setPendingAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'verification') {
      fetchPendingArtisans();
    } else if (activeTab === 'auctions') {
      fetchPendingAuctions();
    }
  }, [activeTab]);

  const fetchPendingAuctions = async () => {
    setLoading(true);
    const res = await fetch('http://localhost/api/controllers/auctions.php?pending=1');
    const data = await res.json();
    setPendingAuctions(data);
    setLoading(false);
  };

  const fetchPendingArtisans = async () => {
    setLoading(true);
    const res = await fetch('http://localhost/api/controllers/auth.php?pending_artisans=1');
    const data = await res.json();
    setPendingArtisans(data);
    setLoading(false);
  };

  const handleVerify = async (userId: number) => {
    const res = await fetch('http://localhost/api/controllers/auth.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', user_id: userId }),
    });
    const data = await res.json();
    if (data.success) {
      alert('Artisan verified successfully!');
      fetchPendingArtisans();
    }
  };

  const handleReject = async (userId: number) => {
    if (!confirm('Are you sure you want to reject this artisan?')) return;
    const res = await fetch('http://localhost/api/controllers/auth.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', user_id: userId }),
    });
    const data = await res.json();
    if (data.success) {
      alert('Artisan rejected!');
      fetchPendingArtisans();
    }
  };

  return (
    <div className="min-h-screen bg-harar-cream">
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-harar-brown mb-2">Admin Portal</h2>
          <p className="text-sm text-harar-brown/60">Admin User</p>
        </div>
        
        <nav className="px-4">
          {[
            { id: 'overview', label: 'Dashboard', icon: Home },
            { id: 'verification', label: 'Artisan Verification', icon: Users },
            { id: 'auctions', label: 'Auction Requests', icon: TrendingUp },
            { id: 'disputes', label: 'Disputes', icon: TrendingUp },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                activeTab === item.id ? 'bg-harar-gold text-white' : 'text-harar-brown hover:bg-harar-sand'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-harar-brown hover:bg-harar-sand rounded-xl transition-all">
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </div>

      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Platform Overview</h1>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard title="Total Users" value="152" icon={Users} trend={12} />
                <MetricCard title="Total Products" value="1,234" icon={ShoppingBag} trend={8} />
                <MetricCard title="Total Revenue" value="45,600 ETB" icon={DollarSign} trend={23} />
                <MetricCard title="Pending Verifications" value={pendingArtisans.length} icon={Clock} />
              </div>
            </motion.div>
          )}

          {activeTab === 'verification' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Artisan Verification</h1>

              {loading ? (
                <div className="card text-center py-12">
                  <p className="text-harar-brown/70">Loading...</p>
                </div>
              ) : pendingArtisans.length === 0 ? (
                <div className="card text-center py-12">
                  <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-harar-brown mb-2">All Caught Up!</h2>
                  <p className="text-harar-brown/70">No pending artisan verifications</p>
                </div>
              ) : (
                <div className="card">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-harar-sand">
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Name</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Email</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Location</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Phone</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Registered</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingArtisans.map((artisan) => (
                          <tr key={artisan.id} className="border-b border-harar-sand/50 hover:bg-harar-sand/20">
                            <td className="py-4 px-4 font-medium text-harar-brown">{artisan.name}</td>
                            <td className="py-4 px-4 text-harar-brown/70">{artisan.email}</td>
                            <td className="py-4 px-4 text-harar-brown/70">{artisan.location || 'N/A'}</td>
                            <td className="py-4 px-4 text-harar-brown/70">{artisan.phone || 'N/A'}</td>
                            <td className="py-4 px-4 text-harar-brown/70">{formatDate(artisan.created_at)}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {artisan.national_id_photo && (
                                  <button
                                    onClick={() => window.open(artisan.national_id_photo, '_blank')}
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                                  >
                                    View ID
                                  </button>
                                )}
                                <button
                                  onClick={() => handleVerify(artisan.id)}
                                  className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(artisan.id)}
                                  className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'auctions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Auction Requests</h1>

              {loading ? (
                <div className="card text-center py-12"><p className="text-harar-brown/70">Loading...</p></div>
              ) : pendingAuctions.length === 0 ? (
                <div className="card text-center py-12"><p className="text-harar-brown/70">No pending auction requests</p></div>
              ) : (
                <div className="grid gap-6">
                  {pendingAuctions.map((auction) => (
                    <div key={auction.id} className="card">
                      <div className="flex gap-6">
                        <img src={JSON.parse(auction.images)[0]} alt={auction.product_name} className="w-32 h-32 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-harar-brown mb-2">{auction.product_name}</h3>
                          <p className="text-harar-brown/70 mb-2">By: {auction.artisan_name}</p>
                          <p className="text-harar-brown/70 mb-2">Starting Bid: {auction.starting_bid} ETB</p>
                          <p className="text-harar-brown/70 mb-2">Min Increment: {auction.min_increment} ETB</p>
                          <p className="text-harar-brown/70 mb-2">Duration: {auction.duration} hours</p>
                          {auction.description && <p className="text-harar-brown/70 mb-4">{auction.description}</p>}
                          <div className="flex gap-4">
                            <input type="datetime-local" id={`schedule-${auction.id}`} className="input-field" />
                            <button onClick={async () => {
                              const date = (document.getElementById(`schedule-${auction.id}`) as HTMLInputElement).value;
                              if(!date) { alert('Select date and time'); return; }
                              const res = await fetch('http://localhost/api/controllers/auctions.php', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'approve', auction_id: auction.id, scheduled_date: date }),
                              });
                              const data = await res.json();
                              if(data.success) { alert('Auction approved!'); fetchPendingAuctions(); }
                            }} className="btn-primary">Approve & Schedule</button>
                            <button onClick={async () => {
                              if(!confirm('Reject this auction?')) return;
                              const res = await fetch('http://localhost/api/controllers/auctions.php', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'reject', auction_id: auction.id }),
                              });
                              const data = await res.json();
                              if(data.success) { alert('Auction rejected!'); fetchPendingAuctions(); }
                            }} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Reject</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'disputes' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Dispute Resolution</h1>
              <div className="card text-center py-12">
                <p className="text-harar-brown/70">No active disputes</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
