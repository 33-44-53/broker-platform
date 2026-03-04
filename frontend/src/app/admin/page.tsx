'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import { formatDate } from '@/utils/helpers';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'artisans' | 'buyers' | 'products' | 'auctions' | 'disputes'>('overview');
  const [allArtisans, setAllArtisans] = useState<any[]>([]);
  const [allBuyers, setAllBuyers] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [pendingAuctions, setPendingAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'artisans') fetchAllArtisans();
    else if (activeTab === 'buyers') fetchAllBuyers();
    else if (activeTab === 'products') fetchAllProducts();
    else if (activeTab === 'auctions') fetchPendingAuctions();
  }, [activeTab]);

  const fetchPendingAuctions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost/api/controllers/auctions.php?pending=1');
      const data = await res.json();
      setPendingAuctions(Array.isArray(data) ? data : []);
    } catch {
      setPendingAuctions([]);
    }
    setLoading(false);
  };

  const fetchAllArtisans = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost/api/controllers/auth.php?all_artisans=1');
      const data = await res.json();
      setAllArtisans(Array.isArray(data) ? data : []);
    } catch {
      setAllArtisans([]);
    }
    setLoading(false);
  };

  const fetchAllBuyers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost/api/controllers/auth.php?all_buyers=1');
      const data = await res.json();
      setAllBuyers(Array.isArray(data) ? data : []);
    } catch {
      setAllBuyers([]);
    }
    setLoading(false);
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost/api/controllers/products.php');
      const data = await res.json();
      setAllProducts(Array.isArray(data) ? data : []);
    } catch {
      setAllProducts([]);
    }
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
      alert('Artisan verified!');
      fetchAllArtisans();
    }
  };

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    const res = await fetch('http://localhost/api/controllers/auth.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_status', user_id: userId, is_active: isActive }),
    });
    const data = await res.json();
    if (data.success) {
      alert('Status updated!');
      if (activeTab === 'artisans') fetchAllArtisans();
      if (activeTab === 'buyers') fetchAllBuyers();
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`http://localhost/api/controllers/products.php?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      alert('Product deleted!');
      fetchAllProducts();
    }
  };

  const toggleProductStatus = async (id: number, isActive: boolean) => {
    const res = await fetch('http://localhost/api/controllers/products.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: isActive }),
    });
    const data = await res.json();
    if (data.success) {
      alert('Product status updated!');
      fetchAllProducts();
    }
  };

  const approveAuction = async (auctionId: number) => {
    const scheduledDate = (document.getElementById(`schedule-${auctionId}`) as HTMLInputElement)?.value;
    if (!scheduledDate) {
      alert('Please select a date and time');
      return;
    }
    const res = await fetch('http://localhost/api/controllers/auctions.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve', auction_id: auctionId, scheduled_date: scheduledDate }),
    });
    const data = await res.json();
    if (data.success) {
      alert('Auction approved!');
      fetchPendingAuctions();
    }
  };

  const rejectAuction = async (auctionId: number) => {
    if (!confirm('Reject this auction request?')) return;
    const res = await fetch('http://localhost/api/controllers/auctions.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', auction_id: auctionId }),
    });
    const data = await res.json();
    if (data.success) {
      alert('Auction rejected!');
      fetchPendingAuctions();
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
            { id: 'artisans', label: 'Artisans', icon: Users },
            { id: 'buyers', label: 'Buyers', icon: Users },
            { id: 'products', label: 'Products', icon: ShoppingBag },
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
                <MetricCard title="Active Artisans" value={allArtisans.length} icon={Clock} />
              </div>
            </motion.div>
          )}

          {activeTab === 'artisans' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Artisan Management</h1>
              {loading ? (
                <div className="card text-center py-12"><p>Loading...</p></div>
              ) : (
                <div className="card overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-harar-sand">
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Name</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Email</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Status</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Verified</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allArtisans.map((artisan) => (
                        <tr key={artisan.id} className="border-b border-harar-sand/50">
                          <td className="py-4 px-4">{artisan.name}</td>
                          <td className="py-4 px-4">{artisan.email}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${artisan.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {artisan.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${artisan.is_verified ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {artisan.is_verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-4 px-4 flex gap-2">
                            {!artisan.is_verified && (
                              <button onClick={() => handleVerify(artisan.id)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Verify</button>
                            )}
                            <button onClick={() => toggleUserStatus(artisan.id, !artisan.is_active)} className={`px-3 py-1 rounded text-sm text-white ${artisan.is_active ? 'bg-red-500' : 'bg-green-500'}`}>
                              {artisan.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'buyers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Buyer Management</h1>
              {loading ? (
                <div className="card text-center py-12"><p>Loading...</p></div>
              ) : (
                <div className="card overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-harar-sand">
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Name</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Email</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Status</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allBuyers.map((buyer) => (
                        <tr key={buyer.id} className="border-b border-harar-sand/50">
                          <td className="py-4 px-4">{buyer.name}</td>
                          <td className="py-4 px-4">{buyer.email}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${buyer.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {buyer.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button onClick={() => toggleUserStatus(buyer.id, !buyer.is_active)} className={`px-3 py-1 rounded text-sm text-white ${buyer.is_active ? 'bg-red-500' : 'bg-green-500'}`}>
                              {buyer.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Product Management</h1>
              {loading ? (
                <div className="card text-center py-12"><p>Loading...</p></div>
              ) : (
                <div className="card overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-harar-sand">
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Product</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Artisan</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Price</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Status</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts.map((product) => (
                        <tr key={product.id} className="border-b border-harar-sand/50">
                          <td className="py-4 px-4">{product.name}</td>
                          <td className="py-4 px-4">{product.artisan_name}</td>
                          <td className="py-4 px-4">{product.price} ETB</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 px-4 flex gap-2">
                            <button onClick={() => toggleProductStatus(product.id, !product.is_active)} className={`px-3 py-1 rounded text-sm text-white ${product.is_active ? 'bg-orange-500' : 'bg-green-500'}`}>
                              {product.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'auctions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Auction Requests</h1>
              {loading ? (
                <div className="card text-center py-12"><p>Loading...</p></div>
              ) : pendingAuctions.length === 0 ? (
                <div className="card text-center py-12"><p>No pending auctions</p></div>
              ) : (
                <div className="space-y-4">
                  {pendingAuctions.map((auction) => (
                    <div key={auction.id} className="card p-4">
                      <h3 className="font-bold text-harar-brown mb-2">{auction.product_name}</h3>
                      <p className="text-sm text-harar-brown/70 mb-4">By: {auction.artisan_name}</p>
                      <div className="flex gap-2">
                        <input type="datetime-local" id={`schedule-${auction.id}`} className="input-field flex-1" />
                        <button onClick={() => approveAuction(auction.id)} className="btn-primary px-4">Approve</button>
                        <button onClick={() => rejectAuction(auction.id)} className="px-4 py-2 bg-red-500 text-white rounded">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'disputes' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Disputes</h1>
              <div className="card text-center py-12"><p>No active disputes</p></div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
