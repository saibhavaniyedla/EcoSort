import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Scan, Gamepad2, MessageSquare, Sprout } from 'lucide-react';
import { View } from '../types';

interface HomeViewProps {
  setCurrentView: (view: View) => void;
}

export default function HomeView({ setCurrentView }: HomeViewProps) {
  return (
    <div className="space-y-24 py-12 animate-in fade-in duration-700">
      {/* Hero */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wide"
        >
          <Sprout size={16} />
          CONSCIOUS ECOLOGY
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface leading-[0.9] font-headline">
          The future is <span className="text-primary italic">Circular.</span>
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-medium">
          Manage your waste with intelligence. Classify items, learn recycling habits, and contribute to a healthier planet.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <button 
            onClick={() => setCurrentView('Scanner')}
            className="bg-primary text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-2"
          >
            Start Scanning
            <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => setCurrentView('AI Chat')}
            className="bg-surface-container-lowest text-on-surface px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:bg-surface-container-low transition-all border border-surface-variant/30"
          >
            Ask Eco-Assistant
          </button>
        </div>
      </section>

      {/* Grid Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Scan size={32} />, title: 'Smart Scanner', desc: 'Instant waste classification using cutting-edge AI.', view: 'Scanner' as View },
          { icon: <Gamepad2 size={32} />, title: 'Eco-Hero Game', desc: 'Master sorting skills through addictive interactive play.', view: 'Game' as View },
          { icon: <MessageSquare size={32} />, title: '24/7 Support', desc: 'Get expert answers to your complex waste questions.', view: 'AI Chat' as View }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setCurrentView(feat.view)}
            className="group p-8 bg-surface-container-lowest rounded-radius-lg border border-surface-variant/30 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              {feat.icon}
            </div>
            <h3 className="text-2xl font-bold font-headline mt-8 mb-3">{feat.title}</h3>
            <p className="text-on-surface-variant leading-relaxed mb-6 font-medium">{feat.desc}</p>
            <div className="flex items-center gap-1.5 text-primary font-bold text-sm tracking-wide group-hover:gap-2.5 transition-all">
              Launch Feature
              <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
