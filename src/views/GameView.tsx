import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Flame, 
  Leaf, 
  Trash2, 
  Sprout, 
  Recycle, 
  GripVertical, 
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Question {
  id: number;
  name: string;
  category: string;
  bin: 'dry' | 'wet' | 'recyclable';
  fact: string;
}

const QUESTION_BANK: Question[] = [
  { id: 1, name: 'Plastic Bottle', category: 'PET Type 1', bin: 'recyclable', fact: 'Plastic is highly recyclable and can be reborn as fiber.' },
  { id: 2, name: 'Apple Core', category: 'Organic', bin: 'wet', fact: 'Organic waste can be turned into nutrient-rich compost.' },
  { id: 3, name: 'Old Newspaper', category: 'Paper', bin: 'dry', fact: 'Dry paper remains recyclable as long as it is not oily.' },
  { id: 4, name: 'Aluminum Can', category: 'Metal', bin: 'recyclable', fact: 'Aluminum can be recycled infinitely without losing quality.' },
  { id: 5, name: 'Banana Peel', category: 'Biowaste', bin: 'wet', fact: 'Biowaste like peels breaks down quickly in wet bins.' },
  { id: 6, name: 'Glass Jar', category: 'Glass', bin: 'recyclable', fact: 'Glass is 100% recyclable and can be reused forever.' },
  { id: 7, name: 'Cotton Shirt', category: 'Textile', bin: 'dry', fact: 'Textiles should be kept dry for proper sorting or reuse.' },
  { id: 8, name: 'Pizza Box', category: 'Cardboard', bin: 'dry', fact: 'Cardboard is dry waste, but avoid oily sections if recycling.' },
  { id: 9, name: 'Used Napkin', category: 'Bio-Solid', bin: 'wet', fact: 'Soft tissues and soiled napkins belong in the wet bin.' },
  { id: 10, name: 'Coffee Grounds', category: 'Organic', bin: 'wet', fact: 'Spent coffee is excellent for composting!' },
];

