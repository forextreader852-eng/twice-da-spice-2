import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { formatPKR, handleFirestoreError } from '../lib/utils';
import { OperationType } from '../types';
import { Loader2, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || loading) return;

    setLoading(true);
    const orderId = 'TS-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    try {
      const orderData = {
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        items,
        totalAmount: total + 150,
        status: 'pending',
        createdAt: serverTimestamp(),
        orderId,
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      navigate(`/confirmation/${docRef.id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h1 className="text-5xl font-display font-bold italic">CHECKOUT</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Full Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Phone Number</label>
              <input 
                required
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+92 3XX XXXXXXX"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Delivery Address</label>
              <textarea 
                required
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Full address in Lahore"
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-colors resize-none"
              />
            </div>

            <div className="p-6 bg-brand/5 border border-brand/20 rounded-2xl">
              <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
                Payment Method
              </h4>
              <p className="text-white/60 text-xs">Currently we only accept <strong>Cash on Delivery</strong> across Lahore. Please have the exact change ready for the rider.</p>
            </div>

            <button 
              disabled={loading}
              className="btn-primary w-full h-16 text-lg"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Place Order <Send className="w-5 h-5 ml-2" /></>}
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 1 }}
          className="lg:pl-12"
        >
          <div className="premium-card p-8">
            <h3 className="text-xl font-display font-bold mb-6 italic">ORDER <span className="text-brand">DETAILS</span></h3>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-brand font-bold">{item.quantity}x</span>
                    <span className="text-white/80">{item.name}</span>
                  </div>
                  <span className="font-medium">{formatPKR(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <div className="h-px bg-white/10 my-6" />
              
              <div className="flex justify-between text-white/40 text-sm">
                <span>Subtotal</span>
                <span>{formatPKR(total)}</span>
              </div>
              <div className="flex justify-between text-white/40 text-sm">
                <span>Delivery</span>
                <span>Rs 150</span>
              </div>
              <div className="flex justify-between items-baseline pt-4">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-brand">{formatPKR(total + 150)}</span>
              </div>
            </div>
            
            <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold text-center">
              By placing an order, you agree to our Terms of Service
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
