'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Star, Heart, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockProducts } from '@/mock-data/products';
import { formatCurrency, calculateDiscount } from '@/utils/helpers';
import { useCart } from '@/contexts/CartContext';

export default function MarketplacePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(mockProducts);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArtisan, setSelectedArtisan] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    fetch('http://localhost/api/controllers/products.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formatted = data.map((p: any) => ({
            ...p,
            id: 'db-' + p.id,
            images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
            isActive: Boolean(p.is_active),
          }));
          setProducts([...mockProducts, ...formatted]);
        }
      })
      .catch(() => setProducts(mockProducts));
  }, []);

  const categories = ['all', 'Baskets', 'Pottery', 'Textiles', 'Leather Goods', 'Jewelry'];
  const artisans = ['all', ...new Set(products.map(p => p.artisanName))];
  const locations = ['all', ...new Set(products.map(p => p.artisanLocation))];

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => selectedArtisan === 'all' || p.artisanName === selectedArtisan)
    .filter(p => selectedLocation === 'all' || p.artisanLocation === selectedLocation)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-harar-cream">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-harar-brown hover:text-harar-gold transition cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back</span>
            </button>
            <h1 className="text-2xl font-bold text-harar-brown">Marketplace</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-harar-sand rounded-lg transition relative">
                <Heart className="h-6 w-6 text-harar-brown" />
                <span className="absolute -top-1 -right-1 bg-harar-rust text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harar-brown/50" />
            <input
              type="text"
              placeholder="Search for traditional baskets, pottery, textiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-harar-sand focus:border-harar-gold focus:outline-none text-harar-brown"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="card sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5 text-harar-brown" />
                <h2 className="text-xl font-semibold text-harar-brown">Filters</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-harar-brown mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === category
                          ? 'bg-harar-gold text-white'
                          : 'bg-harar-sand/50 text-harar-brown hover:bg-harar-sand'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Artisan Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-harar-brown mb-3">Artisan</h3>
                <select
                  value={selectedArtisan}
                  onChange={(e) => setSelectedArtisan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-harar-sand focus:border-harar-gold focus:outline-none text-harar-brown text-sm"
                >
                  {artisans.map((artisan, idx) => (
                    <option key={`artisan-${idx}`} value={artisan}>
                      {artisan === 'all' ? 'All Artisans' : artisan}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-harar-brown mb-3">Location</h3>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-harar-sand focus:border-harar-gold focus:outline-none text-harar-brown text-sm"
                >
                  {locations.map((location, idx) => (
                    <option key={`location-${idx}`} value={location}>
                      {location === 'all' ? 'All Locations' : location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-harar-brown mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-harar-brown/70">
                    <span>0 ETB</span>
                    <span>{priceRange[1]} ETB</span>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h3 className="font-semibold text-harar-brown mb-3">Availability</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-harar-brown">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-harar-brown/70">
                Showing <span className="font-semibold text-harar-brown">{filteredProducts.length}</span> products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-harar-sand focus:border-harar-gold focus:outline-none text-harar-brown"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group card cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {product.discount && (
                      <div className="absolute top-3 right-3 bg-harar-rust text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                      </div>
                    )}
                    <button className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="h-5 w-5 text-harar-gold" />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-harar-brown mb-2 line-clamp-1">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-harar-brown/70">{product.artisanName}</span>
                  </div>

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
                          <span className="text-xl font-bold text-harar-gold">
                            {formatCurrency(calculateDiscount(product.price, product.discount))}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-harar-gold">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => addToCart(product)} className="btn-secondary py-2 px-4 text-sm">
                        Add to Cart
                      </button>
                      <button onClick={() => {
                        addToCart(product);
                        alert('Redirecting to checkout...');
                        window.location.href = '/buyer';
                      }} className="btn-primary py-2 px-4 text-sm">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
