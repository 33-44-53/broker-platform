'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, TrendingUp, Plus, Edit, Trash2, ToggleLeft, ToggleRight, LogOut, Home, X, Upload, Users, Star } from 'lucide-react';
import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import { CategoryPieChart, SalesBarChart, RevenueLineChart } from '@/charts/Charts';
import { useProducts } from '@/contexts/ProductContext';
import { mockOrders } from '@/mock-data/orders';
import { formatCurrency, getStatusColor } from '@/utils/helpers';

export default function ArtisanContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics' | 'auctions' | 'profile'>('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [userName, setUserName] = useState('Artisan User');
  const [analytics, setAnalytics] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    category: 'Baskets',
    stock: '',
    images: [] as string[],
  });
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    name: 'Fatima Ahmed',
    location: 'Jugol, Harar',
    phone: '+251911234567',
    bio: '',
    skills: '',
    national_id: '',
    national_id_photo: '',
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const isVerified = true;

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.name) {
      setUserName(currentUser.name);
      setProfile(prev => ({ ...prev, name: currentUser.name }));
    }
    if (currentUser.id) {
      fetch(`http://localhost/api/controllers/analytics.php?user_id=${currentUser.id}&role=artisan`)
        .then(res => {
          if (!res.ok) throw new Error('API error');
          return res.json();
        })
        .then(data => {
          if (data && !data.error) setAnalytics(data);
        })
        .catch(() => {
          setAnalytics({
            totalProducts: 5,
            activeProducts: 3,
            totalOrders: 12,
            totalRevenue: 15000,
            categoryDistribution: [
              { category: 'Baskets', count: 5 },
              { category: 'Pottery', count: 3 },
              { category: 'Textiles', count: 2 },
            ]
          });
        });
    }
  }, []);

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-harar-cream flex items-center justify-center">
        <div className="card max-w-md text-center">
          <Package className="h-24 w-24 text-harar-brown/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-harar-brown mb-2">Account Pending Verification</h2>
          <p className="text-harar-brown/70 mb-6">Your artisan account is awaiting admin approval. You'll be notified once verified.</p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const artisanProducts = products.length > 0 ? products : [];
  const artisanOrders = mockOrders.filter(o => o.artisanId === 'a1');
  
  const bestSellingProducts = artisanProducts
    .map(p => ({
      ...p,
      sales: artisanOrders.filter(o => o.products.some((prod: any) => prod.id === p.id)).length
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const totalEarnings = artisanOrders.reduce((sum, o) => sum + o.total, 0);
  const monthlyEarnings = artisanOrders.reduce((sum, o) => sum + o.total, 0) / 12;

  const customerFeedback = [
    { id: 1, customer: 'Abeba M.', rating: 5, comment: 'Excellent quality and fast delivery!', date: '2024-01-15' },
    { id: 2, customer: 'Tadesse K.', rating: 4, comment: 'Good product, well packaged', date: '2024-01-10' },
    { id: 3, customer: 'Almaz T.', rating: 5, comment: 'Beautiful craftsmanship, highly recommend', date: '2024-01-05' },
    { id: 4, customer: 'Yohannes B.', rating: 4, comment: 'Very satisfied with my purchase', date: '2023-12-28' },
  ];

  const auctionRequests = [
    { id: 1, product: 'Traditional Basket', status: 'pending', date: '2024-01-20', startingBid: 500 },
    { id: 2, product: 'Pottery Vase', status: 'approved', date: '2024-01-15', startingBid: 1000 },
  ];

  const handleSaveProfile = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const res = await fetch('http://localhost/api/controllers/profile.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, user_id: currentUser.id || 1 }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Profile updated successfully!');
        setShowProfileModal(false);
        setActiveTab('profile');
      } else {
        alert('Failed to update profile: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error updating profile: ' + err);
    }
  };

  return (
    <div className="min-h-screen bg-harar-cream">
      <div className="fixed left-0 top-0 h-full w-64 bg-transparent shadow-lg z-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-harar-brown mb-2">Artisan Portal</h2>
          <p className="text-sm text-harar-brown/60">{userName}</p>
        </div>
        
        <nav className="px-4">
          {[
            { id: 'overview', label: 'Dashboard', icon: Home },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'auctions', label: 'Auctions', icon: TrendingUp },
            { id: 'profile', label: 'Profile', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                activeTab === item.id
                  ? 'bg-harar-gold text-white'
                  : 'text-harar-brown hover:bg-harar-sand'
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Dashboard Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard title="Total Revenue" value={formatCurrency(analytics?.totalRevenue || 0)} icon={DollarSign} trend={23.5} />
                <MetricCard title="Orders This Month" value={analytics?.totalOrders || 0} icon={ShoppingCart} trend={12.3} />
                <MetricCard title="Active Products" value={analytics?.activeProducts || 0} icon={Package} trend={5.2} />
                <MetricCard title="Avg. Rating" value="4.8" icon={TrendingUp} trend={2.1} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-xl font-semibold text-harar-brown mb-4">Product Categories</h3>
                  <CategoryPieChart data={analytics?.categoryDistribution?.map((c: any) => ({ name: c.category, value: parseInt(c.count) })) || []} />
                </div>
                <div className="card">
                  <h3 className="text-xl font-semibold text-harar-brown mb-4">Monthly Sales</h3>
                  <SalesBarChart data={analytics?.monthlySales?.map((m: any) => ({ month: m.month, sales: parseFloat(m.sales) })) || []} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-harar-brown">Product Management</h1>
                <button onClick={() => setShowAddProductModal(true)} className="btn-primary flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Product
                </button>
              </div>
              <div className="card">
                {artisanProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-harar-brown/30 mx-auto mb-4" />
                    <p className="text-harar-brown/60">No products yet. Add your first product!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-harar-sand">
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Product</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Category</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Price</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Stock</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Status</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {artisanProducts.map((product) => (
                          <tr key={product.id} className="border-b border-harar-sand/50 hover:bg-harar-sand/20">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <img src={product.images?.[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                <span className="font-medium text-harar-brown">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-harar-brown/70">{product.category}</td>
                            <td className="py-4 px-4 text-harar-brown font-semibold">{formatCurrency(product.price)}</td>
                            <td className="py-4 px-4">
                              <span className={`${product.stock < 10 ? 'text-red-600' : 'text-green-600'} font-medium`}>{product.stock}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.isActive ? 'active' : 'inactive')}`}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => { setEditingProduct(product); setShowEditProductModal(true); }} className="p-2 hover:bg-harar-sand rounded-lg transition">
                                  <Edit className="h-4 w-4 text-harar-brown" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Order Management</h1>
              <div className="card">
                {artisanOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-harar-brown/30 mx-auto mb-4" />
                    <p className="text-harar-brown/60">No orders yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-harar-sand">
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Order ID</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Customer</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Total</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Status</th>
                          <th className="text-left py-4 px-4 text-harar-brown font-semibold">Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {artisanOrders.map((order) => (
                          <tr key={order.id} className="border-b border-harar-sand/50 hover:bg-harar-sand/20">
                            <td className="py-4 px-4 font-medium text-harar-brown">{order.id}</td>
                            <td className="py-4 px-4 text-harar-brown/70">{order.buyerName}</td>
                            <td className="py-4 px-4 text-harar-brown font-semibold">{formatCurrency(order.total)}</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'auctions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Auction Requests</h1>
              <div className="card">
                {auctionRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-harar-brown/30 mx-auto mb-4" />
                    <p className="text-harar-brown/60">No auction requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auctionRequests.map((auction) => (
                      <div key={auction.id} className="border border-harar-sand rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-harar-brown">{auction.product}</p>
                          <p className="text-sm text-harar-brown/60">Starting Bid: {formatCurrency(auction.startingBid)}</p>
                          <p className="text-xs text-harar-brown/50 mt-1">{auction.date}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          auction.status === 'approved' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {auction.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Sales Analytics</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card">
                  <p className="text-sm text-harar-brown/60 mb-2">Total Earnings</p>
                  <p className="text-3xl font-bold text-harar-gold">{formatCurrency(totalEarnings)}</p>
                  <p className="text-xs text-harar-brown/50 mt-2">From {artisanOrders.length} orders</p>
                </div>
                <div className="card">
                  <p className="text-sm text-harar-brown/60 mb-2">Monthly Average</p>
                  <p className="text-3xl font-bold text-harar-gold">{formatCurrency(monthlyEarnings)}</p>
                  <p className="text-xs text-harar-brown/50 mt-2">Average per month</p>
                </div>
                <div className="card">
                  <p className="text-sm text-harar-brown/60 mb-2">Avg. Rating</p>
                  <p className="text-3xl font-bold text-harar-gold">4.8</p>
                  <p className="text-xs text-harar-brown/50 mt-2">Based on customer feedback</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-xl font-semibold text-harar-brown mb-4">Best Selling Products</h3>
                  {bestSellingProducts.length === 0 ? (
                    <p className="text-harar-brown/60 text-center py-8">No sales data yet</p>
                  ) : (
                    <div className="space-y-3">
                      {bestSellingProducts.map((product, idx) => (
                        <div key={product.id} className="flex items-center justify-between pb-3 border-b border-harar-sand/30">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-harar-gold">#{idx + 1}</span>
                            <div>
                              <p className="font-medium text-harar-brown">{product.name}</p>
                              <p className="text-xs text-harar-brown/60">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-harar-brown">{product.sales} sales</p>
                            <p className="text-xs text-harar-gold">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-harar-brown mb-4">Customer Feedback</h3>
                  <div className="space-y-3">
                    {customerFeedback.map((feedback) => (
                      <div key={feedback.id} className="pb-3 border-b border-harar-sand/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-harar-brown">{feedback.customer}</p>
                          <div className="flex gap-1">
                            {[...Array(feedback.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-harar-gold text-harar-gold" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-harar-brown/70">{feedback.comment}</p>
                        <p className="text-xs text-harar-brown/50 mt-1">{feedback.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Artisan Profile</h1>
              <div className="card max-w-2xl">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-harar-brown">Profile Information</h2>
                  <button onClick={() => setShowProfileModal(true)} className="btn-primary flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Update Profile
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-harar-brown/60">Full Name</p>
                    <p className="text-lg font-semibold text-harar-brown">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-harar-brown/60">Location</p>
                    <p className="text-lg font-semibold text-harar-brown">{profile.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-harar-brown/60">Phone</p>
                    <p className="text-lg font-semibold text-harar-brown">{profile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-harar-brown/60">Bio</p>
                    <p className="text-lg text-harar-brown">{profile.bio || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-harar-brown/60">Skills & Specialties</p>
                    <p className="text-lg text-harar-brown">{profile.skills || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-harar-brown/60">National ID</p>
                    <p className="text-lg text-harar-brown">{profile.national_id || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showProfileModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfileModal(false)} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-harar-sand px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-harar-brown">Update Profile</h2>
                  <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-harar-sand rounded-lg transition">
                    <X className="h-6 w-6 text-harar-brown" />
                  </button>
                </div>
                <div className="p-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Full Name</label>
                      <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Location</label>
                      <input type="text" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Phone</label>
                      <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Bio</label>
                      <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell buyers about yourself and your craft..." rows={3} className="input-field resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Skills & Specialties</label>
                      <textarea value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} placeholder="e.g., Basket weaving, Traditional dyeing, Hand embroidery" rows={3} className="input-field resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">National ID Number</label>
                      <input type="text" value={profile.national_id} onChange={(e) => setProfile({ ...profile, national_id: e.target.value })} className="input-field" placeholder="Enter your national ID number" />
                    </div>
                    <button type="button" onClick={handleSaveProfile} className="btn-primary w-full">
                      Save Profile
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
