/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import ScannerView from './views/ScannerView';
import GameView from './views/GameView';
import ChatView from './views/ChatView';
import { View, AnalysisResult, ChatMessage } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('Home');
  
  // Persisted Scanner State
  const [scannerResult, setScannerResult] = useState<AnalysisResult | null>(null);
  const [scannerFile, setScannerFile] = useState<File | null>(null);
  const [scannerPreview, setScannerPreview] = useState<string | null>(null);

  // Persisted Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hello! I'm your Eco-Assistant. I'm here to help you manage your waste more sustainably. What can I help you find or learn today?",
      timestamp: 'Just now'
    }
  ]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full relative">
        <div className={cn("h-full", currentView === 'Home' ? "block" : "hidden")}>
          <HomeView setCurrentView={setCurrentView} />
        </div>
        
        <div className={cn("h-full", currentView === 'Scanner' ? "block" : "hidden")}>
          <ScannerView 
            persistedResult={scannerResult} 
            setPersistedResult={setScannerResult}
            persistedFile={scannerFile}
            setPersistedFile={setScannerFile}
            persistedPreview={scannerPreview}
            setPersistedPreview={setScannerPreview}
          />
        </div>

        <div className={cn("h-full font-sans", currentView === 'Game' ? "block" : "hidden")}>
          <GameView />
        </div>

        <div className={cn("h-full", currentView === 'AI Chat' ? "block" : "hidden")}>
          <ChatView persistedMessages={chatMessages} setPersistedMessages={setChatMessages} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
