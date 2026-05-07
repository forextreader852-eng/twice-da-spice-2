import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatPKR } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 min-h-[70vh] flex flex-col items-center justify-center">
        <ShoppingBag className="w-16 h-16 text-white/5 mb-6" />
        <h1 className="text-3xl font-display font-bold mb-4">Your cart is empty</h1>
        <p className="text-white/40 mb-8 text-center max-w-xs">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/menu" className="btn-primary">
          Explore Menu <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
      <h1 className="text-5xl font-display font-bold mb-12 italic">YOUR <span className="text-brand">CART</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="premium-card p-4 flex gap-4"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold truncate pr-4">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id!)} className="text-white/20 hover:text-brand transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-white/30">{item.category}</p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id!, -1)}
                        className="p-1 hover:text-brand transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id!, 1)}
                        className="p-1 hover:text-brand transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-brand">{formatPKR(item.price * item.quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="premium-card p-6 sticky top-32">
            <h3 className="text-xl font-display font-bold mb-6 italic">ORDER <span className="text-brand">SUMMARY</span></h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Subtotal</span>
                <span>{formatPKR(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Delivery Fee</span>
                <span>Rs 150</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-brand">{formatPKR(total + 150)}</span>
              </div>
            </div>
            
            <Link to="/checkout" className="btn-primary w-full">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">We accept</p>
              <div className="flex gap-4 opacity-30 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" />
              </div>
              <p className="text-[10px] text-brand/60 uppercase tracking-widest font-bold mt-2">Cash on Delivery Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
