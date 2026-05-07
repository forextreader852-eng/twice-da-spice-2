import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import WhatsAppButton from './components/WhatsAppButton';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-dark text-white selection:bg-brand selection:text-white">
          <Navbar />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          <Footer />
          <Chatbot />
          <WhatsAppButton />
        </div>
      </CartProvider>
    </Router>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-darker">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display font-bold text-xl tracking-tighter">TWICE DA <span className="text-brand">SPICE</span></h3>
            <p className="text-white/40 text-xs mt-1">© 2024 Twice Da Spice. All Rights Reserved.</p>
          </div>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-white/40">
            <Link to="/menu" className="hover:text-brand transition-colors">Menu</Link>
            <Link to="/admin" className="hover:text-brand transition-colors">Admin Portal</Link>
            <a href="#" className="hover:text-brand transition-colors">Privacy Policy</a>
          </div>
          <div className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">
            Developed in Lahore, Pakistan
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;
