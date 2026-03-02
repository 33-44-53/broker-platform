'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-harar-sand via-harar-cream to-harar-clay flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <ShoppingBag className="h-10 w-10 text-harar-gold" />
            <span className="text-3xl font-bold text-harar-brown">Harar Artisan</span>
          </Link>
          <h1 className="text-2xl font-bold text-harar-brown mb-2">Reset Password</h1>
          <p className="text-harar-brown/70">Enter your email to receive reset instructions</p>
        </div>

        <div className="card">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-harar-brown mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-harar-brown/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">Send Reset Link</button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-harar-brown mb-2">Check Your Email</h3>
              <p className="text-harar-brown/70 mb-6">
                We've sent password reset instructions to <span className="font-semibold">{email}</span>
              </p>
              <Link href="/auth/login" className="btn-primary inline-block">Back to Login</Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="flex items-center justify-center gap-2 text-harar-gold hover:text-harar-rust">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
