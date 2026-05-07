import { motion } from 'motion/react';
import { ArrowRight, Star, MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { cn } from '../lib/utils';

const MAPS_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

export default function Home() {
  return (
    <div className="pt-20 pb-12">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 scale-105"
            alt="Hero BBQ"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-darker via-darker/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-[0.3em] mb-4">
              <span className="w-8 h-px bg-brand" />
              Est. 2024 • Lahore
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold leading-none mb-6">
              TASTE THE <br /> 
              <span className="text-brand">FIRE</span> OF LAHORE
            </h1>
            <p className="text-lg text-white/60 mb-10 max-w-md leading-relaxed">
              Experience the authentic spice of Lahore with our premium BBQ, 
              sizzling Karahis, and hand-crafted fast food.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu" className="btn-primary">
                Order Online <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/menu" className="btn-outline">
                View Menu
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="flex items-center gap-1 text-xl font-bold font-display">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  4.5
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Google Rating</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-xl font-bold font-display">Rs 1k-5k</div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Avg Pricing</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories / Highlights */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold mb-2">OUR SIGNATURE <span className="text-brand">CRAFT</span></h2>
            <p className="text-white/40 max-w-md">Every dish is prepared using traditional recipes with a modern twist for the ultimate Lahore experience.</p>
          </div>
          <Link to="/menu" className="text-brand flex items-center gap-2 font-bold hover:gap-4 transition-all">
            See All Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Glow BBQ', img: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=2070&auto=format&fit=crop' },
            { name: 'Desi Classics', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop' },
            { name: 'Modern Fast Food', img: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=1974&auto=format&fit=crop' }
          ].map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-video rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img src={cat.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-display font-bold">{cat.name}</h3>
                <p className="text-xs text-white/60 tracking-widest uppercase font-bold mt-1">Explore Selection</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-8">VISIT <span className="text-brand">US</span></h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center flex-shrink-0 text-brand">
                    <MapPin />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Our Address</h4>
                    <p className="text-white/60 text-sm">749 Kashmir Block, Allama Iqbal Town, Lahore, Pakistan</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center flex-shrink-0 text-brand">
                    <Phone />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Phone Number</h4>
                    <p className="text-white/60 text-sm">+92 300 1234567</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center flex-shrink-0 text-brand">
                    <Clock />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Opening Hours</h4>
                    <p className="text-white/60 text-sm">Monday - Sunday: 12:00 PM - 02:00 AM</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand transition-colors"><Instagram /></a>
                <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand transition-colors"><Facebook /></a>
              </div>
            </div>

            <div className="h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 relative">
              {MAPS_KEY ? (
                <APIProvider apiKey={MAPS_KEY} version="weekly">
                  <Map
                    defaultCenter={{ lat: 31.5204, lng: 74.3587 }} // Generic Lahore coord, refined below
                    defaultZoom={15}
                    mapId="TWICE_DA_SPICE_MAP"
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <AdvancedMarker position={{ lat: 31.5160, lng: 74.2989 }}> {/* Approx coord for Allama Iqbal Town Kashmir Block */}
                      <Pin background="#E31837" glyphColor="#fff" borderColor="#8B0000" />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-darker">
                  <MapPin className="w-12 h-12 text-brand/20 mb-4" />
                  <h3 className="font-bold mb-2">Google Maps API Key Required</h3>
                  <p className="text-xs text-white/40 max-w-xs mb-6">
                    To see our location map, please add <code>GOOGLE_MAPS_PLATFORM_KEY</code> to your secrets.
                  </p>
                  <a 
                    href="https://console.cloud.google.com/google/maps-apis/start" 
                    target="_blank" 
                    className="text-[10px] uppercase font-bold tracking-widest text-brand hover:underline"
                  >
                    Get API Key
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
