'use client';

import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, calculateDiscount } from '@/utils/helpers';
import PaymentMethod from '@/components/ui/PaymentMethod';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const [step, setStep] = useState<'cart' | 'review' | 'checkout' | 'confirmation'>('cart');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', address: '', city: '' });
  const [orderId, setOrderId] = useState('');
  const router = useRouter();

  const handleProceedToReview = () => {
    setStep('review');
  };

  const handleProceedToCheckout = () => {
    setStep('checkout');
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod || !shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!currentUser.id) {
        alert('Please log in to place an order');
        return;
      }

      const orderData = {
        buyer_id: currentUser.id,
        buyer_name: shippingInfo.name,
        total,
        status: 'pending',
        payment_method: paymentMethod,
        delivery_address: shippingInfo.address,
        order_items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
        })),
      };

      const res = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        setOrderId(data.order?.order_number || 'ORD-' + Date.now());
        setStep('confirmation');
        clearCart();
      } else {
        alert('Failed to place order: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Order error:', err);
      alert('Error placing order: ' + err);
    }
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-harar-cream flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-harar-brown/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-harar-brown mb-2">Your cart is empty</h2>
          <p className="text-harar-brown/70 mb-6">Add some products to get started</p>
          <Link href="/marketplace" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-harar-cream flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-md text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-harar-brown mb-2">Order Confirmed!</h2>
          <p className="text-harar-brown/70 mb-4">Your order has been placed successfully</p>
          <div className="bg-harar-sand/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-harar-brown/60">Order ID</p>
            <p className="text-xl font-bold text-harar-brown">{orderId}</p>
          </div>
          <p className="text-sm text-harar-brown/70 mb-6">You will receive a confirmation email shortly with tracking information.</p>
          <Link href="/buyer" className="btn-primary w-full">Continue Shopping</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-harar-cream">
      <div className="bg-transparent sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/marketplace" className="flex items-center gap-2 text-harar-brown hover:text-harar-gold transition">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Continue Shopping</span>
            </Link>
            <h1 className="text-2xl font-bold text-harar-brown">
              {step === 'cart' && 'Shopping Cart'}
              {step === 'review' && 'Order Review'}
              {step === 'checkout' && 'Checkout'}
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center gap-8 mb-8">
          {['cart', 'review', 'checkout'].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === s ? 'bg-harar-gold text-white' : 'bg-harar-sand text-harar-brown'
              }`}>
                {['cart', 'review', 'checkout'].indexOf(s) + 1}
              </div>
              <span className="text-sm font-semibold text-harar-brown capitalize">{s}</span>
            </div>
          ))}
        </div>

        {/* Cart Step */}
        {step === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => {
                  const price = item.discount ? calculateDiscount(item.price, item.discount) : item.price;
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
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
                    </motion.div>
                  );
                })}
              </div>
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
                <button onClick={handleProceedToReview} className="btn-primary w-full">Review Order</button>
              </div>
            </div>
          </div>
        )}

        {/* Review Step */}
        {step === 'review' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-bold text-harar-brown mb-4">Order Items</h2>
                <div className="space-y-3">
                  {items.map((item) => {
                    const price = item.discount ? calculateDiscount(item.price, item.discount) : item.price;
                    return (
                      <div key={item.id} className="flex justify-between items-center pb-3 border-b border-harar-sand/30">
                        <div>
                          <p className="font-semibold text-harar-brown">{item.name}</p>
                          <p className="text-sm text-harar-brown/70">{item.artisanName} × {item.quantity}</p>
                        </div>
                        <span className="font-bold text-harar-gold">{formatCurrency(price * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
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
                <div className="space-y-2">
                  <button onClick={() => setStep('cart')} className="btn-secondary w-full">Back to Cart</button>
                  <button onClick={handleProceedToCheckout} className="btn-primary w-full">Continue to Checkout</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Step */}
        {step === 'checkout' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="card">
                <h2 className="text-xl font-bold text-harar-brown mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="card">
                <h2 className="text-xl font-bold text-harar-brown mb-4">Payment Method</h2>
                <PaymentMethod onSelect={setPaymentMethod} />
              </div>
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
                <div className="space-y-2">
                  <button onClick={() => setStep('review')} className="btn-secondary w-full">Back</button>
                  <button onClick={handlePlaceOrder} className="btn-primary w-full">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
