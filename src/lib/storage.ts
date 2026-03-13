import { supabase } from './supabase';

export interface SiteData {
  whatsapp: {
    number: string;
    link: string;
    label: string;
  };
  menu: {
    essencia: string;
    destaques: string;
    vantagens: string;
    logistica: string;
    depoimentos: string;
    contato: string;
  };
  instagram: {
    link: string;
    handle: string;
  };
  social: {
    instagram: string;
    facebook: string;
  };
  logo: string;
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustedText: string;
  };
  about: {
    badge: string;
    title: string;
    p1: string;
    p2: string;
    p3: string;
    image: string;
    overlayTitle: string;
    overlaySubtitle: string;
  };
  advantages: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      desc: string;
    }>;
  };
  logistics: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      desc: string;
    }>;
    paymentMethods: string[];
    image: string;
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      text: string;
      author: string;
      location: string;
    }>;
  };
  footer: {
    tagline: string;
    description: string;
    stores: Array<{
      name: string;
      address: string;
      zipCode: string;
      phone: string;
    }>;
  };
  hours: {
    title: string;
    items: Array<{
      day: string;
      time?: string;
      closed?: boolean;
      badge?: string;
      highlight?: string;
    }>;
    note: string;
  };
  heroCarousel: string[];
  highlightImages: Array<{ url: string; title: string }>;
  legal: {
    policies: { title: string; content: string };
    terms: { title: string; content: string };
    privacy: { title: string; content: string };
  };
  marquee: {
    text: string;
    enabled: boolean;
  };
  aiConfig: {
    enabled: boolean;
    agentName: string;
    style: 'formal' | 'informal' | 'neutral';
    trainingData: string;
  };
}

