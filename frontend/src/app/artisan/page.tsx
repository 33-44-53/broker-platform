'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, TrendingUp, Plus, Edit, Trash2, ToggleLeft, ToggleRight, LogOut, Home, X, Upload, Image as ImageIcon, Users } from 'lucide-react';
import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import { CategoryPieChart, SalesBarChart, RevenueLineChart } from '@/charts/Charts';
import { useProducts } from '@/contexts/ProductContext';
import { mockOrders, mockChartData } from '@/mock-data/orders';
import { formatCurrency, getStatusColor } from '@/utils/helpers';

export default function ArtisanDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics' | 'auctions' | 'profile'>('overview');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const { products, addProduct, updateProduct } = useProducts();
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
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    skill: '',
    national_id: '',
    national_id_photo: '',
  });
  
  // Mock user - replace with actual auth
  const isVerified = true; // Get from auth context

  useState(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.name) {
      setUserName(currentUser.name);
      setProfile(prev => ({ ...prev, name: currentUser.name }));
    }
    if (currentUser.id) {
      fetch(`http://localhost:8000/api/analytics?user_id=${currentUser.id}&role=artisan`)
        .then(res => res.json())
        .then(data => setAnalytics(data))
        .catch(() => {});
      fetch(`http://localhost:8000/api/profile?user_id=${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile) {
            setProfile(data.profile);
          }
        })
        .catch(() => {});
    }
  });

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

  const artisanProducts = products.filter(p => (p as any).artisanId === 1 || (p as any).artisan_id === 1);
  const artisanOrders = mockOrders.filter(o => o.artisanId === 'a1');
  const totalRevenue = artisanOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-harar-cream">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50">
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
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Top Header with Profile */}
        <div className="flex justify-end mb-8">
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-harar-sand transition"
            >
              <div className="w-10 h-10 rounded-full bg-harar-gold flex items-center justify-center text-white font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-harar-brown font-medium">{userName}</span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-40 border border-harar-sand"
                >
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-harar-brown hover:bg-harar-sand transition flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    View Profile
                  </button>
                  <Link
                    href="/"
                    className="w-full text-left px-4 py-3 text-harar-brown hover:bg-harar-sand transition flex items-center gap-2 border-t border-harar-sand"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Dashboard Overview</h1>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Total Revenue"
                  value={formatCurrency(analytics?.totalRevenue || 0)}
                  icon={DollarSign}
                  trend={23.5}
                />
                <MetricCard
                  title="Orders This Month"
                  value={analytics?.totalOrders || 0}
                  icon={ShoppingCart}
                  trend={12.3}
                />
                <MetricCard
                  title="Active Products"
                  value={analytics?.activeProducts || 0}
                  icon={Package}
                  trend={5.2}
                />
                <MetricCard
                  title="Avg. Rating"
                  value="4.8"
                  icon={TrendingUp}
                  trend={2.1}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-xl font-semibold text-harar-brown mb-4">Product Categories</h3>
                  <CategoryPieChart data={Array.isArray(analytics?.categoryDistribution) ? analytics.categoryDistribution.map((c: any) => ({ name: c.category, value: parseInt(c.count) })) : []} />
                </div>
                <div className="card">
                  <h3 className="text-xl font-semibold text-harar-brown mb-4">Monthly Sales</h3>
                  <SalesBarChart data={Array.isArray(analytics?.monthlySales) ? analytics.monthlySales.map((m: any) => ({ month: m.month, sales: parseFloat(m.sales) })) : []} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-harar-brown">Product Management</h1>
                <button 
                  onClick={() => setShowAddProductModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add New Product
                </button>
              </div>

              <div className="card">
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
                              <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                              <span className="font-medium text-harar-brown">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-harar-brown/70">{product.category}</td>
                          <td className="py-4 px-4 text-harar-brown font-semibold">{formatCurrency(product.price)}</td>
                          <td className="py-4 px-4">
                            <span className={`${product.stock < 10 ? 'text-red-600' : 'text-green-600'} font-medium`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.isActive ? 'active' : 'inactive')}`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowEditProductModal(true);
                                }}
                                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </button>
                              <button onClick={async () => {
                                setLoadingProductId(product.id);
                                updateProduct(product.id, { ...product, isActive: !product.isActive });
                                try {
                                  await fetch(`http://localhost:8000/api/products/${product.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ ...product, is_active: !product.isActive })
                                  });
                                } catch (error) { console.error('Toggle error:', error); }
                                setLoadingProductId(null);
                              }} disabled={loadingProductId === product.id} className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition ${product.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${loadingProductId === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {product.isActive ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                                {product.isActive ? 'Available' : 'Sold'}
                              </button>
                              <button onClick={async () => {
                                if (confirm('Delete this product?')) {
                                  setLoadingProductId(product.id);
                                  updateProduct(product.id, null);
                                  try {
                                    await fetch(`http://localhost:8000/api/products/${product.id}`, { method: 'DELETE' });
                                  } catch (error) { console.error('Delete error:', error); }
                                  setLoadingProductId(null);
                                }
                              }} disabled={loadingProductId === product.id} className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition ${loadingProductId === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Order Management</h1>

              <div className="card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-harar-sand">
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Order ID</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Customer</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Products</th>
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
                          <td className="py-4 px-4 text-harar-brown/70">{order.products.length} item(s)</td>
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
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Sales Analytics</h1>

              <div className="grid grid-cols-1 gap-6">
                <div className="card">
                  <h3 className="text-xl font-semibold text-harar-brown mb-4">Revenue Trend</h3>
                  <RevenueLineChart data={Array.isArray(analytics?.monthlySales) ? analytics.monthlySales.map((m: any) => ({ month: m.month, sales: parseFloat(m.sales) })) : []} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card">
                    <h3 className="text-xl font-semibold text-harar-brown mb-4">Category Performance</h3>
                    <CategoryPieChart data={Array.isArray(analytics?.categoryDistribution) ? analytics.categoryDistribution.map((c: any) => ({ name: c.category, value: parseInt(c.count) })) : []} />
                  </div>
                  <div className="card">
                    <h3 className="text-xl font-semibold text-harar-brown mb-4">Monthly Comparison</h3>
                    <SalesBarChart data={Array.isArray(analytics?.monthlySales) ? analytics.monthlySales.map((m: any) => ({ month: m.month, sales: parseFloat(m.sales) })) : []} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Auctions Tab */}
          {activeTab === 'auctions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Request Auction</h1>

              <div className="card max-w-2xl">
                <form className="space-y-6" onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const productId = formData.get('product_id') as string;
                  const product = artisanProducts.find(p => p.id == productId);
                  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                  const res = await fetch('http://localhost/api/controllers/auctions.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'request',
                      product_id: productId,
                      product_name: product?.name,
                      product_image: product?.images[0],
                      artisan_id: currentUser.id || 1,
                      artisan_name: currentUser.name || 'Artisan',
                      starting_bid: formData.get('starting_bid'),
                      min_increment: formData.get('min_increment'),
                      description: formData.get('description'),
                      duration: formData.get('duration'),
                    }),
                  });
                  const data = await res.json();
                  if(data.success) {
                    alert('Auction request submitted!');
                    (e.target as HTMLFormElement).reset();
                  } else {
                    alert('Failed: ' + (data.error || 'Unknown error'));
                  }
                }}>
                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Select Product</label>
                    <select name="product_id" required className="input-field">
                      <option value="">Choose a product</option>
                      {artisanProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Starting Bid (ETB)</label>
                    <input type="number" name="starting_bid" required className="input-field" placeholder="1000" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Minimum Bid Increment (ETB)</label>
                    <input type="number" name="min_increment" required className="input-field" placeholder="50" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Duration (hours)</label>
                    <input type="number" name="duration" required className="input-field" placeholder="24" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Description</label>
                    <textarea name="description" rows={4} className="input-field resize-none" placeholder="Additional auction details..."></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full">Submit Auction Request</button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Artisan Profile</h1>

              <div className="card max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Full Name</label>
                    <p className="text-lg text-harar-brown">{profile.name || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Email</label>
                    <p className="text-lg text-harar-brown">{profile.email || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Phone</label>
                    <p className="text-lg text-harar-brown">{profile.phone || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Location</label>
                    <p className="text-lg text-harar-brown">{profile.location || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Skills</label>
                    <p className="text-lg text-harar-brown">{profile.skill || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">Bio</label>
                    <p className="text-lg text-harar-brown">{profile.bio || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-harar-brown mb-2">National ID Number</label>
                    <p className="text-lg text-harar-brown">{profile.national_id || 'Not provided'}</p>
                  </div>

                  {profile.national_id_photo && (
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">National ID Photo</label>
                      <img src={profile.national_id_photo} alt="National ID" className="w-full max-w-md rounded-lg" />
                    </div>
                  )}

                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className="btn-primary w-full"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProductModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddProductModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-harar-sand px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-harar-brown">Add New Product</h2>
                  <button
                    onClick={() => setShowAddProductModal(false)}
                    className="p-2 hover:bg-harar-sand rounded-lg transition"
                  >
                    <X className="h-6 w-6 text-harar-brown" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <form className="space-y-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="e.g., Traditional Harari Basket"
                        className="input-field"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">
                        Description *
                      </label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Describe your product in detail..."
                        rows={4}
                        className="input-field resize-none"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">
                        Category *
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="input-field"
                      >
                        <option value="Baskets">Baskets</option>
                        <option value="Pottery">Pottery</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Leather Goods">Leather Goods</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="Home Decor">Home Decor</option>
                      </select>
                    </div>

                    {/* Price and Discount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-harar-brown mb-2">
                          Price (ETB) *
                        </label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="1000"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-harar-brown mb-2">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          value={newProduct.discount}
                          onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                          placeholder="10"
                          min="0"
                          max="100"
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        placeholder="50"
                        className="input-field"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">
                        Product Images *
                      </label>
                      <div className="border-2 border-dashed border-harar-sand rounded-xl p-8 text-center hover:border-harar-gold transition cursor-pointer">
                        <Upload className="h-12 w-12 text-harar-brown/40 mx-auto mb-4" />
                        <p className="text-harar-brown/70 mb-2">Click to upload or drag and drop</p>
                        <p className="text-sm text-harar-brown/50">PNG, JPG, WEBP up to 5MB</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach(file => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreview(prev => [...prev, reader.result as string]);
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="btn-secondary mt-4 inline-block cursor-pointer">
                          Select Images
                        </label>
                      </div>

                      {/* Image Previews */}
                      {imagePreview.length > 0 && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          {imagePreview.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview(imagePreview.filter((_, i) => i !== index));
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price Preview */}
                    {newProduct.price && (
                      <div className="bg-harar-sand/30 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-harar-brown/70">Final Price:</span>
                          <div className="text-right">
                            {newProduct.discount ? (
                              <>
                                <span className="text-2xl font-bold text-harar-gold">
                                  {formatCurrency(
                                    parseFloat(newProduct.price) -
                                    (parseFloat(newProduct.price) * parseFloat(newProduct.discount || '0')) / 100
                                  )}
                                </span>
                                <span className="text-sm text-gray-400 line-through ml-2">
                                  {formatCurrency(parseFloat(newProduct.price))}
                                </span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold text-harar-gold">
                                {formatCurrency(parseFloat(newProduct.price))}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddProductModal(false);
                          setNewProduct({
                            name: '',
                            description: '',
                            price: '',
                            discount: '',
                            category: 'Baskets',
                            stock: '',
                            images: [],
                          });
                          setImagePreview([]);
                        }}
                        className="flex-1 px-6 py-3 border-2 border-harar-sand rounded-xl text-harar-brown font-semibold hover:bg-harar-sand transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.stock) {
                            alert('Please fill all required fields');
                            return;
                          }
                          try {
                            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                            await addProduct({
                              name: newProduct.name,
                              description: newProduct.description,
                              price: parseFloat(newProduct.price),
                              discount: newProduct.discount ? parseFloat(newProduct.discount) : 0,
                              category: newProduct.category,
                              images: imagePreview.length > 0 ? imagePreview : ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500'],
                              artisan_id: currentUser.id || 1,
                              artisan_name: currentUser.name || 'Artisan User',
                              artisan_location: profile.location,
                              stock: parseInt(newProduct.stock),
                              is_active: true,
                            });
                            alert('Product added successfully!');
                            setShowAddProductModal(false);
                            setNewProduct({
                              name: '',
                              description: '',
                              price: '',
                              discount: '',
                              category: 'Baskets',
                              stock: '',
                              images: [],
                            });
                            setImagePreview([]);
                          } catch(err) {
                            alert('Failed to add product: ' + err);
                          }
                        }}
                        className="flex-1 btn-primary"
                      >
                        Add Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {showEditProductModal && editingProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditProductModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-harar-sand px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-harar-brown">Edit Product</h2>
                  <button
                    onClick={() => setShowEditProductModal(false)}
                    className="p-2 hover:bg-harar-sand rounded-lg transition"
                  >
                    <X className="h-6 w-6 text-harar-brown" />
                  </button>
                </div>

                <div className="p-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Product Name *</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Description *</label>
                      <textarea
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        rows={4}
                        className="input-field resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Category *</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="input-field"
                      >
                        <option value="Baskets">Baskets</option>
                        <option value="Pottery">Pottery</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Leather Goods">Leather Goods</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="Home Decor">Home Decor</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-harar-brown mb-2">Price (ETB) *</label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-harar-brown mb-2">Discount (%)</label>
                        <input
                          type="number"
                          value={editingProduct.discount || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, discount: e.target.value ? parseFloat(e.target.value) : undefined })}
                          min="0"
                          max="100"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Stock Quantity *</label>
                      <input
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                        className="input-field"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowEditProductModal(false)}
                        className="flex-1 px-6 py-3 border-2 border-harar-sand rounded-xl text-harar-brown font-semibold hover:bg-harar-sand transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await updateProduct(editingProduct.id, editingProduct);
                          alert('Product updated successfully!');
                          setShowEditProductModal(false);
                        }}
                        className="flex-1 btn-primary"
                      >
                        Update Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfileModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditProfileModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-harar-sand px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-harar-brown">Update Profile</h2>
                  <button
                    onClick={() => setShowEditProfileModal(false)}
                    className="p-2 hover:bg-harar-sand rounded-lg transition"
                  >
                    <X className="h-6 w-6 text-harar-brown" />
                  </button>
                </div>

                <div className="p-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Skills</label>
                      <input
                        type="text"
                        value={profile.skill}
                        onChange={(e) => setProfile({ ...profile, skill: e.target.value })}
                        className="input-field"
                        placeholder="e.g., Basket Weaving, Pottery"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">Bio</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                        className="input-field resize-none"
                        placeholder="Tell us about yourself and your craft"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">National ID Number</label>
                      <input
                        type="text"
                        value={profile.national_id}
                        onChange={(e) => setProfile({ ...profile, national_id: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-harar-brown mb-2">National ID Photo</label>
                      <div className="border-2 border-dashed border-harar-sand rounded-xl p-8 text-center">
                        <Upload className="h-12 w-12 text-harar-brown/40 mx-auto mb-4" />
                        <p className="text-harar-brown/70 mb-2">Upload your National ID photo</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProfile({ ...profile, national_id_photo: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id="id-upload-modal"
                        />
                        <label htmlFor="id-upload-modal" className="btn-secondary mt-4 inline-block cursor-pointer">
                          Choose File
                        </label>
                      </div>
                      {profile.national_id_photo && (
                        <div className="mt-4">
                          <img src={profile.national_id_photo} alt="National ID" className="w-full max-w-md rounded-lg" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowEditProfileModal(false)}
                        className="flex-1 px-6 py-3 border-2 border-harar-sand rounded-xl text-harar-brown font-semibold hover:bg-harar-sand transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                          try {
                            const res = await fetch('http://localhost:8000/api/profile', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...profile, user_id: currentUser.id || 1 }),
                            });
                            const data = await res.json();
                            if (data.success) {
                              alert('Profile updated successfully!');
                              setShowEditProfileModal(false);
                            } else {
                              alert('Failed to update profile');
                            }
                          } catch (error) {
                            alert('Error updating profile');
                          }
                        }}
                        className="flex-1 btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
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

// OrdersTab component created at: src/app/artisan/orders-tab.tsx
// Features:
// - View new orders with buyer details
// - Accept/reject orders via status dropdown
// - Update order status: Pending, Processing, Shipped, Delivered
// - See buyer details (name, email, phone, address)
// - Real-time API updates to backend
