import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { ChevronRight } from 'lucide-react';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleChat = async () => {
    if (!prompt && !file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('prompt', prompt || "Analyze this.");
      if (file) formData.append('file', file);

      const res = await fetch('http://localhost:8000/chat', { method: 'POST', body: formData });
      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      setResponse("System link failed. Ensure backend is active.");
    }
    setLoading(false);
  };

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden">
      {/* NEW SPLINE SCENE */}
      <div className="absolute inset-0 z-0">
        <Spline scene="https://prod.spline.design/CP179RRxa9zKBqXM/scene.splinecode" />
      </div>

      {/* HERO TEXT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-4">Clarity. Focus. Impact.</h1>
          <p className="text-xl md:text-2xl font-light text-white/40">We turn complex ideas into effortless experiences</p>
        </motion.div>
      </div>

      {/* INPUT AREA (Pinned to Bottom Left) */}
      <main className="absolute bottom-12 left-12 z-20 w-full max-w-sm">
        <AnimatePresence>
          {response && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 font-mono text-xs text-white/60 max-h-[25vh] overflow-y-auto">
              {response}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none placeholder-white/20 min-h-[80px] resize-none"
            placeholder="Phoenix is ready..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex items-center gap-4">
            <button onClick={handleChat} disabled={loading} className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded font-bold text-xs uppercase tracking-widest active:scale-95">
              {loading ? "..." : "EXECUTE"} <ChevronRight size={14} />
            </button>
            <label className="text-[10px] text-white/40 hover:text-white cursor-pointer uppercase tracking-widest">
              + File <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            {file && <span className="text-[10px] text-green-400 truncate max-w-[100px]">{file.name}</span>}
          </div>

          <p className="text-lg font-bold tracking-tight text-white/80 pt-4">Engineered by Phoenix // 2026</p>
        </div>
      </main>
    </div>
  );
};

export default App;