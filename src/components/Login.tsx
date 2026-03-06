import React, { useState } from 'react';
import { X, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onClose: () => void;
  onLogin: (user: { name: string; email: string }) => void;
}

export default function Login({ onClose, onLogin }: LoginProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onLogin({ name, email });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-[2rem] shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100">Welcome Back</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">Join the Hamro Sathi community</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:text-stone-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:text-stone-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:text-stone-100"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center gap-2 group mt-6"
            >
              Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Don't have an account? <button className="text-emerald-600 font-bold hover:underline">Sign Up</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
