import { Plus, Clock, Star } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../hooks/useCart';
import { formatPKR } from '../lib/utils';
import { motion } from 'motion/react';

interface Props {
  item: MenuItem;
}

export default function FoodCard({ item }: Props) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="premium-card group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 right-3 bg-dark/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 text-[10px] font-bold">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          4.5
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-brand transition-colors">{item.name}</h3>
          <span className="text-brand font-bold whitespace-nowrap">{formatPKR(item.price)}</span>
        </div>
        <p className="text-white/40 text-xs line-clamp-2 mb-4 h-8">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-white/30 font-medium uppercase tracking-wider">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 25m</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>{item.category}</span>
          </div>
          <button 
            onClick={() => addToCart(item)}
            className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center hover:bg-brand-hover transition-all active:scale-90"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
