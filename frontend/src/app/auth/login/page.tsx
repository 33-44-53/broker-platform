'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch('http://localhost/api/controllers/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        const user = data.user;
        if (user.role === 'artisan') {
          router.push('/artisan');
        } else if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/buyer');
        }
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-harar-sand via-harar-cream to-harar-clay flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <ShoppingBag className="h-10 w-10 text-harar-gold" />
            <span className="text-3xl font-bold text-harar-brown">Harar Artisan</span>
          </Link>
          <h1 className="text-2xl font-bold text-harar-brown mb-2">Welcome Back</h1>
          <p className="text-harar-brown/70">Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-harar-brown mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harar-brown/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input-field pl-12 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-harar-brown mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harar-brown/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input-field pl-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {showPassword ? <EyeOff className="h-5 w-5 text-harar-brown/50" /> : <Eye className="h-5 w-5 text-harar-brown/50" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-harar-brown">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-harar-gold hover:text-harar-rust">Forgot password?</Link>
            </div>

            <button type="submit" className="btn-primary w-full">Sign In</button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-harar-brown/70">
              Don't have an account? <Link href="/auth/register" className="text-harar-gold hover:text-harar-rust font-semibold">Register</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-harar-brown/60 mt-6">Demo: artisan@test.com, admin@test.com, buyer@test.com</p>
      </motion.div>
    </div>
  );
}
