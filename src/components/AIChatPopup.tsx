import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, User } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

interface AIChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    agentName: string;
    style: string;
    trainingData: string;
  };
  whatsappLink: string;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export function AIChatPopup({ isOpen, onClose, config, whatsappLink }: AIChatPopupProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { role: 'ai', content: `Olá! Eu sou ${config.agentName}, assistente virtual da Jelik Modas. Como posso te ajudar hoje?` }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        console.error("VITE_GEMINI_API_KEY não está definida! Verifique as variáveis de ambiente e lembre-se de refazer o deploy no Render após adicioná-las.");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        Você é ${config.agentName}, o(a) assistente virtual oficial da Jelik Modas.
        Seu estilo de atendimento deve ser: ${config.style}.
        
        Instruções de Treinamento da Loja:
        ${config.trainingData}
        
        Contexto Atual da Conversa:
        ${messages.map(m => `${m.role === 'user' ? 'Cliente' : 'Você'}: ${m.content}`).join('\n')}
        Cliente: ${userMsg}
        
        Responda de forma curta, prestativa e objetiva. Use emojis (moderadamente).
        Se a pergunta for sobre algo fora do treinamento ou muito específica sobre pedidos/estoque, oriente o cliente a usar o botão "WhatsApp" no topo para falar com um humano.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'ai', content: text }]);
      playNotificationSound();
    } catch (error: any) {
      console.error("Gemini Error:", error);
      console.error("Gemini Error Details:", error?.message || error);
      // Fallback para respostas locais simuladas em caso de erro na API
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: "Olá! No momento estou com uma instabilidade técnica na minha IA, mas você pode falar diretamente com nossa equipe humana clicando no botão 'WhatsApp' aqui no topo! Como posso ajudar?" 
        }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-0 right-0 lg:bottom-10 lg:right-10 w-full lg:w-[400px] h-full lg:h-[650px] lg:max-h-[85vh] bg-[#09090b] border-t lg:border border-white/10 rounded-t-[2rem] lg:rounded-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] lg:shadow-2xl z-[80] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-pink via-brand-purple to-[#701ced] p-5 lg:p-7 flex justify-between items-center shrink-0 shadow-lg relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                    <User size={24} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#09090b] shadow-sm" />
                </div>
                <div>
                  <p className="text-white font-black text-base tracking-tight leading-none mb-1">{config.agentName}</p>
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Assistente Virtual
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-green-500/20"
                  title="Falar no WhatsApp"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center text-white/80 hover:text-white"
                  aria-label="Fechar Chat"
                >
                  <X size={24} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Mobile Human Support Bar (Bottom of Header) */}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden w-full bg-green-500 text-white py-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-inner"
            >
              <MessageCircle size={12} /> Falar no WhatsApp
            </a>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-fixed"
            >
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-pink text-white rounded-tr-none' 
                      : 'bg-white/5 text-zinc-300 border border-white/10 rounded-tl-none backdrop-blur-sm'
                  }`}>
                    {msg.content.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < msg.content.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-dot-flashing" />
                    <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-dot-flashing [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-dot-flashing [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form 
              onSubmit={handleSend}
              className="p-4 lg:p-6 bg-[#09090b] border-t border-white/5 flex gap-3 shrink-0 pb-8 lg:pb-6"
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre atacado, endereços..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-zinc-600 focus:border-brand-pink outline-none transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-14 h-14 bg-gradient-to-br from-brand-pink to-brand-purple text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-brand-pink/20"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
