import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleChat = async () => {
    if (!prompt && !file) return;
    setLoading(true);
    
    // UX FIX: Instantly spawn the output window so the user knows Phoenix is working, preventing any "blank screen" perception while the heavy AI API fetches.
    setResponse("### Phoenix Protocol Initiated...\n\n_Analyzing data streams. Please standby._");

    try {
      const formData = new FormData();
      formData.append('prompt', prompt || "Analyze this.");
      if (file) formData.append('file', file);

      // CRITICAL: Ensure this URL matches the backend exactly
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      setResponse("System link failed. Check if backend is running on port 8000.");
    }
    setLoading(false);
  };

  return (
    <div className="relative h-screen w-full bg-transparent flex flex-col items-center text-white overflow-hidden">
      
      <main className="relative z-10 w-full h-full flex flex-col">
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="pt-16 px-6 flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">Intelligence</h1>
          <h2 className="text-4xl md:text-6xl font-light italic text-white/20 mb-8">Perfected.</h2>
          <ChevronDown size={32} className="text-white/40 animate-bounce" />
        </motion.div>

        {/* SEARCH CONSOLE (stays perfectly centered) */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex items-center justify-center px-6 w-full">
          <div className="w-full max-w-2xl bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-[40px] p-2 shadow-2xl relative z-10 mt-12">
            <div className="bg-black/40 rounded-[32px] p-8">
              
              {file && (
                <div className="mb-4 inline-flex items-center gap-2 bg-white/10 p-2 px-4 rounded-full text-xs font-mono">
                  📄 {file.name}
                  <button onClick={() => setFile(null)} className="ml-2 text-red-500 font-bold">×</button>
                </div>
              )}

              <textarea
                className="w-full bg-transparent text-xl outline-none resize-none placeholder-white/10 min-h-[80px] font-light"
                placeholder="Phoenix is ready for command..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <div className="flex justify-between items-center mt-6">
                <label className="h-12 w-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center cursor-pointer border border-white/10 transition-all">
                  <span className="text-2xl font-light">+</span>
                  <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileUpload} />
                </label>

                <button
                  onClick={handleChat}
                  disabled={loading}
                  className="group flex items-center gap-2 bg-white text-black px-10 py-3.5 rounded-full font-bold hover:bg-gray-200 transition-all"
                >
                  {loading ? "PROCESSING..." : "EXECUTE"}
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* OUTPUT AREA (Docked to bottom / "task bar" and expanding upwards) */}
        <AnimatePresence>
          {response && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-black/70 border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 max-h-[45vh] overflow-y-auto shadow-2xl z-30 flex flex-col font-sans"
            >
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-white/90 text-base font-light tracking-wide" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-white tracking-wide" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 text-white/80 text-base font-light" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-white/80 text-base font-light" {...props} />,
                  li: ({node, ...props}) => <li className="leading-relaxed pl-2" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-3xl font-extrabold mb-5 mt-6 text-white" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-4 mt-6 text-white" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-3 mt-5 text-white/90" {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline ? <code className="bg-white/10 px-2 py-0.5 rounded-md text-sm font-mono text-indigo-300" {...props} /> 
                           : <div className="bg-black/50 p-5 rounded-2xl border border-white/10 my-6 overflow-x-auto shadow-inner"><code className="font-mono text-sm text-gray-300" {...props} /></div>,
                }}
              >
                {response}
              </ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default App;