import React, { useState, useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { Order, MenuItem, OperationType } from '../types';
import { formatPKR, handleFirestoreError, cn } from '../lib/utils';
import { 
  BarChart3, 
  Package, 
  Settings, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Admin() {
  const { user, isAdmin, loading, login, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'stats'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'BBQ',
    image: '',
    isAvailable: true
  });

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      fetchMenu();
    }
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMenu = async () => {
    try {
      const snap = await getDocs(collection(db, 'menu'));
      setMenuItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)));
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      fetchOrders();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'orders');
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'menu', id));
      fetchMenu();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'menu');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'menu'), formData);
      setIsAddingItem(false);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'BBQ',
        image: '',
        isAvailable: true
      });
      fetchMenu();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'menu');
    }
  };

  if (loading) return (
    <div className="pt-32 flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin w-12 h-12 border-4 border-brand border-t-transparent rounded-full" />
    </div>
  );

  if (!user || !isAdmin) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 max-w-md flex flex-col items-center justify-center min-h-[70vh]">
        <div className="premium-card p-10 w-full text-center">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4 italic">ADMIN <span className="text-brand">ACCESS</span></h1>
          <p className="text-white/40 text-sm mb-8">This portal is reserved for management. Please sign in with an authorized account.</p>
          {!user ? (
            <button onClick={login} className="btn-primary w-full">Sign in with Google</button>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-red-500">Account <strong>{user.email}</strong> is not authorized.</p>
              <button onClick={logout} className="btn-outline w-full">Use Different Account</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-5xl font-display font-bold italic uppercase">DASHBOARD</h1>
            <span className="bg-brand text-[10px] font-bold px-2 py-0.5 rounded tracking-[0.2em] uppercase">Control Center</span>
          </div>
          <p className="text-white/40 text-sm uppercase tracking-[0.1em] font-medium">Welcome back, {user.displayName}</p>
        </div>
        <button onClick={logout} className="btn-outline px-4 py-2 text-xs border-brand/20 text-brand">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'orders', label: 'Live Orders', icon: Package, count: orders.filter(o => o.status === 'pending').length },
            { id: 'menu', label: 'Manage Menu', icon: Settings, count: menuItems.length },
            { id: 'stats', label: 'Business Stats', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl transition-all font-bold text-sm tracking-tight",
                activeTab === tab.id ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-white/5 hover:bg-white/10 text-white/60"
              )}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </div>
              {tab.count !== undefined && (
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full",
                  activeTab === tab.id ? "bg-white text-brand" : "bg-white/10 text-white"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 min-h-[60vh]">
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="font-bold flex items-center gap-2"><Clock className="w-4 h-4 text-brand" /> Pending Queue</h3>
                <button onClick={fetchOrders} className="text-xs text-brand hover:underline font-bold uppercase tracking-widest">Refresh</button>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                  <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40">No orders in the system yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="premium-card p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pt-2">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-lg">{order.customerName}</h4>
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-widest",
                              order.status === 'pending' ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" :
                              order.status === 'preparing' ? "text-blue-500 border-blue-500/20 bg-blue-500/5" :
                              order.status === 'delivered' ? "text-green-500 border-green-500/20 bg-green-500/5" :
                              "text-white/20 border-white/10"
                            )}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-white/40 mb-1">{order.phone} • {order.address}</p>
                          <p className="text-[10px] text-brand/60 font-bold">ID: {order.orderId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-brand">{formatPKR(order.totalAmount)}</p>
                          <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Total Amount</p>
                        </div>
                      </div>

                      <div className="bg-black/20 rounded-xl p-4 mb-6">
                        <p className="text-[10px] uppercase font-bold text-white/20 mb-3 tracking-widest">Items Ordered</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-white/60"><span className="text-brand font-bold mr-2">{item.quantity}x</span> {item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id!, 'preparing')} className="btn-primary py-2 text-xs flex-1">Mark Preparing</button>}
                        {order.status === 'preparing' && <button onClick={() => updateOrderStatus(order.id!, 'delivered')} className="btn-primary py-2 text-xs flex-1 bg-green-600 hover:bg-green-700">Mark Delivered</button>}
                        <button onClick={() => updateOrderStatus(order.id!, 'cancelled')} className="btn-outline py-2 text-xs flex-1 border-white/10">Cancel Order</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="font-bold flex items-center gap-2"><Settings className="w-4 h-4 text-brand" /> Menu Library</h3>
                <button 
                  onClick={() => setIsAddingItem(true)} 
                  className="btn-primary py-1.5 px-4 text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              <AnimatePresence>
                {isAddingItem && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleAddItem} className="premium-card p-6 space-y-4 border-brand/20">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-brand mb-4">Add New Delight</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          required
                          type="text" 
                          placeholder="Item Name" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand outline-none transition-colors"
                        />
                        <input 
                          required
                          type="number" 
                          placeholder="Price (PKR)" 
                          value={formData.price || ''}
                          onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand outline-none transition-colors"
                        />
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value as any})}
                          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand outline-none transition-colors"
                        >
                          <option value="BBQ">BBQ</option>
                          <option value="Fast Food">Fast Food</option>
                          <option value="Chinese">Chinese</option>
                          <option value="Desi">Desi</option>
                          <option value="Drinks">Drinks</option>
                        </select>
                        <input 
                          required
                          type="url" 
                          placeholder="Image URL" 
                          value={formData.image}
                          onChange={e => setFormData({...formData, image: e.target.value})}
                          className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand outline-none transition-colors"
                        />
                      </div>
                      <textarea 
                        required
                        placeholder="Description" 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand outline-none transition-colors h-24 resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setIsAddingItem(false)} className="btn-outline py-2 text-xs">Cancel</button>
                        <button type="submit" className="btn-primary py-2 text-xs">Save Item</button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menuItems.map(item => (
                  <div key={item.id} className="premium-card p-4 flex gap-4">
                    <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className="font-bold truncate text-sm">{item.name}</h4>
                        <button onClick={() => deleteMenuItem(item.id!)} className="text-white/20 hover:text-brand">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-white/40 mb-2">{item.category}</p>
                      <p className="font-bold text-brand text-xs">{formatPKR(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Revenue', value: formatPKR(orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0)), icon: TrendingUp },
                  { label: 'Total Orders', value: orders.length, icon: Package },
                  { label: 'Avg Order', value: formatPKR(orders.length ? orders.reduce((s, o) => s + o.totalAmount, 0) / orders.length : 0), icon: BarChart3 }
                ].map((stat, i) => (
                  <div key={i} className="premium-card p-6">
                    <stat.icon className="w-6 h-6 text-brand mb-4" />
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="premium-card p-8 text-center text-white/20 italic text-sm">
                Advanced analytics and charts will appear here as more orders come in.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
