import { Link } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, User, X, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-darker/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <UtensilsCrossed className="w-8 h-8 text-brand transition-transform group-hover:rotate-12" />
          <div>
            <span className="text-xl font-display font-bold tracking-tighter">TWICE DA <span className="text-brand">SPICE</span></span>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium leading-none">Premium Lahore Kitchen</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-brand transition-colors">Home</Link>
          <Link to="/menu" className="text-sm font-medium hover:text-brand transition-colors">Menu</Link>
          <Link to="/admin" className="text-sm font-medium hover:text-brand transition-colors">Admin</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-darker">
                {cartCount}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-darker border-b border-white/10 p-4 md:hidden flex flex-col gap-4 shadow-2xl"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:bg-white/5 rounded-xl transition-colors">Home</Link>
            <Link to="/menu" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:bg-white/5 rounded-xl transition-colors">Menu</Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:bg-white/5 rounded-xl transition-colors">Admin</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
