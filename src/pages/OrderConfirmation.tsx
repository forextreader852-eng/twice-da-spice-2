import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Order } from '../types';
import { CheckCircle, Package, MapPin, Phone, ArrowRight, Loader2, Clock } from 'lucide-react';
import { formatPKR } from '../lib/utils';
import { motion } from 'motion/react';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const getDeliveryEstimate = () => {
    if (!order?.createdAt) return "45-60 mins";
    
    // Firestore timestamp to JS Date
    const date = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
    const minTime = new Date(date.getTime() + 45 * 60000);
    const maxTime = new Date(date.getTime() + 60 * 60000);

    const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    return `${formatTime(minTime)} - ${formatTime(maxTime)}`;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'orders', id));
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-brand animate-spin" />
        <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Verifying Order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 text-center py-20 px-4">
        <h1 className="text-3xl font-bold mb-4 font-display">Order Not Found</h1>
        <p className="text-white/40 mb-8">We couldn't find the order you're looking for.</p>
        <Link to="/" className="btn-primary inline-flex">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 max-w-3xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex w-20 h-20 bg-green-500/10 text-green-500 rounded-full items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-5xl font-display font-bold mb-2">ORDER <span className="text-brand">PLACED!</span></h1>
        <p className="text-white/40">Your order #{order.orderId} has been received.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="premium-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-brand" /> Order Info
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">Status</span>
              <span className="capitalize text-brand font-bold">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Items</span>
              <span>{order.items.length} units</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-white/5">
              <span>Total Paid</span>
              <span>{formatPKR(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="premium-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-brand">
            <MapPin className="w-4 h-4 text-brand" /> Delivery Details
          </h3>
          <div className="space-y-3 text-sm">
            <p className="font-medium text-white/80">{order.customerName}</p>
            <p className="text-white/60 flex items-center gap-2"><Phone className="w-3 h-3" /> {order.phone}</p>
            <p className="text-white/60 leading-relaxed italic">{order.address}</p>
          </div>
        </div>

        <div className="premium-card p-6 border-brand/30 bg-brand/5">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-brand">
            <Clock className="w-4 h-4 text-brand" /> Arriving By
          </h3>
          <div className="flex flex-col items-center justify-center h-full pb-4">
            <span className="text-2xl font-display font-bold text-white mb-1">{getDeliveryEstimate()}</span>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Estimated Window</p>
          </div>
        </div>
      </div>

      <div className="premium-card p-8 text-center bg-white/5 border-white/10">
        <h4 className="font-bold text-xl mb-4 italic font-display">WHAT'S <span className="text-brand">NEXT?</span></h4>
        <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
          Our chef is warming up the grill! You'll receive a call from our rider 
          once the order is out for delivery. Estimated delivery between <strong>{getDeliveryEstimate()}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.open(`https://wa.me/923001234567?text=Hi, searching for status of order ${order.orderId}`)} 
            className="btn-outline w-full sm:w-auto"
          >
            Track via WhatsApp
          </button>
          <Link to="/menu" className="btn-primary w-full sm:w-auto">
            Order More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
