/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Mic, 
  MicOff, 
  Send, 
  Terminal, 
  Cpu, 
  Globe, 
  Settings, 
  User, 
  Bot,
  Activity,
  Copy,
  Check
} from 'lucide-react';
import { useNila } from './hooks/useNila';

const CodeBlock = ({ children, className }: { children: any; className?: string }) => {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-white/10 bg-black/40">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
          {className?.replace('language-', '') || 'code'}
        </span>
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/40 hover:text-emerald-400"
          title="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-emerald-50/90">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

export default function App() {
  const { messages, status, isListening, startListening, processCommand, isSupported } = useNila();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      processCommand(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-emerald-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto h-screen flex flex-col p-4 md:p-6 gap-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">NILA <span className="text-emerald-400">AI</span></h1>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40 font-mono">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Online • v2.0.5
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>CPU: 8%</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-blue-400" />
                <span>LATENCY: 18ms</span>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Settings className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
          {/* Left Sidebar - System Status */}
          <aside className="hidden md:flex w-64 flex-col gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Assistant Status</h3>
              <div className="flex flex-col gap-3">
                <StatusItem label="Voice Engine" active={isSupported} />
                <StatusItem label="Gemini 3 Flash" active={true} />
                <StatusItem label="System Control" active={true} />
                <StatusItem label="Plugin Manager" active={true} />
              </div>
            </div>

            <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <ActionButton icon={<Globe className="w-4 h-4" />} label="Open Browser" onClick={() => processCommand("open google")} />
                <ActionButton icon={<Terminal className="w-4 h-4" />} label="System Info" onClick={() => processCommand("what is your status?")} />
                <ActionButton icon={<Cpu className="w-4 h-4" />} label="Clear Memory" onClick={() => window.location.reload()} />
              </div>
            </div>
          </aside>

          {/* Chat Interface */}
          <section className="flex-1 flex flex-col bg-white/5 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-40">
                    <Bot className="w-12 h-12" />
                    <p className="text-sm font-mono tracking-wide">INITIALIZING NEURAL INTERFACE...<br/>AWAITING COMMAND</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'model' && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                      <div className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-50' 
                          : 'bg-white/5 border border-white/5 text-white/90'
                      }`}>
                        <div className="markdown-body text-sm leading-relaxed">
                          <Markdown
                            components={{
                              code({ node, inline, className, children, ...props }: any) {
                                return !inline ? (
                                  <CodeBlock className={className}>{children}</CodeBlock>
                                ) : (
                                  <code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-emerald-400" {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {msg.text}
                          </Markdown>
                        </div>
                        <span className="text-[10px] opacity-30 mt-2 block font-mono">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white/60" />
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
                {status === 'thinking' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-black/20">
              <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Type a command or ask Nila..."}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/20 text-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={startListening}
                      className={`p-2 rounded-xl transition-all ${
                        isListening 
                          ? 'bg-red-500/20 text-red-400 animate-pulse' 
                          : 'hover:bg-white/10 text-white/40'
                      }`}
                    >
                      {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || status === 'thinking'}
                  className="p-4 rounded-2xl bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </section>
        </main>

        {/* Footer Status Bar */}
        <footer className="flex items-center justify-between text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] border-t border-white/5 pt-4">
          <div className="flex gap-6">
            <span>SECURE_LINK: ESTABLISHED</span>
            <span>ENCRYPTION: AES-256</span>
          </div>
          <div className="flex gap-6">
            <span>MEMORY_USAGE: 256MB</span>
            <span>UPTIME: 00:48:12</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatusItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-white/60">{label}</span>
      <span className={`px-1.5 py-0.5 rounded ${active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
        {active ? 'READY' : 'OFFLINE'}
      </span>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all text-left group"
    >
      <div className="text-white/40 group-hover:text-emerald-400 transition-colors">
        {icon}
      </div>
      <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}
