import { useState } from 'react';
import { useMenu } from '../hooks/useMenu';
import FoodCard from '../components/FoodCard';
import { Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Utensils } from 'lucide-react';
import { cn } from '../lib/utils';

const CATEGORIES: Category[] = ["BBQ", "Fast Food", "Chinese", "Desi", "Drinks"];

export default function Menu() {
  const { items, loading } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-display font-bold mb-4 italic">EXPLORE <span className="text-brand">MENU</span></h1>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedCategory('All')}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                selectedCategory === 'All' ? "bg-brand text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                  selectedCategory === cat ? "bg-brand text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search our kitchen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Warming up the grill...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <FoodCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-40">
          <Utensils className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 italic">No items found in this section. Try another selection.</p>
        </div>
      )}
    </div>
  );
}
