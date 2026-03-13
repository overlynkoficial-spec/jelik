
import React from 'react';
import { 
  Save, 
  Image as ImageIcon, 
  MessageCircle, 
  Layout, 
  LogOut, 
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  Trash2,
  Plus,
  Menu,
  X,
  ExternalLink,
  Facebook,
  Instagram as InstagramIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSiteData, saveSiteData, SiteData, DEFAULT_DATA } from '../lib/storage';
import { ImageUpload } from './ImageUpload';
import { supabase } from '../lib/supabase';

export function AdminPanel() {
  const [data, setData] = React.useState<SiteData>(DEFAULT_DATA);
  const [isLogged, setIsLogged] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('whatsapp');
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Check actual Supabase session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setIsLogged(true);
    };
    checkSession();

    const load = async () => {
      const siteData = await getSiteData();
      setData(siteData);
    };
    load();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setLoginError('E-mail ou senha incorretos.');
      setIsLoading(false);
    } else {
      setIsLogged(true);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLogged(false);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await saveSiteData(data);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      setSaveStatus('idle');
      alert('Erro ao salvar no servidor. Verifique sua conexão.');
    }
  };

  const updateNestedData = (path: string, value: any) => {
    const newData = { ...data };
    const keys = path.split('.');
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setData(newData);
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">System Admin</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Jelik Modas • Painel de Controle</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-pink transition-all"
                placeholder="Seu e-mail cadastrado"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-pink transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            {loginError && (
              <p className="text-red-400 text-sm font-medium text-center bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                {loginError}
              </p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-gradient-to-r from-brand-pink to-brand-purple text-white font-black rounded-2xl shadow-xl shadow-brand-pink/20 hover:scale-[1.02] active:scale-95 transition-all text-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? 'Entrando...' : 'Entrar no Painel'}
            </button>
          </form>
          <p className="mt-8 text-center text-zinc-600 text-xs font-medium">Painel protegido por Supabase Auth.</p>

        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-black border-b border-white/5 p-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-pink flex items-center justify-center text-white font-black italic text-sm">J</div>
          <span className="font-black text-lg tracking-tight">Admin Jelik</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar / Sidebar Overlay */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 1024) && (
          <motion.aside 
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`w-80 bg-black border-r border-white/5 flex flex-col fixed h-full z-40 lg:relative ${
              isMobileMenuOpen ? 'block' : 'hidden lg:flex'
            }`}
          >
            <div className="p-8 border-b border-white/5 hidden lg:flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-pink flex items-center justify-center text-white font-black italic">J</div>
              <span className="font-black text-xl tracking-tight">Admin Jelik</span>
            </div>
            
            <nav className="flex-1 p-6 space-y-2">
              {[
                { id: 'whatsapp', icon: MessageCircle, label: 'Atendimento' },
                { id: 'marquee', icon: Layout, label: 'Letreiro Digital' },
                { id: 'social', icon: InstagramIcon, label: 'Redes Sociais' },
                { id: 'sections', icon: Layout, label: 'Seções do Site' },
                { id: 'images', icon: ImageIcon, label: 'Imagens & Banner' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                    activeTab === item.id 
                      ? 'bg-brand-pink/10 text-brand-pink border border-brand-pink/20' 
                      : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="p-6 border-t border-white/5 space-y-2">
              <a 
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all border border-transparent"
              >
                <ExternalLink size={20} />
                Ver Site
              </a>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-400/10 transition-all border border-transparent"
              >
                <LogOut size={20} />
                Sair do Sistema
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-20 lg:ml-0 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">
              {activeTab === 'whatsapp' && 'Atendimento de Clientes'}
              {activeTab === 'marquee' && 'Letreiro Digital / Avisos'}
              {activeTab === 'social' && 'Redes Sociais'}
              {activeTab === 'sections' && 'Editar Conteúdo do Site'}
              {activeTab === 'images' && 'Gestão de Mídia'}
            </h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">
              Alterações refletem instantaneamente no site.
            </p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${
              saveStatus === 'saved' 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {saveStatus === 'saving' ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
            ) : saveStatus === 'saved' ? (
              <CheckCircle2 size={20} />
            ) : (
              <Save size={20} />
            )}
            {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'saved' ? 'Salvo!' : 'Salvar Alterações'}
          </button>
        </header>

        <div className="max-w-4xl">
          {/* TAB: ATENDIMENTO (WHATSAPP + IA) */}
          {activeTab === 'whatsapp' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              {/* WHATSAPP SECTION */}
              <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500">
                      <Smartphone size={24} />
                    </div>
                    <h3 className="text-2xl font-black">Configuração WhatsApp</h3>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Botão:</span>
                    <button
                      onClick={() => updateNestedData('whatsapp.enabled', !data.whatsapp.enabled)}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        data.whatsapp.enabled
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                          : 'bg-zinc-700 text-zinc-400'
                      }`}
                    >
                      {data.whatsapp.enabled ? 'Ativado' : 'Desativado'}
                    </button>
                  </div>
                </div>
                
                <div className="grid gap-8">
                  <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Número de Exibição (Texto)</label>
                    <input 
                      type="text" 
                      value={data.whatsapp.number}
                      onChange={(e) => updateNestedData('whatsapp.number', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Link da API WhatsApp (wa.me)</label>
                    <input 
                      type="text" 
                      value={data.whatsapp.link}
                      onChange={(e) => updateNestedData('whatsapp.link', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Texto Tooltip (Botão)</label>
                    <input 
                      type="text" 
                      value={data.whatsapp.label}
                      onChange={(e) => updateNestedData('whatsapp.label', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* AI CHAT SECTION */}
              <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-brand-purple/5">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                      <MessageCircle size={24} />
                    </div>
                    <h3 className="text-2xl font-black">Atendimento com IA</h3>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Atendimento IA:</span>
                    <button
                      onClick={() => updateNestedData('aiConfig.enabled', !data.aiConfig.enabled)}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        data.aiConfig.enabled 
                          ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                          : 'bg-zinc-700 text-zinc-400'
                      }`}
                    >
                      {data.aiConfig.enabled ? 'Ativado' : 'Dezativado'}
                    </button>
                  </div>
                </div>
                
                <div className="grid gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Nome do Agente (IA)</label>
                      <input 
                        type="text" 
                        value={data.aiConfig.agentName}
                        onChange={(e) => updateNestedData('aiConfig.agentName', e.target.value)}
                        placeholder="Ex: Jelik Virtual"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Estilo de Atendimento</label>
                      <select 
                        value={data.aiConfig.style}
                        onChange={(e) => updateNestedData('aiConfig.style', e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="neutral" className="bg-zinc-900 text-white">Neutro / Profissional</option>
                        <option value="formal" className="bg-zinc-900 text-white">Formal / Elegante</option>
                        <option value="informal" className="bg-zinc-900 text-white">Informal / Amigável</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Instruções e Treinamento do Agente</label>
                    <textarea 
                      rows={12}
                      value={data.aiConfig.trainingData}
                      onChange={(e) => updateNestedData('aiConfig.trainingData', e.target.value)}
                      placeholder="Descreva detalhadamente como a IA deve se comportar e as informações que ela deve conhecer sobre a Jelik Modas..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none resize-none leading-relaxed font-mono text-sm"
                    />
                    <div className="mt-4 flex items-start gap-2 p-4 bg-brand-purple/5 border border-brand-purple/10 rounded-2xl">
                      <div className="text-brand-purple mt-0.5"><MessageCircle size={14} /></div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                        Nota: Você pode usar a tag <span className="text-brand-purple font-bold">{"{agentName}"}</span> no texto acima para referenciar automaticamente o nome definido no campo superior.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: SOCIAL MEDIA */}
          {activeTab === 'social' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-brand-pink/20 flex items-center justify-center text-brand-pink">
                    <InstagramIcon size={24} />
                  </div>
                  <h3 className="text-2xl font-black">Links das Redes Sociais</h3>
                </div>
                
                <div className="grid gap-8">
                  <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                      <InstagramIcon size={14} className="text-brand-pink" /> Link do Instagram
                    </label>
                    <input 
                      type="text" 
                      value={data.social?.instagram || ""}
                      onChange={(e) => updateNestedData('social.instagram', e.target.value)}
                      placeholder="https://www.instagram.com/seuusuario"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                      <Facebook size={14} className="text-blue-500" /> Link do Facebook
                    </label>
                    <input 
                      type="text" 
                      value={data.social?.facebook || ""}
                      onChange={(e) => updateNestedData('social.facebook', e.target.value)}
                      placeholder="https://www.facebook.com/suapagina"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none"
                    />
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-sm text-zinc-400 leading-relaxed italic">
                    Estes links serão exibidos no rodapé do site com os respectivos ícones. 
                    Certifique-se de incluir o <span className="text-brand-pink font-bold">https://</span> completo.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: MARQUEE */}
          {activeTab === 'marquee' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-pink/20 flex items-center justify-center text-brand-pink">
                      <Layout size={24} />
                    </div>
                    <h3 className="text-2xl font-black">Letreiro Digital (Avisos)</h3>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Status:</span>
                    <button
                      onClick={() => updateNestedData('marquee.enabled', !data.marquee.enabled)}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        data.marquee.enabled 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                          : 'bg-zinc-700 text-zinc-400'
                      }`}
                    >
                      {data.marquee.enabled ? 'Ativado' : 'Desativado'}
                    </button>
                  </div>
                </div>
                
                <div className="grid gap-8">
                  <div>
                    <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Texto do Letreiro</label>
                    <textarea 
                      rows={4}
                      value={data.marquee.text}
                      onChange={(e) => updateNestedData('marquee.text', e.target.value)}
                      placeholder="Digite o texto que irá aparecer rolando no topo da página..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-pink transition-all outline-none resize-none leading-relaxed"
                    />
                    <p className="mt-4 text-xs text-zinc-500 font-medium">
                      Dica: O letreiro só aparecerá no site se houver um texto digitado e o status estiver "Ativado".
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: SECTIONS */}
          {activeTab === 'sections' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
               <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                 <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-4 text-brand-pink">Menu Superior (Navigation)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Seção 1 (Essência)</label>
                      <input 
                        type="text" 
                        value={data.menu.essencia}
                        onChange={(e) => updateNestedData('menu.essencia', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Seção 2 (Destaques)</label>
                      <input 
                        type="text" 
                        value={data.menu.destaques}
                        onChange={(e) => updateNestedData('menu.destaques', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Seção 3 (Vantagens)</label>
                      <input 
                        type="text" 
                        value={data.menu.vantagens}
                        onChange={(e) => updateNestedData('menu.vantagens', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Seção 4 (Logística)</label>
                      <input 
                        type="text" 
                        value={data.menu.logistica}
                        onChange={(e) => updateNestedData('menu.logistica', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Seção 5 (Depoimentos)</label>
                      <input 
                        type="text" 
                        value={data.menu.depoimentos}
                        onChange={(e) => updateNestedData('menu.depoimentos', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Seção 6 (Contato)</label>
                      <input 
                        type="text" 
                        value={data.menu.contato}
                        onChange={(e) => updateNestedData('menu.contato', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                      />
                    </div>
                 </div>
               </section>

               {/* HERO / HEADER AREA */}
               <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                 <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-4 text-brand-pink">Home (Banner Principal)</h3>
                 <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Headline (Título Principal)</label>
                      <textarea 
                        rows={2}
                        value={data.hero.headline}
                        onChange={(e) => updateNestedData('hero.headline', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Subheadline (Texto de Apoio)</label>
                      <textarea 
                        rows={3}
                        value={data.hero.subheadline}
                        onChange={(e) => updateNestedData('hero.subheadline', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none resize-none"
                      />
                    </div>
                 </div>
               </section>

               {/* ABOUT */}
               <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                 <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-4 text-brand-pink">Nossa Essência (Sobre)</h3>
                 <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Título da Seção</label>
                      <input 
                        type="text" 
                        value={data.about.title}
                        onChange={(e) => updateNestedData('about.title', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Parágrafo 1</label>
                      <textarea 
                        rows={3}
                        value={data.about.p1}
                        onChange={(e) => updateNestedData('about.p1', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Parágrafo 2</label>
                      <textarea 
                        rows={3}
                        value={data.about.p2}
                        onChange={(e) => updateNestedData('about.p2', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none resize-none"
                      />
                    </div>
                 </div>
               </section>

               {/* ADVANTAGES */}
               <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                 <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-4 text-brand-pink">Vantagens (Diferenciais)</h3>
                 <div className="grid gap-8">
                   {data.advantages.items.map((item, idx) => (
                     <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <label className="block text-[10px] font-bold text-brand-pink uppercase mb-2">Diferencial {idx + 1}</label>
                        <input 
                          type="text" 
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...data.advantages.items];
                            newItems[idx].title = e.target.value;
                            updateNestedData('advantages.items', newItems);
                          }}
                          className="w-full bg-transparent border-b border-white/10 mb-4 py-2 font-bold focus:border-brand-pink outline-none"
                        />
                        <textarea 
                          rows={2}
                          value={item.desc}
                          onChange={(e) => {
                            const newItems = [...data.advantages.items];
                            newItems[idx].desc = e.target.value;
                            updateNestedData('advantages.items', newItems);
                          }}
                          className="w-full bg-transparent text-zinc-400 text-sm focus:text-white outline-none resize-none"
                        />
                     </div>
                   ))}
                 </div>
               </section>

               {/* STORES */}
               <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                 <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                   <h3 className="text-xl font-black text-brand-pink">Endereços das Lojas</h3>
                   <button 
                     onClick={() => updateNestedData('footer.stores', [...data.footer.stores, { name: '', address: '', zipCode: '', phone: '' }])}
                     className="p-2 bg-brand-pink/20 text-brand-pink rounded-xl hover:bg-brand-pink hover:text-white transition-all"
                   >
                     <Plus size={20} />
                   </button>
                 </div>
                 <div className="grid gap-8">
                   {data.footer?.stores?.map((store, idx) => (
                     <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/5 relative group">
                        <button 
                          onClick={() => {
                            const newStores = data.footer.stores.filter((_, i) => i !== idx);
                            updateNestedData('footer.stores', newStores);
                          }}
                          className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Nome da Loja (ex: Loja 1)</label>
                            <input 
                              type="text" 
                              value={store.name}
                              onChange={(e) => {
                                const newStores = [...data.footer.stores];
                                newStores[idx].name = e.target.value;
                                updateNestedData('footer.stores', newStores);
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Telefone</label>
                            <input 
                              type="text" 
                              value={store.phone}
                              onChange={(e) => {
                                const newStores = [...data.footer.stores];
                                newStores[idx].phone = e.target.value;
                                updateNestedData('footer.stores', newStores);
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Endereço Completo</label>
                            <input 
                              type="text" 
                              value={store.address}
                              onChange={(e) => {
                                const newStores = [...data.footer.stores];
                                newStores[idx].address = e.target.value;
                                updateNestedData('footer.stores', newStores);
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                            />
                          </div>
                        </div>
                     </div>
                   ))}
                 </div>
               </section>
                {/* TESTIMONIALS */}
                <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h3 className="text-xl font-black text-brand-pink">Depoimentos (Vozes que Confiam)</h3>
                    <button 
                      onClick={() => updateNestedData('testimonials.items', [...data.testimonials.items, { text: '', author: '', location: '' }])}
                      className="p-2 bg-brand-pink/20 text-brand-pink rounded-xl hover:bg-brand-pink hover:text-white transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-6 mb-10">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Badge (ex: 4.7 / 5 no Google)</label>
                         <input 
                           type="text" 
                           value={data.testimonials.badge}
                           onChange={(e) => updateNestedData('testimonials.badge', e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Título</label>
                         <input 
                           type="text" 
                           value={data.testimonials.title}
                           onChange={(e) => updateNestedData('testimonials.title', e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Subtítulo</label>
                         <input 
                           type="text" 
                           value={data.testimonials.subtitle}
                           onChange={(e) => updateNestedData('testimonials.subtitle', e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                         />
                       </div>
                     </div>
                  </div>

                  <div className="grid gap-8">
                    {data.testimonials.items.map((item, idx) => (
                      <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/5 relative group">
                         <button 
                           onClick={() => {
                             const newItems = data.testimonials.items.filter((_, i) => i !== idx);
                             updateNestedData('testimonials.items', newItems);
                           }}
                           className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-red-400 transition-colors"
                         >
                           <Trash2 size={18} />
                         </button>
                         <div className="grid grid-cols-1 gap-6">
                           <div>
                             <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Texto do Depoimento</label>
                             <textarea 
                               rows={2}
                               value={item.text}
                               onChange={(e) => {
                                 const newItems = [...data.testimonials.items];
                                 newItems[idx].text = e.target.value;
                                 updateNestedData('testimonials.items', newItems);
                               }}
                               className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none resize-none"
                             />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                               <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Autor</label>
                               <input 
                                 type="text" 
                                 value={item.author}
                                 onChange={(e) => {
                                   const newItems = [...data.testimonials.items];
                                   newItems[idx].author = e.target.value;
                                   updateNestedData('testimonials.items', newItems);
                                 }}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                               />
                             </div>
                             <div>
                               <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Localização/Fonte</label>
                               <input 
                                 type="text" 
                                 value={item.location}
                                 onChange={(e) => {
                                   const newItems = [...data.testimonials.items];
                                   newItems[idx].location = e.target.value;
                                   updateNestedData('testimonials.items', newItems);
                                 }}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                               />
                             </div>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* LEGAL POLICIES */}
                <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                  <h3 className="text-xl font-black text-brand-pink mb-8 border-b border-white/5 pb-4">Seções Legais (Políticas, Termos e Privacidade)</h3>
                  <div className="grid gap-10">
                    {['policies', 'terms', 'privacy'].map((key) => (
                      <div key={key} className="p-8 rounded-3xl bg-white/5 border border-white/5">
                        <div className="grid gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">
                              Título ({key === 'policies' ? 'Políticas' : key === 'terms' ? 'Termos' : 'Privacidade'})
                            </label>
                            <input 
                              type="text" 
                              value={(data.legal as any)[key].title}
                              onChange={(e) => {
                                const newLegal = { ...data.legal, [key]: { ...(data.legal as any)[key], title: e.target.value } };
                                updateNestedData('legal', newLegal);
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Conteúdo</label>
                            <textarea 
                              rows={6}
                              value={(data.legal as any)[key].content}
                              onChange={(e) => {
                                const newLegal = { ...data.legal, [key]: { ...(data.legal as any)[key], content: e.target.value } };
                                updateNestedData('legal', newLegal);
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-pink outline-none resize-none leading-relaxed text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
             </motion.div>
          )}

          {/* TAB: IMAGES */}
          {activeTab === 'images' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
               {/* LOGO SECTION */}
               <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                 <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-4 text-brand-pink underline decoration-brand-pink/30 underline-offset-8">Identidade Visual (Logo)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                   <ImageUpload 
                     label="Logo da Marca (Menu e Rodapé)"
                     value={data.logo}
                     onChange={(val) => updateNestedData('logo', val)}
                     aspectRatio="video"
                   />
                 </div>
               </section>

               {/* BANNER 1 (CAROUSEL SUPERIOR) */}
               <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black border-b border-white/5 pb-4 text-brand-pink flex-1 underline decoration-brand-pink/30 underline-offset-8">1. Banner Superior (Carrossel Home)</h3>
                    <div className="flex gap-2 ml-4">
                      <div className="hidden">
                        <ImageUpload 
                          label="Bulk" 
                          value="" 
                          multiple 
                          directory 
                          onMultipleChange={(newImgs) => {
                            updateNestedData('heroCarousel', [...data.heroCarousel, ...newImgs]);
                          }}
                          onChange={() => {}} 
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          (input as any).webkitdirectory = true;
                          input.accept = 'image/*';
                          input.onchange = async (e: any) => {
                            const files = e.target.files;
                            if (!files) return;
                            const newImgs: string[] = [];
                            for (const file of Array.from(files) as File[]) {
                              if (!file.type.startsWith('image/')) continue;
                              if (file.size > 5 * 1024 * 1024) continue;
                              const base64 = await new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.readAsDataURL(file);
                              });
                              newImgs.push(base64);
                            }
                            updateNestedData('heroCarousel', [...data.heroCarousel, ...newImgs]);
                          };
                          input.click();
                        }}
                        className="px-4 py-2 bg-brand-pink/10 text-brand-pink text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-pink hover:text-white transition-all border border-brand-pink/20"
                      >
                        Upload Pasta / Lote
                      </button>
                      <button 
                        onClick={() => updateNestedData('heroCarousel', [...data.heroCarousel, ''])}
                        className="p-3 bg-brand-pink/20 text-brand-pink rounded-xl hover:bg-brand-pink hover:text-white transition-all"
                        title="Adicionar Slide ao Banner"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                   {data.heroCarousel.map((img, idx) => (
                     <div key={idx} className="relative group">
                       <ImageUpload 
                         label={`Slide ${idx + 1}`}
                         value={img}
                         aspectRatio="portrait"
                         onChange={(val) => {
                           const newImgs = [...data.heroCarousel];
                           newImgs[idx] = val;
                           updateNestedData('heroCarousel', newImgs);
                         }}
                       />
                       <button 
                         onClick={() => {
                           const newImgs = data.heroCarousel.filter((_, i) => i !== idx);
                           updateNestedData('heroCarousel', newImgs);
                         }}
                         className="absolute top-[4.5rem] right-4 p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all z-20"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                   ))}
                 </div>
               </section>

               {/* BANNER 2 (DESTAQUES DA TEMPORADA) */}
               <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black border-b border-white/5 pb-4 text-brand-pink flex-1 underline decoration-brand-pink/30 underline-offset-8">2. Destaques da Temporada (Grade de Produtos)</h3>
                    <div className="flex gap-2 ml-4">
                      <button 
                         onClick={() => {
                           const input = document.createElement('input');
                           input.type = 'file';
                           input.multiple = true;
                           (input as any).webkitdirectory = true;
                           input.accept = 'image/*';
                           input.onchange = async (e: any) => {
                             const files = e.target.files;
                             if (!files) return;
                             const newImgs: Array<{url: string, title: string}> = [];
                             for (const file of Array.from(files) as File[]) {
                               if (!file.type.startsWith('image/')) continue;
                               if (file.size > 5 * 1024 * 1024) continue;
                               const base64 = await new Promise<string>((resolve) => {
                                 const reader = new FileReader();
                                 reader.onloadend = () => resolve(reader.result as string);
                                 reader.readAsDataURL(file);
                               });
                               newImgs.push({ url: base64, title: '' });
                             }
                             updateNestedData('highlightImages', [...data.highlightImages, ...newImgs]);
                           };
                           input.click();
                         }}
                         className="px-4 py-2 bg-brand-pink/10 text-brand-pink text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-pink hover:text-white transition-all border border-brand-pink/20"
                       >
                         Upload Pasta / Lote
                       </button>
                       <button 
                         onClick={() => updateNestedData('highlightImages', [...data.highlightImages, { url: '', title: '' }])}
                         className="p-3 bg-brand-pink/20 text-brand-pink rounded-xl hover:bg-brand-pink hover:text-white transition-all"
                         title="Adicionar Imagem aos Destaques"
                       >
                         <Plus size={20} />
                       </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                    {data.highlightImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <ImageUpload 
                          label={`Produto Destaque ${idx + 1}`}
                          value={img.url}
                          aspectRatio="portrait"
                          onChange={(val) => {
                            const newImgs = [...data.highlightImages];
                            newImgs[idx] = { ...newImgs[idx], url: val };
                            updateNestedData('highlightImages', newImgs);
                          }}
                        />
                        <div className="mt-2">
                          <input 
                            type="text"
                            placeholder="Nome ou Código da Peça"
                            value={img.title}
                            onChange={(e) => {
                              const newImgs = [...data.highlightImages];
                              newImgs[idx] = { ...newImgs[idx], title: e.target.value };
                              updateNestedData('highlightImages', newImgs);
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-brand-pink outline-none"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newImgs = data.highlightImages.filter((_, i) => i !== idx);
                            updateNestedData('highlightImages', newImgs);
                          }}
                          className="absolute top-[4.5rem] right-4 p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all z-20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

               {/* SEÇÕES ESTRATÉGICAS */}
               <section className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                 <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-4 text-brand-pink underline decoration-brand-pink/30 underline-offset-8">3 & 4. Imagens das Seções Institucionais</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-left">
                   <ImageUpload 
                     label="3. Seção 'Nossa Essência'"
                     value={data.about.image}
                     onChange={(val) => updateNestedData('about.image', val)}
                     aspectRatio="portrait"
                   />
                   <ImageUpload 
                     label="4. Seção 'Coração do Brás'"
                     value={data.logistics.image}
                     onChange={(val) => updateNestedData('logistics.image', val)}
                     aspectRatio="portrait"
                   />
                 </div>
               </section>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function Heart({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
