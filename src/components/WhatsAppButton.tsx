import { Phone } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhatsAppButton() {
  const phoneNumber = "923001234567";
  const message = "Hi Twice Da Spice! I'd like to ask about the menu.";
  
  return (
    <motion.a 
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-24 right-6 z-[90] bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform group"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-8 h-8" alt="WhatsApp" />
      <span className="absolute right-full mr-4 bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-2px] shadow-xl pointer-events-none after:content-[''] after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:border-8 after:border-transparent after:border-l-white">
        Order via WhatsApp
      </span>
    </motion.a>
  );
}
