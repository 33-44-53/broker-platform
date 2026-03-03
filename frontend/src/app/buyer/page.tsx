'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Package, TrendingUp, LogOut, Home, Trash2, Plus, Minus, Clock, Gavel, Truck, Star, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import MetricCard from '@/components/ui/MetricCard';
import { CategoryPieChart, RevenueLineChart } from '@/charts/Charts';
import { mockOrders, mockChartData } from '@/mock-data/orders';
import { mockProducts } from '@/mock-data/products';
import { formatCurrency, getStatusColor, formatDate, calculateDiscount } from '@/utils/helpers';
import { useCart } from '@/contexts/CartContext';
import PaymentMethod from '@/components/ui/PaymentMethod';

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'tracking' | 'reviews' | 'wishlist' | 'auctions' | 'cart'>('overview');
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [auctions, setAuctions] = useState<any[]>([]);
  const [bidAmounts, setBidAmounts] = useState<{[key: number]: string}>({});
  const [userName, setUserName] = useState('Buyer User');
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ product_id: '', rating: 5, comment: '' });

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
      
      fetch(`http://localhost/api/controllers/reviews.php?buyer_id=${currentUser.id}`)
        .then(res => res.json())
        .then(data => setReviews(data || []))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'auctions') {
      fetch('http://localhost/api/controllers/auctions.php?approved=1')
        .then(res => res.json())
        .then(data => setAuctions(data || []))
        .catch(() => setAuctions([]));
    }
  }, [activeTab]);

  const placeBid = async (auctionId: number) => {
    const amount = parseFloat(bidAmounts[auctionId]);
    if (!amount) return;

    const res = await fetch('http://localhost/api/controllers/auctions.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'bid', auction_id: auctionId, bidder_id: 1, bidder_name: userName, amount })
    });
    const data = await res.json();
    if (data.success) {
      alert('Bid placed successfully!');
      setBidAmounts(prev => ({ ...prev, [auctionId]: '' }));
      fetch('http://localhost/api/controllers/auctions.php?approved=1')
        .then(res => res.json())
        .then(data => setAuctions(data || []))
        .catch(() => {});
    } else {
      alert(data.error || 'Failed to place bid');
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

  const handleCheckoutOrder = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const params = new URLSearchParams();
    params.append('buyer_id', String(currentUser.id || 1));
    params.append('buyer_name', currentUser.name);
    params.append('artisan_id', String(items[0]?.artisan_id || 1));
    params.append('total', String(total));
    params.append('payment_method', paymentMethod);
    params.append('delivery_address', 'Default Address');
    params.append('products', JSON.stringify(items.map(item => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.discount ? calculateDiscount(item.price, item.discount) : item.price
    }))));

    try {
      const res = await fetch('http://localhost/api/controllers/orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('API returned invalid JSON:', text);
        alert('Server error: ' + text.substring(0, 100));
        return;
      }

      if (data.success) {
        clearCart();
        setShowCheckout(false);
        alert(`Order placed successfully! Order #${data.order_number}`);
        
        fetch(`http://localhost/api/controllers/orders.php?buyer_id=${currentUser.id}`)
          .then(res => res.json())
          .then(data => setOrders(data))
          .catch(() => {});
        
        fetch(`http://localhost/api/controllers/analytics.php?user_id=${currentUser.id}&role=buyer`)
          .then(res => res.json())
          .then(data => setAnalytics(data))
          .catch(() => {});
        
        setActiveTab('orders');
      } else {
        alert('Order failed: ' + (data.error || data.message));
      }
    } catch (err) {
      console.error('Order error:', err);
      alert('Error placing order: ' + err);
    }
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
            { id: 'tracking', label: 'Track Orders', icon: Truck },
            { id: 'reviews', label: 'Reviews', icon: Star },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'auctions', label: 'Auctions', icon: TrendingUp },
            { id: 'cart', label: 'Cart', icon: Package, badge: itemCount },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-all relative text-sm ${
                activeTab === item.id ? 'bg-harar-gold text-white' : 'text-harar-brown hover:bg-harar-sand'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
              {'badge' in item && item.badge > 0 && (
                <span className="absolute right-2 bg-harar-rust text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
                          <button onClick={handleCheckoutOrder} className="btn-primary w-full">
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
