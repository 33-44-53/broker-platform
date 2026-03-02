'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Package, TrendingUp, LogOut, Home, Trash2, Plus, Minus, Clock, Gavel } from 'lucide-react';
import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import { CategoryPieChart, RevenueLineChart } from '@/charts/Charts';
import { mockOrders, mockChartData } from '@/mock-data/orders';
import { mockProducts } from '@/mock-data/products';
import { formatCurrency, getStatusColor, formatDate, calculateDiscount } from '@/utils/helpers';
import { useCart } from '@/contexts/CartContext';
import PaymentMethod from '@/components/ui/PaymentMethod';

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'auctions' | 'cart'>('overview');
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [auctions, setAuctions] = useState<any[]>([]);
  const [bidAmounts, setBidAmounts] = useState<{[key: number]: string}>({});
  const [userName, setUserName] = useState('Buyer User');
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const buyerOrders = mockOrders.filter(o => o.buyerId === 'b1');
  const totalSpent = buyerOrders.reduce((sum, order) => sum + order.total, 0);
  const wishlistItems = mockProducts.slice(0, 4);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.name) setUserName(currentUser.name);
    if (currentUser.id) {
      fetch(`http://localhost/api/controllers/analytics.php?user_id=${currentUser.id}&role=buyer`)
        .then(res => res.json())
        .then(data => setAnalytics(data))
        .catch(() => {});
      
      fetch(`http://localhost/api/controllers/orders.php?buyer_id=${currentUser.id}`)
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'auctions') {
      fetch('http://localhost/api/controllers/auctions.php?action=approved')
        .then(res => res.json())
        .then(data => setAuctions(data.auctions || []));
    }
  }, [activeTab]);

  const placeBid = async (auctionId: number) => {
    const amount = parseFloat(bidAmounts[auctionId]);
    if (!amount) return;

    const res = await fetch('http://localhost/api/controllers/auctions.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'bid', auction_id: auctionId, buyer_id: 1, amount })
    });
    const data = await res.json();
    if (data.success) {
      alert('Bid placed successfully!');
      setBidAmounts(prev => ({ ...prev, [auctionId]: '' }));
      fetch('http://localhost/api/controllers/auctions.php?action=approved')
        .then(res => res.json())
        .then(data => setAuctions(data.auctions || []));
    } else {
      alert(data.message || 'Failed to place bid');
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-harar-cream">
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-harar-brown mb-2">Buyer Portal</h2>
          <p className="text-sm text-harar-brown/60">{userName}</p>
        </div>
        
        <nav className="px-4">
          {[
            { id: 'overview', label: 'Dashboard', icon: Home },
            { id: 'orders', label: 'My Orders', icon: ShoppingCart },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'auctions', label: 'Auctions', icon: TrendingUp },
            { id: 'cart', label: 'Cart', icon: Package, badge: itemCount },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all relative ${
                activeTab === item.id ? 'bg-harar-gold text-white' : 'text-harar-brown hover:bg-harar-sand'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {'badge' in item && item.badge > 0 && (
                <span className="absolute right-4 bg-harar-rust text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Link href="/marketplace" className="flex items-center gap-3 px-4 py-3 text-harar-brown hover:bg-harar-sand rounded-xl transition-all mb-2">
            <Package className="h-5 w-5" />
            Browse Products
          </Link>
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
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Dashboard Overview</h1>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard title="Total Orders" value={analytics?.totalOrders || 0} icon={ShoppingCart} />
                <MetricCard title="Total Spent" value={formatCurrency(analytics?.totalSpent || 0)} icon={TrendingUp} />
                <MetricCard title="Wishlist Items" value={wishlistItems.length} icon={Heart} />
                <MetricCard title="Pending Deliveries" value={analytics?.pendingDeliveries || 0} icon={Package} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card">
                  <h3 className="text-xl font-semibold text-harar-brown mb-4">Spending by Category</h3>
                  <CategoryPieChart data={analytics?.categorySpending?.map((c: any) => ({ name: c.category, value: parseFloat(c.spent) })) || []} />
                </div>
                <div className="card">
                  <h3 className="text-xl font-semibold text-harar-brown mb-4">Spending History</h3>
                  <RevenueLineChart data={analytics?.monthlySpending?.map((m: any) => ({ month: m.month, sales: parseFloat(m.spent) })) || []} />
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-harar-brown mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-harar-sand/30 rounded-xl">
                      <div>
                        <p className="font-semibold text-harar-brown">{order.order_number}</p>
                        <p className="text-sm text-harar-brown/70">{JSON.parse(order.products || '[]').length} items • {formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-harar-gold">{formatCurrency(order.total)}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Order History</h1>

              <div className="card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-harar-sand">
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Order ID</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Date</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Items</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Total</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Status</th>
                        <th className="text-left py-4 px-4 text-harar-brown font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-harar-sand/50 hover:bg-harar-sand/20">
                          <td className="py-4 px-4 font-medium text-harar-brown">{order.order_number}</td>
                          <td className="py-4 px-4 text-harar-brown/70">{formatDate(order.created_at)}</td>
                          <td className="py-4 px-4 text-harar-brown/70">{JSON.parse(order.products || '[]').length} item(s)</td>
                          <td className="py-4 px-4 text-harar-brown font-semibold">{formatCurrency(order.total)}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="btn-primary py-2 px-4 text-sm">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">My Wishlist</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlistItems.map((product) => (
                  <div key={product.id} className="card group">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img src={product.images[0]} alt={product.name} className="w-full h-56 object-cover" />
                      {product.discount && (
                        <div className="absolute top-3 right-3 bg-harar-rust text-white px-3 py-1 rounded-full text-sm font-semibold">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-harar-brown mb-2">{product.name}</h3>
                    <p className="text-harar-brown/70 text-sm mb-3">{product.artisanName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-harar-gold">{formatCurrency(product.price)}</span>
                      <div className="flex gap-2">
                        <button className="btn-primary py-2 px-4 text-sm">Add to Cart</button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition">
                          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'auctions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-3xl font-bold text-harar-brown mb-8">Live Auctions</h1>

              {auctions.length === 0 ? (
                <div className="card text-center py-12">
                  <Gavel className="h-24 w-24 text-harar-brown/30 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-harar-brown mb-2">No active auctions</h2>
                  <p className="text-harar-brown/70">Check back later for new auctions</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {auctions.map((auction) => (
                    <div key={auction.id} className="card">
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <img src={auction.product_image || '/placeholder.jpg'} alt={auction.product_name} className="w-full h-56 object-cover" />
                        <div className="absolute top-3 right-3 bg-harar-gold text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {auction.status === 'live' ? getTimeRemaining(auction.end_date) : 'Scheduled'}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-harar-brown mb-2">{auction.product_name}</h3>
                      <p className="text-sm text-harar-brown/70 mb-4">{auction.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-harar-brown/60">Starting Bid</p>
                          <p className="text-lg font-bold text-harar-gold">${auction.starting_bid}</p>
                        </div>
                        <div>
                          <p className="text-xs text-harar-brown/60">Current Bid</p>
                          <p className="text-lg font-bold text-harar-terracotta">${auction.current_bid || auction.starting_bid}</p>
                        </div>
                        <div>
                          <p className="text-xs text-harar-brown/60">Min Increment</p>
                          <p className="text-sm font-semibold text-harar-brown">${auction.min_increment}</p>
                        </div>
                        <div>
                          <p className="text-xs text-harar-brown/60">Total Bids</p>
                          <p className="text-sm font-semibold text-harar-brown">{auction.bid_count || 0}</p>
                        </div>
                      </div>

                      {auction.status === 'live' ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Enter bid amount"
                            value={bidAmounts[auction.id] || ''}
                            onChange={(e) => setBidAmounts(prev => ({ ...prev, [auction.id]: e.target.value }))}
                            className="input-field flex-1"
                            min={(parseFloat(auction.current_bid || auction.starting_bid) + parseFloat(auction.min_increment)).toFixed(2)}
                            step={auction.min_increment}
                          />
                          <button onClick={() => placeBid(auction.id)} className="btn-primary px-6">
                            <Gavel className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="bg-harar-sand/50 p-3 rounded-lg text-center">
                          <p className="text-sm font-semibold text-harar-brown">Starts: {new Date(auction.scheduled_date).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'cart' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-harar-brown">Shopping Cart ({itemCount})</h1>
                {items.length > 0 && (
                  <button onClick={clearCart} className="text-red-600 hover:text-red-700 text-sm font-semibold">Clear All</button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="card text-center py-12">
                  <Package className="h-24 w-24 text-harar-brown/30 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-harar-brown mb-2">Your cart is empty</h2>
                  <p className="text-harar-brown/70 mb-6">Add some products to get started</p>
                  <Link href="/marketplace" className="btn-primary">Browse Products</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                      const price = item.discount ? calculateDiscount(item.price, item.discount) : item.price;
                      return (
                        <div key={item.id} className="card">
                          <div className="flex gap-4">
                            <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-harar-brown mb-1">{item.name}</h3>
                              <p className="text-sm text-harar-brown/70 mb-2">{item.artisanName}</p>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded bg-harar-sand hover:bg-harar-clay hover:text-white transition">
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded bg-harar-sand hover:bg-harar-clay hover:text-white transition">
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                <span className="text-lg font-bold text-harar-gold">{formatCurrency(price * item.quantity)}</span>
                              </div>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="p-2 hover:bg-red-50 rounded-lg transition h-fit">
                              <Trash2 className="h-5 w-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <div className="card sticky top-24">
                      <h2 className="text-xl font-bold text-harar-brown mb-4">Order Summary</h2>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-harar-brown/70">Subtotal</span>
                          <span className="font-semibold text-harar-brown">{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-harar-brown/70">Shipping</span>
                          <span className="font-semibold text-green-600">Free</span>
                        </div>
                        <div className="border-t border-harar-sand pt-3 flex justify-between">
                          <span className="text-lg font-bold text-harar-brown">Total</span>
                          <span className="text-2xl font-bold text-harar-gold">{formatCurrency(total)}</span>
                        </div>
                      </div>

                      {!showCheckout ? (
                        <button onClick={() => setShowCheckout(true)} className="btn-primary w-full">Proceed to Checkout</button>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="font-semibold text-harar-brown">Select Payment Method</h3>
                          <PaymentMethod onSelect={setPaymentMethod} />
                          <button
                            onClick={async () => {
                              if (paymentMethod) {
                                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                                const orderData = {
                                  buyer_id: currentUser.id,
                                  buyer_name: currentUser.name,
                                  artisan_id: items[0]?.artisan_id || 1,
                                  total: total,
                                  payment_method: paymentMethod,
                                  delivery_address: 'Default Address',
                                  products: items.map(item => ({
                                    product_id: item.id,
                                    product_name: item.name,
                                    quantity: item.quantity,
                                    price: item.discount ? calculateDiscount(item.price, item.discount) : item.price
                                  }))
                                };
                                
                                const res = await fetch('http://localhost/api/controllers/orders.php', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(orderData)
                                });
                                
                                const data = await res.json();
                                if (data.success) {
                                  clearCart();
                                  setShowCheckout(false);
                                  alert(`Order placed successfully! Order #${data.order_number}`);
                                  
                                  fetch(`http://localhost/api/controllers/orders.php?buyer_id=${currentUser.id}`)
                                    .then(res => res.json())
                                    .then(data => setOrders(data));
                                  
                                  fetch(`http://localhost/api/controllers/analytics.php?user_id=${currentUser.id}&role=buyer`)
                                    .then(res => res.json())
                                    .then(data => setAnalytics(data));
                                  
                                  setActiveTab('orders');
                                } else {
                                  alert('Order failed: ' + data.error);
                                }
                              }
                            }}
                            disabled={!paymentMethod}
                            className="btn-primary w-full disabled:opacity-50"
                          >
                            Place Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
