import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudUpload, 
  Image as ImageIcon, 
  X, 
  Recycle, 
  Trash2, 
  ArrowRight, 
  Leaf, 
  Wallet, 
  Lightbulb,
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from '../lib/utils';
import { AnalysisResult } from '../types';

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ScannerProps {
  persistedResult: AnalysisResult | null;
  setPersistedResult: (res: AnalysisResult | null) => void;
  persistedFile: File | null;
  setPersistedFile: (file: File | null) => void;
  persistedPreview: string | null;
  setPersistedPreview: (prev: string | null) => void;
}

export default function ScannerView({
  persistedResult,
  setPersistedResult,
  persistedFile,
  setPersistedFile,
  persistedPreview,
  setPersistedPreview
}: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeImage = async (file: File) => {
    setIsScanning(true);
    setError(null);
    setPersistedResult(null);

    try {
      // Read file as base64
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: file.type,
                },
              },
              {
                text: "Identify the waste item in this image. Provide its classification, confidence score (percentage 0-100), detailed disposal suggestions/instructions, detected material, eco points (number 5-50), and estimated carbon offset (e.g. '0.4kg of CO2'). Strictly categorize the binType as either 'recyclable', 'dry', or 'wet'. Return the result strictly as a single JSON object.",
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              classification: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              disposalInstructions: { type: Type.STRING },
              detectedMaterial: { type: Type.STRING },
              points: { type: Type.NUMBER },
              carbonOffset: { type: Type.STRING },
              binType: { type: Type.STRING, enum: ['recyclable', 'dry', 'wet'] },
            },
            required: ["classification", "confidence", "disposalInstructions", "detectedMaterial", "points", "carbonOffset", "binType"],
          },
        },
      });

      const analysisRaw = response.text;
      const analysis: AnalysisResult = JSON.parse(analysisRaw);
      setPersistedResult(analysis);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setPersistedFile(selectedFile);
      setPersistedPreview(URL.createObjectURL(selectedFile));
      analyzeImage(selectedFile);
    }
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      {/* Hero Section - Image removed per user request */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-8">
        <div className="space-y-8">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-1.5 bg-primary-fixed text-primary font-bold rounded-full text-xs tracking-wide inline-block"
          >
            SMART CLASSIFICATION
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.1] font-headline"
          >
            Identify waste with <br />
            <span className="text-primary italic">Precision.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-on-surface-variant leading-relaxed max-w-xl font-medium"
          >
            Our EcoSort AI utilizes advanced neural networks to categorize your items in real-time. Simply upload a photo to receive instant sorting guidance.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-10 pt-4"
          >
            <div className="flex flex-col">
              <span className="text-4xl font-black text-primary tabular-nums">99.2%</span>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Accuracy</span>
            </div>
            <div className="w-px h-12 bg-surface-variant" />
            <div className="flex flex-col">
              <span className="text-4xl font-black text-primary tabular-nums">&lt;2s</span>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Detection</span>
            </div>
          </motion.div>
        </div>
        <div className="hidden lg:block">
          {/* Info part kept, image removed */}
          <div className="bg-surface-container-low/40 p-8 rounded-radius-lg border border-surface-variant/30 backdrop-blur-sm space-y-4">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              AI Intelligence
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
              We process every image through our specialized environmental datasets to ensure accurate material recognition and disposal pathing. 
              Our goal is to help you achieve a 100% circular waste flow.
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Col: Upload/Preview */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          
          {!persistedPreview ? (
            <motion.button 
              whileHover={{ scale: 1.005, backgroundColor: 'var(--color-surface-container-low)' }}
              whileTap={{ scale: 0.995 }}
              onClick={onUploadClick}
              className="group bg-surface-container-lowest rounded-radius-lg p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-surface-variant hover:border-primary/50 transition-all duration-300 min-h-[400px] w-full"
            >
              <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                <CloudUpload className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-3xl font-extrabold mb-3 font-headline">Drop your image here</h3>
              <p className="text-on-surface-variant mb-10 max-w-sm text-base font-medium">Support JPG, PNG or WEBP. Ensure the object is well-lit for optimal detection results.</p>
              <div className="bg-primary text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all text-lg">
                Select from Device
              </div>
            </motion.button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-low rounded-radius-lg p-8 grid grid-cols-1 sm:grid-cols-2 gap-10 items-center relative overflow-hidden"
            >
              <div className="relative rounded-xl overflow-hidden aspect-square shadow-2xl border border-surface-variant/30">
                <img src={persistedPreview} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => { setPersistedPreview(null); setPersistedFile(null); setPersistedResult(null); setError(null); }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white transition-colors text-error shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <ImageIcon size={20} className="text-primary" />
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Image Analysis</span>
                </div>
                <h4 className="text-2xl font-bold font-headline truncate">{persistedFile?.name || 'Processing...'}</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-on-surface-variant">Scanning Status</span>
                    <span className="text-primary">
                      {isScanning ? `${Math.floor(Math.random() * 20 + 70)}%` : '100%'}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-surface-variant/40 rounded-full overflow-hidden p-1 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: isScanning ? '85%' : '100%' }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        isScanning ? "bg-primary/60" : "bg-primary"
                      )}
                    />
                  </div>
                </div>

                {isScanning ? (
                  <div className="flex items-center gap-3 text-primary font-bold animate-pulse">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm">Neural Engine processing...</span>
                  </div>
                ) : persistedResult ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-2"
                  >
                    <button 
                      onClick={onUploadClick}
                      className="text-sm font-bold text-primary flex items-center gap-2 hover:underline"
                    >
                      <CloudUpload size={18} />
                      Upload New
                    </button>
                    <p className="text-sm font-bold text-primary flex items-center gap-2 mt-2">
                      <CheckCircle2 size={18} />
                      Detection complete. Results ready!
                    </p>
                  </motion.div>
                ) : error ? (
                  <p className="text-sm font-bold text-error">{error}</p>
                ) : null}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Col: AI Insights */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!persistedResult ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-surface-container-low/30 rounded-radius-lg border border-surface-variant border-dashed"
              >
                <div className="w-20 h-20 rounded-full bg-surface-variant/30 flex items-center justify-center mb-6">
                  {isScanning ? <Loader2 size={32} className="text-primary animate-spin" /> : <Sparkles size={32} className="text-on-surface-variant/40" />}
                </div>
                <h4 className="text-xl font-bold font-headline mb-2 text-on-surface">
                  {isScanning ? "Analyzing..." : "Awaiting Input"}
                </h4>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                  {isScanning ? "Our neural networks are identifying materials and disposal routes..." : "Upload an image of a waste item to see detailed information and impact."}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex flex-col gap-6 h-full"
              >
                {/* Result Card */}
                <div className={cn(
                  "rounded-radius-lg p-8 text-on-secondary-container flex flex-col gap-8 flex-1 transition-colors duration-500",
                  persistedResult.binType === 'recyclable' ? "bg-secondary-container" : 
                  persistedResult.binType === 'wet' ? "bg-tertiary-container/20 text-tertiary border-2 border-tertiary/20" : 
                  "bg-surface-container-high text-on-surface shadow-sm border border-surface-variant/30"
                )}>
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-current/10 backdrop-blur-md rounded-lg">
                      {persistedResult.binType === 'recyclable' ? <Recycle size={32} /> : <Trash2 size={32} />}
                    </div>
                    <div className="bg-current/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                      Category: {persistedResult.binType}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold opacity-70 uppercase tracking-widest">Classification</span>
                    <h2 className="text-5xl font-black tracking-tighter font-headline">{persistedResult.classification}</h2>
                  </div>
                  <div className="space-y-5">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold opacity-70">AI Confidence</span>
                      <span className="text-4xl font-black italic tabular-nums">{persistedResult.confidence}%</span>
                    </div>
                    <div className="w-full h-5 bg-black/10 rounded-full overflow-hidden p-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${persistedResult.confidence}%` }}
                        transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-current rounded-full shadow-[0_0_15px_currentColor]" 
                      />
                    </div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-current/10 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-current animate-pulse" />
                    <span className="text-sm font-bold tracking-tight">{persistedResult.detectedMaterial} detected</span>
                  </div>
                </div>

                {/* Disposal Logic */}
                <div className="bg-tertiary-container rounded-radius-lg p-8 text-on-tertiary-container shadow-lg">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <Lightbulb size={24} className="opacity-70" />
                      <span className="text-xs font-bold uppercase tracking-widest">Disposal Suggestion</span>
                    </div>
                    <h3 className="text-2xl font-extrabold font-headline leading-tight">Sorting Guide</h3>
                    <p className="text-sm font-bold opacity-90 leading-relaxed bg-white/10 p-4 rounded-lg">
                      {persistedResult.disposalInstructions}
                    </p>
                    <button 
                      onClick={onUploadClick}
                      className="mt-2 flex items-center justify-center gap-3 bg-on-tertiary-container text-tertiary-container py-4 rounded-full font-black hover:scale-[1.02] active:scale-95 transition-all w-full shadow-lg"
                    >
                      Scan Another Item
                      <CloudUpload size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Secondary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { 
            icon: <Leaf className="text-primary" />, 
            title: 'Carbon Offset', 
            text: persistedResult ? `Recycling this item saves approx. ${persistedResult.carbonOffset} of CO2.` : 'Recycling saves an average of 0.4kg of CO2 per item.',
            active: !!persistedResult 
          },
          { 
            icon: <Wallet className="text-primary" />, 
            title: 'Eco Points', 
            text: persistedResult ? `You've earned ${persistedResult.points} Eco Points for this scan!` : "Earn points for every scan to unlock exclusive green rewards.",
            active: !!persistedResult 
          },
          { 
            icon: <Lightbulb className="text-primary" />, 
            title: 'Sustainability Tip', 
            text: 'Rinsing containers before disposal significantly improves the quality of recycled materials.',
            active: false 
          }
        ].map((card, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
            className={cn(
              "bg-surface-container-low p-8 rounded-lg flex flex-col gap-5 border-2 transition-all",
              card.active ? "border-primary/20 bg-primary-fixed/5" : "border-transparent"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
              card.active ? "bg-primary text-white" : "bg-primary/10"
            )}>
              {React.cloneElement(card.icon as React.ReactElement, { className: card.active ? "text-white" : "text-primary" })}
            </div>
            <h4 className="font-extrabold text-xl font-headline tracking-tight">{card.title}</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium">{card.text}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
