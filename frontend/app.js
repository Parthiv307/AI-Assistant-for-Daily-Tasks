import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('General'); // General, Code, Resume, Robotics

  const handleChat = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      setResponse("Connection failed. Is the backend live?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-silver/30">
      {/* 1. NAV BAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/50 border-b border-white/10 px-10 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tighter hover:text-silver transition-colors cursor-pointer">
          UNIFIED.AI
        </h1>
        <div className="flex gap-8 text-sm text-gray-400 font-medium">
          <span className="hover:text-white cursor-pointer">Code</span>
          <span className="hover:text-white cursor-pointer">Resume</span>
          <span className="hover:text-white cursor-pointer">Robotics</span>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="pt-32 px-6 max-w-5xl mx-auto flex flex-col items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-extrabold text-center tracking-tight mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent"
        >
          Everything, Optimized.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg md:text-2xl text-center mb-12 max-w-2xl font-light"
        >
          The 3-in-1 tool for modern engineers. Fix code, build resumes, and design hardware in one smooth interface.
        </motion.p>

        {/* 3. THE 3D GLASS CARD */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="w-full bg-[#1c1c1e] border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          style={{ boxShadow: '0 0 40px rgba(255,255,255,0.05)' }}
        >
          {/* Subtle Gloss Overlay */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <textarea
            className="w-full bg-transparent text-xl md:text-2xl outline-none resize-none placeholder-gray-600 min-h-[150px]"
            placeholder="Ask anything... (Try: Fix my C code)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded-full border border-white/20 text-xs text-gray-400">Low Latency</div>
              <div className="px-3 py-1 rounded-full border border-white/20 text-xs text-gray-400">Unified Engine</div>
            </div>
            
            <button
              onClick={handleChat}
              disabled={loading}
              className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Execute"}
            </button>
          </div>
        </motion.div>

        {/* 4. RESPONSE AREA */}
        <AnimatePresence>
          {response && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 w-full bg-white/5 border border-white/10 rounded-[32px] p-10 mb-20"
            >
              <h3 className="text-silver font-bold uppercase tracking-widest text-xs mb-6">AI Output</h3>
              <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-lg">
                <pre className="whitespace-pre-wrap font-mono text-sm bg-black/40 p-6 rounded-xl border border-white/5">
                  {response}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;