export default function GameView() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ show: boolean, correct: boolean, message: string }>({ 
    show: false, 
    correct: true,
    message: ''
  });

  // Shuffle questions on mount
  useEffect(() => {
    restartGame();
  }, []);

  const restartGame = () => {
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setFeedback({ show: false, correct: true, message: '' });
  };

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const handleSort = (bin: string) => {
    if (isGameOver || feedback.show) return;

    const isCorrect = bin === currentQuestion.bin;
    
    setFeedback({ 
      show: true, 
      correct: isCorrect, 
      message: isCorrect ? 'Great! Correct answer' : 'Oops! That is incorrect' 
    });

    if (isCorrect) {
      const newStreak = streak + 1;
      setScore(s => s + (50 * newStreak));
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      // Move to next question after delay
      setTimeout(() => {
        setFeedback(f => ({ ...f, show: false }));
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(c => c + 1);
        } else {
          // All questions done? Reshuffle and keep going
          const newShuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
          setQuestions([...questions, ...newShuffled]);
          setCurrentIndex(c => c + 1);
        }
      }, 1800);
    } else {
      // Game Over on first mistake
      setTimeout(() => {
        setIsGameOver(true);
      }, 1800);
    }
  };

  if (isGameOver) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
        <div className="bg-surface-container-lowest p-12 rounded-3xl shadow-2xl border border-surface-variant/30 text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-error" />
          <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-8 text-error">
            <Trophy size={48} className="opacity-50" />
          </div>
          <h2 className="text-4xl font-headline font-black text-on-surface mb-2">Game Over!</h2>
          <p className="text-on-surface-variant font-medium mb-8 italic">Sorting is hard, but you're getting better!</p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-surface-container-low p-4 rounded-xl">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Final Score</p>
              <p className="text-2xl font-black text-primary">{score.toLocaleString()}</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Max Streak</p>
              <p className="text-2xl font-black text-secondary">{streak}</p>
            </div>
          </div>

          <button 
            onClick={restartGame}
            className="w-full bg-primary text-white py-5 rounded-full font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw size={24} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Game Header Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Current Score', value: score.toLocaleString(), icon: <Star className="text-primary fill-current" />, color: 'primary' },
          { label: 'Current Streak', value: streak, icon: <Flame className="text-secondary fill-current" />, color: 'secondary' },
          { label: 'Best Streak', value: bestStreak, icon: <Leaf className="text-tertiary fill-current" />, color: 'tertiary' }
        ].map((stat, i) => (
          <div 
            key={i} 
            className={cn(
              "bg-surface-container-lowest p-6 rounded-lg shadow-sm border-l-4 flex items-center justify-between",
              stat.color === 'primary' ? 'border-primary' : stat.color === 'secondary' ? 'border-secondary' : 'border-tertiary'
            )}
          >
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <h2 className={cn(
                "text-3xl font-headline font-extrabold mt-1",
                stat.color === 'primary' ? 'text-primary' : stat.color === 'secondary' ? 'text-secondary' : 'text-tertiary'
              )}>
                {stat.value}
              </h2>
            </div>
            <div className="opacity-80 scale-125">{stat.icon}</div>
          </div>
        ))}
      </section>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 bg-surface-container-low/50 border border-surface-variant/30 rounded-xl p-8 relative overflow-hidden min-h-[600px]">
        {/* Background Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-30">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-bold text-primary uppercase tracking-widest bg-primary-fixed px-4 py-1.5 rounded-full mb-6 inline-block"
          >
            Level: {streak < 5 ? 'Novice' : streak < 15 ? 'Expert' : 'Eco-Legend'}
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-2">What's this?</h1>
          <p className="text-on-surface-variant font-medium">Sort the item into the correct bin below.</p>
        </div>

        {/* Waste Item Card */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div 
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 100, rotate: 10 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -100, rotate: -10 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
              className="relative group cursor-grab active:cursor-grabbing z-20"
            >
              <div className="w-64 h-64 bg-surface-container-lowest rounded-radius-lg shadow-xl flex flex-col items-center justify-center p-8 border-2 border-surface-variant transition-all hover:border-primary/30 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                  <Leaf size={40} />
                </div>
                <h3 className="text-2xl font-headline font-black text-on-surface leading-tight">{currentQuestion.name}</h3>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-2">{currentQuestion.category}</p>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-surface-container-lowest p-2 rounded-full shadow-md border border-surface-variant group-hover:text-primary transition-colors">
                <GripVertical size={20} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Bins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl pt-8 z-10">
          {[
            { id: 'dry', label: 'Dry Waste', sub: 'Paper, Cloth, Rubber', icon: <Trash2 size={42} />, bg: 'bg-surface-variant/30', hover: 'hover:bg-surface-variant/50', iconColor: 'text-on-surface-variant' },
            { id: 'wet', label: 'Wet Waste', sub: 'Food Scraps, Peels', icon: <Sprout size={42} />, bg: 'bg-tertiary-container/10', hover: 'hover:bg-tertiary-container/20', iconColor: 'text-tertiary' },
            { id: 'recyclable', label: 'Recyclable', sub: 'Glass, Metal, Plastics', icon: <Recycle size={42} />, bg: 'bg-primary-container/10', hover: 'hover:bg-primary-container/20', iconColor: 'text-primary' }
          ].map((bin) => (
            <button 
              key={bin.id}
              disabled={feedback.show}
              onClick={() => handleSort(bin.id)}
              className="group flex flex-col items-center space-y-4 focus:outline-none outline-none disabled:opacity-50"
            >
              <div className={cn(
                "w-full h-40 rounded-t-radius-lg flex flex-col items-center justify-end pb-8 relative transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2",
                bin.bg,
                bin.hover,
              )}>
                <div className={cn("mb-2 transform transition-transform group-hover:scale-110", bin.iconColor)}>
                  {bin.icon}
                </div>
                <div className="w-12 h-1.5 bg-on-surface-variant/10 rounded-full" />
              </div>
              <div className="text-center">
                <p className="text-lg font-headline font-extrabold text-on-surface">{bin.label}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">{bin.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback.show && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={cn(
                "fixed bottom-32 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-8 py-5 rounded-full shadow-2xl border bg-surface-container-lowest",
                feedback.correct ? "border-primary/20" : "border-error/20"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white scale-110",
                feedback.correct ? "bg-primary" : "bg-error animate-shake"
              )}>
                {feedback.correct ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <div>
                <p className={cn(
                  "text-lg font-black leading-tight",
                  feedback.correct ? "text-primary" : "text-error"
                )}>
                  {feedback.message}
                </p>
                <p className="text-sm font-medium text-on-surface-variant mt-0.5">
                  {currentQuestion.fact}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