export const DEFAULT_DATA: SiteData = {
  whatsapp: {
    number: "+55 11 94010-9991",
    link: "https://wa.me/5511940109991",
    label: "Falar com Especialista"
  },
  menu: {
    essencia: "Nossa Essência",
    destaques: "Destaques",
    vantagens: "Vantagens",
    logistica: "Logística",
    depoimentos: "Depoimentos",
    contato: "Contato"
  },
  instagram: {
    link: "https://www.instagram.com/jelikmodas",
    handle: "@jelikmodas"
  },
  social: {
    instagram: "https://www.instagram.com/jelikmodas",
    facebook: "https://www.facebook.com/jelikmodas"
  },
  logo: "https://storage.googleapis.com/mle-ub-p-debug-static-3eed8eb0/aistudio/9f848529-577e-4029-9c4c-2895478f7783.png",
  hero: {
    badge: "Fabricação Própria • Estilo & Lucratividade",
    headline: "Moda Fitness que Transforma Vendas em Sucesso.",
    subheadline: "Design inovador, matérias-primas diferenciadas e o DNA do Brás. Produzimos para quem busca elegância no treino, conforto no dia a dia e margens imbatíveis no atacado.",
    ctaPrimary: "Seja Revendedora",
    ctaSecondary: "Ver Coleção",
    trustedText: "Mais de 5.000 empreendedoras lucrando com a Jelik"
  },
  about: {
    badge: "Nossa Essência",
    title: "Criada por empreendedoras para quem deseja evoluir.",
    p1: "No coração pulsante do Brás, a Jelik Modas não apenas fabrica roupas fitness; nós desenhamos oportunidades. Somos uma empresa de empreendedoras que entende que a roupa certa é o combustível para a confiança feminina.",
    p2: "Nossa fabricação própria é fruto de rigorosos estudos comportamentais. Cada costura busca o equilíbrio entre o design inovador e o conforto absoluto, utilizando matérias-primas diferenciadas que garantem elegância seja no treino pesado ou na correria do dia a dia.",
    p3: "Acreditamos na força da comunidade. Por isso, cultivamos um ambiente que acolhe com orgulho a comunidade LGBTQ+, celebrando a diversidade em todas as suas cores e formas. Na Jelik, evoluímos a cada feedback, sempre focadas em entregar o extraordinário.",
    image: "https://storage.googleapis.com/mle-ub-p-debug-static-3eed8eb0/aistudio/49492f99-447a-4277-8898-d62158863673.png",
    overlayTitle: "100% Brás",
    overlaySubtitle: "Fabricação Industrial própria com alma de atelier."
  },
  advantages: {
    badge: "Diferenciais Estratégicos",
    title: "Por que a Jelik é sua melhor sócia?",
    subtitle: "Unimos o preço de atacado do Brás com a qualidade premium que seus clientes exigem.",
    items: [
      { title: "Lucratividade Real", desc: "Preços diretos da fábrica que garantem margens superiores para revendedores e lojistas." },
      { title: "Matéria-Prima Tech", desc: "Tecidos com alta compressão, regulação térmica e durabilidade para performance extrema." },
      { title: "Moda Inclusiva", desc: "Muitas opções de cores e tamanhos que abraçam a diversidade dos corpos femininos." },
      { title: "Espaço Acolhedor", desc: "Uma marca inclusiva que respeita e celebra a comunidade LGBTQ+ em todos os processos." }
    ]
  },
  logistics: {
    badge: "Logística Eficiente",
    title: "Do coração do Brás para qualquer lugar do Brasil.",
    subtitle: "Entendemos a urgência da moda. Por isso, criamos uma estrutura logística flexível para atender do varejo às grandes excursões atacadistas.",
    items: [
      { title: "Correios & Transportadoras", desc: "Envios agilizados com rastreamento para todo o território nacional." },
      { title: "Ônibus de Excursão", desc: "Entrega direta em ônibus no Brás e Pari. Comodidade total para revendedores." },
      { title: "Retirada no Brás", desc: "Compre pelo WhatsApp e retire em nossa loja física com rapidez e segurança." }
    ],
    paymentMethods: ["Pix", "Cartão de Crédito", "Débito", "À Vista (Dinheiro)"],
    image: "https://storage.googleapis.com/mle-ub-p-debug-static-3eed8eb0/aistudio/6d054f0d-5f34-450f-a947-66914598972d.png"
  },
  testimonials: {
    badge: "4.7 / 5 no Google",
    title: "Vozes que Confiam.",
    subtitle: "Experiências reais de quem escolheu a qualidade e o atendimento humanizado da Jelik.",
    items: [
      { text: "Loja top e os preços estão muito bons para quem quer revender. Qualidade impecável!", author: "Cliente Atacadista", location: "Google Business" },
      { text: "Atendentes pacientes e atenciosos em garantir a satisfação. Me senti valorizada!", author: "Cliente Varejo", location: "Google Business" },
      { text: "Muitas opções de cores e tamanhos disponíveis. A melhor escolha no Brás!", author: "Revendedora", location: "Google Business" }
    ]
  },
  footer: {
    tagline: "Onde a moda encontra a oportunidade.",
    description: "Visite nossa loja física no maior polo de confecções do Brasil ou peça de qualquer lugar através do nosso atendimento digital especializado.",
    stores: [
      {
        name: "Loja 1",
        address: "R. João Teodoro, 1113 - Brás, São Paulo - SP",
        zipCode: "03009-000",
        phone: "(11) 94010-9991"
      },
      {
        name: "Loja 2",
        address: "R. Henrique Dias, 117 - Brás, São Paulo - SP",
        zipCode: "03009-020",
        phone: "(11) 96571-9206"
      }
    ]
  },
  hours: {
    title: "Horários de Funcionamento",
    items: [
      { day: "Segunda a Quarta", time: "03h00 às 16h00", badge: "Madrugada Atacadista" },
      { day: "Quinta-feira", time: "03h00 às 16h00", highlight: "Pico: 08h00", badge: "Madrugada Atacadista" },
      { day: "Sexta-feira", time: "04h00 às 16h00" },
      { day: "Sábado", time: "03h00 às 14h00" },
      { day: "Domingo", closed: true }
    ],
    note: "⚠️ ATENÇÃO: Abrimos na madrugada para atender excursões e lojistas que buscam exclusividade antes da abertura geral do Brás."
  },
  heroCarousel: [
    "https://storage.googleapis.com/mle-ub-p-debug-static-3eed8eb0/aistudio/42792892-9844-486d-9669-7756f4d2218f.png",
    "https://storage.googleapis.com/mle-ub-p-debug-static-3eed8eb0/aistudio/3f40f09a-4c20-4131-860f-90e8e454942d.png",
    "https://storage.googleapis.com/mle-ub-p-debug-static-3eed8eb0/aistudio/760882e9-4674-4573-982e-9d846b738943.png",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571731956622-39bd43b177c5?q=80&w=2072&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1548691905-57c36cc8d93f?q=80&w=2069&auto=format&fit=crop"
  ],
  highlightImages: [
    { url: "https://storage.googleapis.com/mle-ub-p-debug-static-3eed8eb0/aistudio/f2282216-5287-430b-902e-c75c5f426543.png", title: "Conjunto Premium" },
    { url: "https://storage.googleapis.com/mle-ub-p-debug-static-3eed8eb0/aistudio/222d861d-7278-4034-8c8f-28c0393f9268.png", title: "Conjunto Premium" },
    { url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop", title: "Conjunto Premium" },
    { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop", title: "Conjunto Premium" },
    { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1920&auto=format&fit=crop", title: "Conjunto Premium" },
    { url: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=1920&auto=format&fit=crop", title: "Conjunto Premium" }
  ],
  legal: {
    policies: {
      title: "Políticas de Troca e Devolução",
      content: "Nossa política de trocas visa proporcionar ao cliente total segurança em relação aos produtos adquiridos em nossa loja. Todos os nossos produtos possuem garantia contra defeitos de fabricação. Também realizamos trocas de produtos que vieram diferente daquele encomendado pelo cliente. Caso você receba um produto nosso com algum defeito de fabricação ou diferente do que você encomendou siga os seguintes passos para realizar a troca..."
    },
    terms: {
      title: "Termos e Condições de Uso",
      content: "Ao acessar este site, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis..."
    },
    privacy: {
      title: "Aviso de Privacidade",
      content: "A sua privacidade é importante para nós. É política da Jelik Modas respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Jelik Modas, e outros sites que possuímos e operamos. Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado..."
    }
  },
  marquee: {
    text: "💥 NOVIDADE: Coleção Outono/Inverno já disponível no Atacado! • Aproveite 10% de desconto na primeira compra via WhatsApp • Enviamos para todo o Brasil • Confira nossos preços imbatíveis!",
    enabled: true
  },
  aiConfig: {
    enabled: false,
    agentName: "Jelik Virtual",
    style: 'neutral',
    trainingData: `Você é o(a) {agentName}, assistente virtual da Jelik Modas, uma fábrica de moda fitness localizada no Brás, São Paulo.\nSeu objetivo é atender revendedoras e lojistas interessados em comprar no atacado.\n\nInformações sobre a Jelik:\n- Fabricação própria.\n- Endereço 1: R. João Teodoro, 1113 - Brás.\n- Endereço 2: R. Henrique Dias, 117 - Brás.\n- Horário: Madrugada atacadista a partir das 03h ou 04h dependendo do dia.\n\nInstruções Adicionais:\n- Seja sempre prestativo(a) e profissional.\n- Se não souber algo, direcione para o WhatsApp humano.`
  }
};

const STORAGE_KEY = "jelik_modas_site_data";

export const getSiteData = async (): Promise<SiteData> => {
  try {
    // 1. Try Supabase first
    const { data, error } = await supabase
      .from('site_settings')
      .select('data')
      .eq('id', 1)
      .single();

    if (!error && data?.data && Object.keys(data.data).length > 0) {
      const siteData = { ...DEFAULT_DATA, ...data.data } as SiteData;
      // Cache to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
      return siteData;
    }

    // 2. Fallback to localStorage
    const localData = localStorage.getItem(STORAGE_KEY);
    if (!localData) {
      // Initialize Supabase if empty
      await saveSiteData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    
    return JSON.parse(localData);
  } catch (error) {
    console.error("Error loading site data:", error);
    return DEFAULT_DATA;
  }
};

export const saveSiteData = async (data: SiteData) => {
  try {
    // 1. Save to Supabase
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, data: data, updated_at: new Date().toISOString() });

    if (error) throw error;

    // 2. Save to localStorage (cache)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Notify
    window.dispatchEvent(new Event('storage_update'));
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error("Error saving site data:", error);
    // Silent fail for offline/limit issues - still saves to local
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};
