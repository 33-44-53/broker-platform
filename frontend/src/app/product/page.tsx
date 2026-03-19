'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, MapPin, Package, Shield, ArrowLeft, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { mockProducts } from '@/mock-data/products';
import { formatCurrency, calculateDiscount } from '@/utils/helpers';
import { useCart } from '@/contexts/CartContext';

export default function ProductPage() {
  const { addToCart } = useCart();
  const product = mockProducts[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const similarProducts = mockProducts.slice(1, 4);

  return (
    <div className="min-h-screen">
      {/* Header with Background */}
      <div className="relative bg-gradient-to-br from-harar-sand via-harar-cream to-harar-clay pb-8">
        <div className="absolute inset-0">
          <img 
            src="/istockphoto-1459429078-612x612.jpg" 
            alt="Harar crafts" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-white hover:text-harar-gold transition font-semibold drop-shadow-md">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card mb-4">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-96 object-cover rounded-xl" />
            </div>
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx ? 'border-harar-gold' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card">
              <h1 className="text-3xl font-bold text-harar-brown mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? 'fill-harar-gold text-harar-gold' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-harar-brown/70">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                {product.discount ? (
                  <>
                    <span className="text-4xl font-bold text-harar-gold">
                      {formatCurrency(calculateDiscount(product.price, product.discount))}
                    </span>
                    <span className="text-xl text-gray-400 line-through">{formatCurrency(product.price)}</span>
                    <span className="px-3 py-1 bg-harar-rust text-white rounded-full text-sm font-semibold">
                      Save {product.discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-harar-gold">{formatCurrency(product.price)}</span>
                )}
              </div>

              <p className="text-harar-brown/70 mb-6">{product.description}</p>

              <div className="bg-harar-sand/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-harar-gold rounded-full flex items-center justify-center text-white font-bold">
                    {product.artisanName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-harar-brown">{product.artisanName}</p>
                    <div className="flex items-center gap-1 text-sm text-harar-brown/70">
                      <MapPin className="h-4 w-4" />
                      {product.artisanLocation}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-harar-brown font-medium">Availability:</span>
                  <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-harar-brown font-medium">Category:</span>
                  <span className="text-harar-brown/70">{product.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-harar-brown font-medium">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg bg-harar-sand hover:bg-harar-clay hover:text-white transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-harar-brown">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 rounded-lg bg-harar-sand hover:bg-harar-clay hover:text-white transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button onClick={() => addToCart(product, quantity)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                <button className="btn-secondary px-6">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Package, label: 'Fast Delivery' },
                  { icon: Shield, label: 'Secure Payment' },
                  { icon: Star, label: 'Quality Assured' },
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-3 bg-harar-sand/30 rounded-lg">
                    <item.icon className="h-6 w-6 text-harar-gold mx-auto mb-2" />
                    <p className="text-xs text-harar-brown/70">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="card mb-12">
          <h2 className="text-2xl font-bold text-harar-brown mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', rating: 5, comment: 'Beautiful craftsmanship! Exactly as described.', date: '2024-02-15' },
              { name: 'Ahmed Ali', rating: 5, comment: 'High quality product. Fast delivery.', date: '2024-02-10' },
              { name: 'Lisa Chen', rating: 4, comment: 'Great product, slightly smaller than expected.', date: '2024-02-05' },
            ].map((review, idx) => (
              <div key={idx} className="p-4 bg-harar-sand/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-harar-brown">{review.name}</span>
                  <span className="text-sm text-harar-brown/60">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-harar-gold text-harar-gold' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-harar-brown/70">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-harar-brown mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProducts.map((prod) => (
              <div key={prod.id} className="card group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img src={prod.images[0]} alt={prod.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-semibold text-harar-brown mb-2">{prod.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-harar-gold">{formatCurrency(prod.price)}</span>
                  <button className="btn-primary py-2 px-4 text-sm">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
