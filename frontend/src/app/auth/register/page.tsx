'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as 'buyer' | 'artisan',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch('http://localhost/api/controllers/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          location: formData.location,
          phone: formData.phone,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        if (formData.role === 'artisan') {
          alert('Registration successful! Your account is pending admin verification.');
          router.push('/artisan');
        } else {
          alert('Registration successful!');
          router.push('/buyer');
        }
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-harar-sand via-harar-cream to-harar-clay flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <ShoppingBag className="h-10 w-10 text-harar-gold" />
            <span className="text-3xl font-bold text-harar-brown">Harar Artisan</span>
          </Link>
          <h1 className="text-2xl font-bold text-harar-brown mb-2">Create Account</h1>
          <p className="text-harar-brown/70">Join our artisan community</p>
        </div>

        <div className="card">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFormData({ ...formData, role: 'buyer' })}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                formData.role === 'buyer' ? 'bg-harar-gold text-white' : 'bg-harar-sand text-harar-brown'
              }`}
            >
              I'm a Buyer
            </button>
            <button
              onClick={() => setFormData({ ...formData, role: 'artisan' })}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                formData.role === 'artisan' ? 'bg-harar-gold text-white' : 'bg-harar-sand text-harar-brown'
              }`}
            >
              I'm an Artisan
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-harar-brown mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harar-brown/50" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`input-field pl-12 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-harar-brown mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harar-brown/50" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`input-field pl-12 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-harar-brown mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harar-brown/50" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field pl-12"
                    placeholder="+251 912 345 678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-harar-brown mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harar-brown/50" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field pl-12"
                    placeholder="Harar, Ethiopia"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-harar-brown mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harar-brown/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`input-field pl-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {showPassword ? <EyeOff className="h-5 w-5 text-harar-brown/50" /> : <Eye className="h-5 w-5 text-harar-brown/50" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-harar-brown mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harar-brown/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`input-field pl-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" required />
              <span className="text-sm text-harar-brown">I agree to the Terms of Service and Privacy Policy</span>
            </label>

            <button type="submit" className="btn-primary w-full">Create Account</button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-harar-brown/70">
              Already have an account? <Link href="/auth/login" className="text-harar-gold hover:text-harar-rust font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
