
import React from 'react';
import { 
  Instagram, 
  MessageCircle, 
  MapPin, 
  Truck, 
  Clock, 
  Star, 
  CheckCircle2, 
  Users, 
  ShoppingBag,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  QrCode,
  Banknote,
  User,
  Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSiteData, SiteData, DEFAULT_DATA } from '../lib/storage';
import { AIChatPopup } from './AIChatPopup';

function Carousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  React.useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[2rem] shadow-2xl border border-white/10 group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-pink"
      >
        <ChevronRight className="rotate-180" size={20} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-pink"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "w-8 bg-brand-pink" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Marquee({ text }: { text: string }) {
  return (
    <div className="bg-brand-pink text-white py-3 overflow-hidden whitespace-nowrap border-y border-white/10 relative z-40">
      <div className="animate-marquee inline-block">
        <span className="text-sm font-black uppercase tracking-[0.2em] px-4">{text}</span>
        <span className="text-sm font-black uppercase tracking-[0.2em] px-4">{text}</span>
        <span className="text-sm font-black uppercase tracking-[0.2em] px-4">{text}</span>
        <span className="text-sm font-black uppercase tracking-[0.2em] px-4">{text}</span>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [data, setData] = React.useState<SiteData>(DEFAULT_DATA);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeLegal, setActiveLegal] = React.useState<{ title: string; content: string } | null>(null);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const siteData = await getSiteData();
      setData(siteData);
    };
    load();

    const handleUpdate = () => {
      load();
    };
    window.addEventListener('storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const navLinks = [
    { name: data.menu.essencia, href: '#sobre' },
    { name: data.menu.destaques, href: '#colecao' },
    { name: data.menu.vantagens, href: '#vantagens' },
    { name: data.menu.logistica, href: '#logistica' },
    { name: data.menu.depoimentos, href: '#depoimentos' },
    { name: data.menu.contato, href: '#contato' },
  ];

  return (
    <div className="min-h-screen selection:bg-brand-pink/20 selection:text-brand-pink antialiased">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex-shrink-0 flex items-center h-full">
              <img 
                src={data.logo} 
                alt="Jelik Modas Logo" 
                className="h-20 w-auto object-contain hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-400 hover:text-brand-pink transition-all"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href={data.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-full text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:shadow-lg hover:shadow-brand-pink/30 transition-all active:scale-95"
              >
                Atacado no Brás
                <ChevronRight className="ml-2" size={16} />
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-zinc-300 hover:text-white p-2 transition-colors"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-brand-dark/98 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
            >
              <div className="px-6 pt-4 pb-10 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-4 text-lg font-bold text-zinc-300 hover:text-brand-pink hover:bg-white/5 rounded-2xl transition-all"
                  >
                    {link.name}
                  </a>
                ))}
                <a
                  href={data.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-5 mt-6 text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-brand-pink to-brand-purple shadow-xl"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="pt-24">
        {data.marquee?.enabled && data.marquee?.text && (
          <Marquee text={data.marquee.text} />
        )}
      </div>

      <main>
        <section className="relative overflow-hidden bg-brand-dark py-16 lg:py-24">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-pink/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-brand-purple/10 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-black uppercase tracking-[0.2em] mb-8 border border-brand-pink/20">
                  {data.hero.badge}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-[1.1] lg:leading-[0.95] tracking-tighter mb-10">
                  {data.hero.headline.split('Fitness').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple italic font-display font-light">Fitness</span>}
                    </React.Fragment>
                  ))}
                </h1>
                <p className="text-lg text-zinc-400 mb-8 max-w-xl leading-relaxed mx-auto lg:mx-0">
                  {data.hero.subheadline}
                </p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                  <a 
                    href={data.whatsapp.link}
                    className="group inline-flex items-center justify-center px-10 py-5 text-xl font-black rounded-2xl text-white bg-gradient-to-r from-brand-pink to-brand-purple hover:scale-[1.02] transition-all shadow-2xl shadow-brand-pink/30"
                  >
                    {data.hero.ctaPrimary} <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
                  </a>
                  <a 
                    href="#colecao"
                    className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-2xl text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md"
                  >
                    {data.hero.ctaSecondary}
                  </a>
                </div>
                
                <div className="mt-16 flex items-center justify-center lg:justify-start gap-5">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <img 
                        key={i}
                        src={`https://picsum.photos/seed/user${i}/100/100`} 
                        alt="Cliente Jelik" 
                        className="w-10 h-10 rounded-full border-2 border-brand-dark object-cover ring-2 ring-brand-pink/20"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1 text-yellow-400 mb-0.5">
                      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      <span className="text-white">{data.hero.trustedText}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mt-20 lg:mt-0 relative"
              >
                <div className="relative z-10 aspect-[9/16] h-auto max-h-[85vh] mx-auto">
                  <Carousel images={data.heroCarousel} />
                </div>                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 -translate-y-1/2 -left-8 lg:-left-12 bg-white/10 backdrop-blur-2xl p-2.5 rounded-2xl border border-white/20 shadow-2xl z-30 max-w-[130px] -rotate-3"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-brand-pink flex items-center justify-center text-white">
                      <Star size={10} fill="currentColor" />
                    </div>
                    <span className="font-black text-white text-xs">4.7</span>
                  </div>
                  <p className="text-[8px] font-bold text-zinc-200 leading-tight italic">"{data.testimonials.items[0].text}"</p>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </section>

        <section id="sobre" className="py-20 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="relative mb-20 lg:mb-0">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative z-10 aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]"
                >
                  <img 
                    src={data.about.image} 
                    alt="Processo Criativo Jelik" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
                </motion.div>
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-zinc-900 rounded-[3rem] p-10 flex flex-col justify-center text-white shadow-2xl rotate-6 z-20">
                  <h4 className="text-3xl font-black mb-2 tracking-tighter italic">{data.about.overlayTitle}</h4>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">{data.about.overlaySubtitle}</p>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-sm font-black text-brand-pink uppercase tracking-[0.4em] mb-6">{data.about.badge}</h2>
                <h3 className="text-3xl lg:text-5xl font-black text-zinc-900 mb-10 leading-[1.1] tracking-tight">
                  {data.about.title.split('evoluir').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="text-brand-purple">evoluir</span>}
                    </React.Fragment>
                  ))}
                </h3>
                <div className="space-y-8 text-xl text-zinc-600 leading-relaxed font-light">
                  <p>{data.about.p1}</p>
                  <p>{data.about.p2}</p>
                  <p>{data.about.p3}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="colecao" className="py-20 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold text-brand-pink uppercase tracking-[0.2em] mb-4">Nossa Coleção</h2>
              <p className="text-3xl font-extrabold text-zinc-900">Destaques da Temporada</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.highlightImages.map((img, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                    <p className="text-white font-bold text-xl mb-0">{img.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="vantagens" className="py-24 bg-brand-dark text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-sm font-black text-brand-pink uppercase tracking-[0.4em] mb-6">{data.advantages.badge}</h2>
              <p className="text-4xl lg:text-5xl font-black mb-6 tracking-tighter">{data.advantages.title}</p>
              <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light">{data.advantages.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.advantages.items.map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-brand-pink/40 hover:bg-white/10 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center mb-8 shadow-xl shadow-brand-pink/20 transition-transform group-hover:rotate-6">
                    {idx === 0 && <ShoppingBag size={32} />}
                    {idx === 1 && <CheckCircle2 size={32} />}
                    {idx === 2 && <Users size={32} />}
                    {idx === 3 && <Heart size={32} />}
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed font-light">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="logistica" className="py-24 bg-zinc-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-sm font-black text-brand-pink uppercase tracking-[0.4em] mb-6">{data.logistics.badge}</h2>
                <h3 className="text-3xl lg:text-5xl font-black text-zinc-900 mb-6 leading-tight tracking-tight">{data.logistics.title}</h3>
                <p className="text-lg text-zinc-600 mb-10 font-light leading-relaxed">
                  {data.logistics.subtitle}
                </p>
                
                <div className="grid gap-10">
                  {data.logistics.items.map((item, idx) => (
                    <div key={idx} className="flex gap-8 group">
                      <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-white shadow-lg flex items-center justify-center text-brand-pink border border-zinc-100 group-hover:bg-brand-pink group-hover:text-white transition-all">
                        {idx === 0 && <Truck size={32} />}
                        {idx === 1 && <Users size={32} />}
                        {idx === 2 && <ShoppingBag size={32} />}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">{item.title}</h4>
                        <p className="text-zinc-500 text-lg font-light">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <div className="mt-24 lg:mt-0 relative">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   className="relative z-10 aspect-[4/5] -mt-12 rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white"
                >
                  <img 
                    src={data.logistics.image} 
                    alt="Expedição Jelik Modas" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="absolute -top-12 -left-12 w-full h-full bg-brand-pink/5 rounded-full blur-3xl -z-10" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 p-10 lg:p-12 rounded-[3.5rem] bg-white border border-zinc-200 shadow-2xl max-w-5xl mx-auto"
            >
              <h5 className="font-black text-zinc-900 mb-10 text-xl tracking-tight uppercase border-b border-zinc-100 pb-5 text-center">Facilidade no Pagamento:</h5>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {data.logistics.paymentMethods.map(method => {
                  const getIcon = (m: string) => {
                    const low = m.toLowerCase();
                    if (low.includes('pix')) return <QrCode size={32} />;
                    if (low.includes('cartão') || low.includes('débito')) return <CreditCard size={32} />;
                    if (low.includes('dinheiro') || low.includes('vista')) return <Banknote size={32} />;
                    return <CreditCard size={32} />;
                  };
                  return (
                    <div key={method} className="flex flex-col items-center justify-center gap-3 p-6 lg:p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 hover:border-brand-pink/30 hover:bg-brand-pink/5 transition-all group text-center min-h-[120px]">
                      <div className="text-brand-pink group-hover:scale-110 transition-transform">
                        {getIcon(method)}
                      </div>
                      <span className="text-zinc-900 font-black uppercase tracking-widest text-[10px] whitespace-normal leading-tight px-2">{method}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="depoimentos" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6 bg-brand-pink/5 px-6 py-2 rounded-full border border-brand-pink/20">
                <div className="flex text-brand-pink">
                  {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <span className="text-brand-pink font-black text-lg">{data.testimonials.badge}</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-zinc-900 mb-6 tracking-tighter">{data.testimonials.title}</h2>
              <p className="text-zinc-500 text-lg font-light max-w-2xl mx-auto">{data.testimonials.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {data.testimonials.items.map((testimonial, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="bg-zinc-50 p-12 rounded-[3.5rem] shadow-sm border border-zinc-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex gap-1.5 p-2.5 bg-white rounded-xl text-brand-pink mb-8 shadow-sm">
                      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-2xl text-zinc-900 italic font-medium leading-relaxed mb-10">“{testimonial.text}”</p>
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 text-lg uppercase tracking-tight">{testimonial.author}</p>
                    <p className="text-brand-pink font-bold text-sm tracking-widest uppercase">{testimonial.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-24 text-center">
              <div className="inline-block p-10 rounded-[3rem] bg-zinc-900 text-white max-w-3xl">
                <p className="text-lg font-light leading-relaxed italic">
                  "Nosso compromisso com a excelência e o atendimento humanizado é o que nos move. Na Jelik, cada feedback é uma ferramenta para nossa evolução constante. Obrigado por fazerem parte dessa história."
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-8 h-px bg-brand-pink" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-pink">Time Jelik Modas</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="contato" className="bg-brand-dark border-t border-white/5 pt-32 pb-16 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
              <div className="lg:col-span-5">
                <h4 className="text-3xl font-black mb-6 tracking-tight">{data.footer.tagline}</h4>
                <p className="text-zinc-500 text-xl font-light mb-12 leading-relaxed">
                  {data.footer.description}
                </p>
                
                <div className="grid gap-6">
                  {data.footer?.stores?.map((store, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-brand-pink/20 flex items-center justify-center text-brand-pink flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{store.name}</p>
                        <p className="text-zinc-400 font-light text-sm leading-relaxed">{store.address}</p>
                        <p className="text-zinc-500 text-xs mt-1 font-bold">Telefone: {store.phone}</p>
                      </div>
                    </div>
                  ))}
                  
                  <a 
                    href={data.whatsapp.link}
                    className="flex items-start gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">Atendimento Digital</p>
                      <p className="text-zinc-400 font-light">{data.whatsapp.number}</p>
                      <p className="text-zinc-500 text-xs mt-1 font-bold">Respostas Rápidas</p>
                    </div>
                  </a>

                  <a 
                    href={data.instagram.link}
                    className="flex items-start gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 flex items-center justify-center text-brand-purple flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Instagram size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">Nosso Lifestyle</p>
                      <p className="text-zinc-400 font-light">{data.instagram.handle}</p>
                      <p className="text-zinc-500 text-xs mt-1 font-bold">Via Linktree</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-gradient-to-br from-white/10 to-transparent p-12 lg:p-16 rounded-[4rem] border border-white/10 relative overflow-hidden group">
                  <Clock className="absolute -top-10 -right-10 text-white/5 w-64 h-64 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                  
                  <div className="relative z-10">
                    <h5 className="text-sm font-black text-brand-pink uppercase tracking-[0.4em] mb-10">{data.hours.title}</h5>
                    <div className="space-y-6">
                      {data.hours.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-white/10 last:border-0 gap-2">
                          <div>
                            <span className="text-2xl font-black text-white tracking-tight">{item.day}</span>
                            {item.badge && (
                              <span className="ml-3 px-2 py-0.5 rounded-md bg-brand-pink/20 text-brand-pink text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-left sm:text-right">
                            {item.closed ? (
                              <span className="text-xl font-bold text-red-400 uppercase tracking-widest">Fechado</span>
                            ) : (
                              <>
                                <span className="text-xl font-medium text-zinc-300">{item.time}</span>
                                {item.highlight && <p className="text-sm font-black text-brand-pink uppercase tracking-widest mt-1">{item.highlight}</p>}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-12 p-8 rounded-3xl bg-brand-pink/10 border border-brand-pink/20">
                      <p className="text-sm font-bold text-brand-pink leading-relaxed">
                        {data.hours.note}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 md:pr-32">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest text-center md:text-left">
                  © {new Date().getFullYear()} Jelik Modas. Elegância & Business.
                </p>
                <div className="flex items-center gap-4">
                  {data.social?.instagram && (
                    <a 
                      href={data.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-brand-pink hover:border-brand-pink/50 hover:bg-brand-pink/10 transition-all shadow-lg"
                      title="Siga no Instagram"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                  {data.social?.facebook && (
                    <a 
                      href={data.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all shadow-lg"
                      title="Curta no Facebook"
                    >
                      <Facebook size={18} />
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-12">
                <button 
                  onClick={() => setActiveLegal(data.legal.policies)} 
                  className="text-xs font-black text-zinc-600 hover:text-white uppercase tracking-[0.3em] transition-colors"
                >
                  Políticas
                </button>
                <button 
                  onClick={() => setActiveLegal(data.legal.terms)} 
                  className="text-xs font-black text-zinc-600 hover:text-white uppercase tracking-[0.3em] transition-colors"
                >
                  Termos
                </button>
                <button 
                  onClick={() => setActiveLegal(data.legal.privacy)} 
                  className="text-xs font-black text-zinc-600 hover:text-white uppercase tracking-[0.3em] transition-colors"
                >
                  Privacidade
                </button>
              </div>
            </div>
          </div>
        </footer>
        <AnimatePresence>
          {activeLegal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveLegal(null)}
                className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[3rem] p-12 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
              >
                <button 
                  onClick={() => setActiveLegal(null)}
                  className="absolute top-8 right-8 p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-3xl font-black text-zinc-900 mb-8 pr-12">{activeLegal.title}</h2>
                <div className="overflow-y-auto pr-4 custom-scrollbar">
                  <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap text-lg font-light">
                    {activeLegal.content}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTÕES FLUTUANTES DE ATENDIMENTO */}
      <div className="fixed bottom-10 right-10 z-[60] flex flex-col gap-6 items-end">
        {/* BOTÃO IA (Aparece apenas se ativado) */}
        {data.aiConfig?.enabled && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={() => setIsChatOpen(true)}
            className="group relative"
          >
            <div className="absolute -inset-4 bg-brand-purple/30 rounded-full blur-xl group-hover:bg-brand-purple/50 transition-all animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-brand-purple to-[#701ced] text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-active:scale-95 transition-all">
              <User size={30} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-pink rounded-full border-2 border-white animate-bounce" />
            </div>
            <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 bg-white text-zinc-900 font-black text-[10px] px-4 py-2 rounded-xl opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-2xl pointer-events-none whitespace-nowrap uppercase tracking-[0.2em]">
              Falar com atendente virtual
            </div>
          </motion.button>
        )}

        {/* BOTÃO WHATSAPP (condicional) */}
        {(data.whatsapp?.enabled !== false) && (
          <a 
            href={data.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/40 transition-all animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-2xl flex items-center justify-center shadow-[0_15px_35px_rgba(37,211,102,0.25)] group-hover:scale-110 group-active:scale-95 transition-all">
              <MessageCircle size={32} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-[#25D366] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              </div>
            </div>
            <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 bg-white text-zinc-900 font-black text-xs px-6 py-3 rounded-2xl opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-2xl pointer-events-none whitespace-nowrap uppercase tracking-widest">
              {data.whatsapp.label}
            </div>
          </a>
        )}
      </div>

      <AIChatPopup 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        config={data.aiConfig}
        whatsappLink={data.whatsapp.link}
      />
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
