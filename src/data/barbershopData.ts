export interface ServiceItem {
  id: string;
  index: string;
  name: string;
  duration: string;
  description: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  aspectClass: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  context: string;
  rating: number;
  text: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const BUSINESS_INFO = {
  name: 'INVICTUS Barbearia',
  shortName: 'INVICTUS',
  slogan: 'Barba e tesoura: arte e tradição',
  address: 'R. Sen. Caiado - Central, Goiás - GO, 76600-000',
  phoneDisplay: '(62) 99221-5161',
  whatsappDigits: '5562992215161',
  hours: [
    { days: 'Terça a Sexta', time: '09:00 – 19:30' },
    { days: 'Sábado', time: '09:00 – 18:00' },
    { days: 'Domingo e Segunda', time: 'Fechado' },
  ],
} as const;

export const SERVICES: ServiceItem[] = [
  {
    id: 'corte-classico',
    index: '01.',
    name: 'Corte Clássico & Tesoura',
    duration: '45 min',
    description:
      'Execução precisa na tesoura e máquina, respeitando o caimento natural dos fios, formato do rosto e finalização com produtos de acabamento fosco ou brilho suave.',
  },
  {
    id: 'barba-navalha',
    index: '02.',
    name: 'Barba Completa à Navalha',
    duration: '40 min',
    description:
      'Ritual tradicional com toalha quente aromática, espuma densa, alinhamento simétrico à navalha e pós-barba calmante para preservar o conforto da pele.',
  },
  {
    id: 'combo-invictus',
    index: '03.',
    name: 'Combo Barba & Tesoura',
    duration: '1h 20 min',
    description:
      'Atendimento completo unindo corte sob medida e ritual de barba à navalha com toalha quente, lavagem revigorante e modelagem final.',
  },
  {
    id: 'acabamento-sobrancelha',
    index: '04.',
    name: 'Acabamento, Pezinho & Sobrancelha',
    duration: '25 min',
    description:
      'Manutenção rápida de contornos, limpeza de nuca à navalha e alinhamento discreto de sobrancelha para manter o visual alinhado entre cortes.',
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'fachada-invictus',
    src: 'https://lh3.googleusercontent.com/grass-cs/AABkmLcLmauHZ1VPnIqcAYF-LQUKAROLlX382Nam7mN4yZhl-sN01uRQMuDb1B8e3JzevP91ImvSHRUK0PdV0N79KIllj8FnqaVhQjmKPZLO_ZlD5gk2BhSLepObqFFwqHTZxPgkm-lnv7KHACTZ=s4800-w828',
    alt: 'Fachada histórica da INVICTUS Barbearia no Centro de Goiás - GO',
    caption: 'Fachada tradicional no Centro Histórico de Goiás - GO',
    aspectClass: 'md:col-span-7 aspect-[4/3]',
  },
  {
    id: 'salao-interno',
    src: 'https://lh3.googleusercontent.com/grass-cs/AABkmLevcTuebbT7jVgown1q3JbsIHUp_VrCMD1sg6r1g4gTWHgqsAueBy5LdRNEm_6Mp4aEhrHCW0owreNIa57ZKX0ofzIRzXVV4LE5tzplvP6p1Whrr5yKllYgUgqKHnx9OkMvCh5upujXCHE=s4800-w1024',
    alt: 'Interior da INVICTUS Barbearia com teto amadeirado e iluminação do salão',
    caption: 'Ambiente interno acolhedor com arquitetura em madeira',
    aspectClass: 'md:col-span-5 aspect-[4/3]',
  },
  {
    id: 'corte-precisao',
    src: 'https://lh3.googleusercontent.com/grass-cs/AABkmLcFDafe2FmYJPYkUL3sI1lI5fFqEspXPY60DPJF1YZKcJy6oh31qOul8K4AgYLZXXXifFYa9lIoZR4jnVJ7P1qMM9PE8KOOp5Ho6s-JYaGkJkbC6K-kd_bzx9Ceal4GUKs0rwXp=s4800-w750',
    alt: 'Detalhe de corte masculino com acabamento preciso na INVICTUS Barbearia',
    caption: 'Acabamento geométrico e degradê limpo à navalha',
    aspectClass: 'md:col-span-5 aspect-[4/3]',
  },
  {
    id: 'entrada-tradicional',
    src: 'https://lh3.googleusercontent.com/grass-cs/AABkmLc_h3ba5sGq0iygAiy_dgtr4i_pVrrQ2jEu_hHKCIOIKStGbkWernJkBE69ub03PJpXYwOR56h5fMSuKUCbk5ZAXqmQp41FJxvcYUNEkdSTX2gqVcUsc7qGEfzF2vJhHZrfsqOTCSDehnU=s4800-w828',
    alt: 'Entrada e placa clássica da INVICTUS Barbearia em Goiás - GO',
    caption: 'Identidade da casa e recepção na R. Sen. Caiado',
    aspectClass: 'md:col-span-7 aspect-[4/3]',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'dep-1',
    name: 'Rafael Mendonça',
    context: 'Cliente desde 2024 · Combo Barba & Tesoura',
    rating: 5,
    text: 'Atendimento pontual e corte exatamente como pedi. A toalha quente na barba faz toda a diferença e o ambiente no centro de Goiás é muito bem cuidado.',
  },
  {
    id: 'dep-2',
    name: 'Lucas Ferreira',
    context: 'Cliente frequente · Corte Clássico',
    rating: 5,
    text: 'Difícil encontrar barbeiro que domine tão bem a tesoura sem depender só de máquina. Saio sempre com o acabamento limpo e fácil de arrumar no dia a dia.',
  },
  {
    id: 'dep-3',
    name: 'Gustavo Nogueira',
    context: 'Goiás - GO · Barba à Navalha',
    rating: 5,
    text: 'Ambiente discreto, sem correria e com atenção real aos detalhes. Fiz a barba completa antes de um casamento e a pele não irritou nada.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Como funciona o agendamento de horário na INVICTUS Barbearia?',
    answer:
      'Você pode escolher o serviço, a data e o horário desejados diretamente no formulário desta página. Ao confirmar, o pedido já é estruturado para envio imediato ao nosso WhatsApp (62) 99221-5161, garantindo retorno rápido.',
  },
  {
    id: 'faq-2',
    question: 'Vocês atendem por ordem de chegada ou apenas com hora marcada?',
    answer:
      'Priorizamos o atendimento com horário agendado para evitar espera e dedicar o tempo ideal a cada cliente. Caso tenha urgência no mesmo dia, envie uma mensagem no WhatsApp para verificarmos encaixes disponíveis.',
  },
  {
    id: 'faq-3',
    question: 'Quanto tempo dura em média um corte ou o combo de barba e cabelo?',
    answer:
      'O corte clássico leva cerca de 45 minutos, a barba completa à navalha dura em torno de 40 minutos e o combo completo de barba e tesoura tem duração média de 1 hora e 20 minutos.',
  },
  {
    id: 'faq-4',
    question: 'Onde a barbearia está localizada em Goiás - GO?',
    answer:
      'Estamos na R. Sen. Caiado - Central, Goiás - GO, CEP 76600-000, em ponto de fácil acesso no setor central da cidade.',
  },
  {
    id: 'faq-5',
    question: 'Qual a tolerância de atraso e política de remarcação?',
    answer:
      'Pedimos a gentileza de chegar com alguns minutos de antecedência. Em caso de imprevisto, avise pelo WhatsApp com pelo menos 2 horas de antecedência para reagendarmos sem prejuízo ao próximo atendimento.',
  },
];
