'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'buyer' });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost/api/controllers/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginData.email,
          password: loginData.password,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        router.push(data.user.role === 'artisan' ? '/artisan' : data.user.role === 'admin' ? '/admin' : '/buyer');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const res = await fetch('http://localhost/api/controllers/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          role: signupData.role,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('currentUser', JSON.stringify({ id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role }));
        router.push(signupData.role === 'artisan' ? '/artisan' : '/buyer');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-harar-sand via-harar-cream to-harar-clay">
      <div className="w-[900px] h-[550px] bg-white shadow-2xl rounded-2xl overflow-hidden flex">
        
        {/* LEFT PANEL - Image */}
        <div
          className={`w-[260px] flex-shrink-0 bg-cover bg-center transition-all duration-700 ${
            isSignup ? 'order-2' : 'order-1'
          }`}
          style={{ backgroundImage: "url('/istockphoto-1459429078-612x612.jpg')" }}
        >
          <div className="w-full h-full bg-harar-brown/60 flex flex-col items-center justify-center text-white text-center px-4">
            {!isSignup ? (
              <>
                <h1 className="text-2xl font-bold mb-2">New here?</h1>
                <p className="text-sm mb-6">Sign up and discover artisan treasures</p>
                <button
                  onClick={() => setIsSignup(true)}
                  className="border-2 border-white rounded-full px-6 py-2 uppercase text-sm hover:bg-white hover:text-harar-brown transition"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2">One of us?</h1>
                <p className="text-sm mb-6">Just sign in to continue</p>
                <button
                  onClick={() => setIsSignup(false)}
                  className="border-2 border-white rounded-full px-6 py-2 uppercase text-sm hover:bg-white hover:text-harar-brown transition"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Forms */}
        <div className={`flex-1 flex items-center justify-center p-12 transition-all duration-700 ${isSignup ? 'order-1' : 'order-2'}`}>
          {!isSignup ? (
            <div key="signin" className="w-full max-w-[260px] animate-fade-in">
              <h2 className="text-3xl text-harar-brown font-bold text-center mb-8">Sign In</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-harar-brown uppercase">Email Address</label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full border-2 border-harar-sand rounded-lg mt-1 text-left outline-none focus:border-harar-gold py-2 px-3"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-harar-brown uppercase">Password</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full border-2 border-harar-sand rounded-lg mt-1 text-left outline-none focus:border-harar-gold py-2 px-3"
                    required
                  />
                </div>

                <button type="submit" className="w-full h-10 bg-harar-gold text-white rounded-full mt-6 hover:bg-harar-rust transition font-semibold">
                  Sign In
                </button>
              </form>
            </div>
          ) : (
            <div key="signup" className="w-full max-w-[260px] animate-fade-in">
              <h2 className="text-3xl text-harar-brown font-bold text-center mb-4">Sign Up</h2>
              <form onSubmit={handleSignup} className="space-y-2">
                <div>
                  <label className="text-sm font-semibold text-harar-brown uppercase">Name</label>
                  <input
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    className="w-full border-2 border-harar-sand rounded-lg mt-1 text-left outline-none focus:border-harar-gold py-2 px-3"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-harar-brown uppercase">Email</label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full border-2 border-harar-sand rounded-lg mt-1 text-left outline-none focus:border-harar-gold py-2 px-3"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-harar-brown uppercase">Role</label>
                  <select
                    value={signupData.role}
                    onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                    className="w-full border-2 border-harar-sand rounded-lg mt-1 text-left outline-none focus:border-harar-gold py-2 px-3 bg-transparent"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="artisan">Artisan</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-harar-brown uppercase">Password</label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="w-full border-2 border-harar-sand rounded-lg mt-1 text-left outline-none focus:border-harar-gold py-2 px-3"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-harar-brown uppercase">Confirm Password</label>
                  <input
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className="w-full border-2 border-harar-sand rounded-lg mt-1 text-left outline-none focus:border-harar-gold py-2 px-3"
                    required
                  />
                </div>

                <button type="submit" className="w-full h-10 bg-harar-gold text-white rounded-full mt-4 hover:bg-harar-rust transition font-semibold">
                  Sign Up Now
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
