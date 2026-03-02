'use client';

import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, calculateDiscount } from '@/utils/helpers';
import PaymentMethod from '@/components/ui/PaymentMethod';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const router = useRouter();

  const handleCheckout = () => {
    if (paymentMethod) {
      clearCart();
      alert('Order placed successfully!');
      router.push('/buyer');
    }
  };

  if (items.length === 0) {
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

  return (
    <div className="min-h-screen bg-harar-cream">
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/marketplace" className="flex items-center gap-2 text-harar-brown hover:text-harar-gold transition">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Continue Shopping</span>
            </Link>
            <h1 className="text-2xl font-bold text-harar-brown">Shopping Cart ({itemCount})</h1>
            <button onClick={clearCart} className="text-red-600 hover:text-red-700 text-sm font-semibold">Clear All</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

              {!showCheckout ? (
                <button onClick={() => setShowCheckout(true)} className="btn-primary w-full">Proceed to Checkout</button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold text-harar-brown">Select Payment Method</h3>
                  <PaymentMethod onSelect={setPaymentMethod} />
                  <button onClick={handleCheckout} disabled={!paymentMethod} className="btn-primary w-full disabled:opacity-50">Place Order</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
