'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, TrendingUp, Star, MapPin, Heart, Menu, X } from 'lucide-react';
import { mockProducts } from '@/mock-data/products';
import { formatCurrency, calculateDiscount } from '@/utils/helpers';
import { useProducts } from '@/contexts/ProductContext';
import { useState } from 'react';

export default function Home() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-white drop-shadow-md" />
              <span className="text-2xl font-bold text-white drop-shadow-lg">Harar Artisan</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/marketplace" className="text-white hover:text-harar-gold transition font-medium drop-shadow-md">
                Marketplace
              </Link>
              <Link href="/auction" className="text-white hover:text-harar-gold transition font-medium drop-shadow-md">
                Auctions
              </Link>
              <Link href="/artisan" className="text-white hover:text-harar-gold transition font-medium drop-shadow-md">
                For Artisans
              </Link>
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex space-x-4">
              <Link href="/auth" className="px-6 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-harar-brown transition font-semibold backdrop-blur-sm">
                Login
              </Link>
              <Link href="/auth" className="px-6 py-2 bg-harar-gold hover:bg-harar-rust text-white rounded-full transition font-semibold shadow-lg hover:shadow-xl">
                Get Started
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white drop-shadow-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-harar-brown/95 backdrop-blur-md rounded-b-2xl pb-4 px-4"
            >
              <div className="flex flex-col space-y-3 pt-2">
                <Link href="/marketplace" className="text-white hover:text-harar-gold transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Marketplace
                </Link>
                <Link href="/auction" className="text-white hover:text-harar-gold transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Auctions
                </Link>
                <Link href="/artisan" className="text-white hover:text-harar-gold transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  For Artisans
                </Link>
                <div className="flex flex-col space-y-2 pt-2 border-t border-white/20">
                  <Link href="/auth" className="px-6 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-harar-brown transition font-semibold text-center" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/auth" className="px-6 py-2 bg-harar-gold hover:bg-harar-rust text-white rounded-full transition font-semibold text-center" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-harar-sand via-harar-cream to-harar-clay py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/istockphoto-1459429078-612x612.jpg" 
            alt="Harar crafts" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Discover Authentic
              <span className="block text-harar-gold drop-shadow-lg">Harar Craftsmanship</span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
              Connect directly with skilled artisans from Harar City. Find unique, handcrafted treasures that tell a story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace" className="btn-primary text-lg">
                Explore Marketplace
              </Link>
              <Link href="/auth/register?role=artisan" className="btn-secondary text-lg">
                Become an Artisan
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { icon: Users, label: 'Active Artisans', value: '150+' },
              { icon: ShoppingBag, label: 'Products Listed', value: '1,200+' },
              { icon: TrendingUp, label: 'Happy Customers', value: '5,000+' },
            ].map((stat, index) => (
              <div key={index} className="card text-center">
                <stat.icon className="h-12 w-12 text-harar-gold mx-auto mb-4" />
                <div className="text-3xl font-bold text-harar-brown mb-2">{stat.value}</div>
                <div className="text-harar-brown/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-harar-brown mb-4">Featured Artisan Works</h2>
            <p className="text-harar-brown/70 text-lg">Handpicked treasures from our talented artisans</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group card cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {product.discount && (
                    <div className="absolute top-4 right-4 bg-harar-rust text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                  <button className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-5 w-5 text-harar-gold" />
                  </button>
                </div>

                <h3 className="text-xl font-semibold text-harar-brown mb-2">{product.name}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-harar-clay" />
                  <span className="text-sm text-harar-brown/70">{product.artisanLocation}</span>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-harar-gold text-harar-gold'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-harar-brown/70 ml-2">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {product.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-harar-gold">
                          {formatCurrency(calculateDiscount(product.price, product.discount))}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-harar-gold">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                  <button className="btn-primary py-2 px-4 text-sm">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/marketplace" className="btn-secondary text-lg">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-harar-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-harar-brown mb-4">What Our Community Says</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Buyer',
                text: 'The quality of craftsmanship is outstanding. I love supporting local artisans!',
                rating: 5,
              },
              {
                name: 'Fatima Ahmed',
                role: 'Artisan',
                text: 'This platform has helped me reach customers I never could have before.',
                rating: 5,
              },
              {
                name: 'Ahmed Ali',
                role: 'Buyer',
                text: 'Authentic products with great stories. The delivery was fast and secure.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-harar-gold text-harar-gold" />
                  ))}
                </div>
                <p className="text-harar-brown/80 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="font-semibold text-harar-brown">{testimonial.name}</div>
                <div className="text-sm text-harar-brown/60">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-harar-brown text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ShoppingBag className="h-8 w-8 text-harar-gold" />
                <span className="text-xl font-bold">Harar Artisan</span>
              </div>
              <p className="text-white/70">Connecting artisans with the world</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Marketplace</h3>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/marketplace">Browse Products</Link></li>
                <li><Link href="/auction">Live Auctions</Link></li>
                <li><Link href="/artisan">Featured Artisans</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-white/70">
                <li><Link href="#">Help Center</Link></li>
                <li><Link href="#">Contact Us</Link></li>
                <li><Link href="#">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-white/70">
                <li>Email: info@hararartisan.com</li>
                <li>Phone: +251 25 666 1234</li>
                <li>Harar, Ethiopia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
            <p>&copy; 2024 Harar Artisan Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
