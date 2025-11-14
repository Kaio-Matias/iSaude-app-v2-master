export interface Post {
  id: string;
  user: string;
  avatar: any; // require local asset
  time: string;
  text: string;
  image?: any;
  images?: any[]; // Array para múltiplas imagens
  likes: number;
  likers?: any[]; // Avatares de quem curtiu (mock)
  comments: number;
  shares: number;
  location?: string;
  isLiked?: boolean;
}

// Avatar padrão para usuário logado
const USER_AVATAR = 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100';

// Imagens do Picsum Photos com seeds específicos
const postImages = {
  workout1: { uri: 'https://picsum.photos/seed/workout1/500/400' },
  workout2: { uri: 'https://picsum.photos/seed/workout2/500/400' },
  workout3: { uri: 'https://picsum.photos/seed/workout3/500/400' },
  medical1: { uri: 'https://picsum.photos/seed/medical1/500/400' },
  medical2: { uri: 'https://picsum.photos/seed/medical2/500/400' },
  medical3: { uri: 'https://picsum.photos/seed/medical3/500/400' },
  medical4: { uri: 'https://picsum.photos/seed/medical4/500/400' },
  nutrition1: { uri: 'https://picsum.photos/seed/nutrition1/500/400' },
  therapy1: { uri: 'https://picsum.photos/seed/therapy1/500/400' },
  health1: { uri: 'https://picsum.photos/seed/health1/500/400' },
  science1: { uri: 'https://picsum.photos/seed/science1/500/400' },
  hospital1: { uri: 'https://picsum.photos/seed/hospital1/500/400' },
};

export const mockPosts: Post[] = [
  {
    id: '1',
    user: 'Jorge Zikenay',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JorgeZikenay&backgroundColor=FF6B6B&size=100' },
    time: 'Há 3 dias',
    text: 'Demonstração rápida de 3 exercícios para aliviar dor nas costas no home office.',
    image: postImages.workout1,
    images: [
      postImages.workout1,
      postImages.workout2,
      postImages.workout3,
    ],
    likes: 25300,
    likers: [
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker1&backgroundColor=2ECC71&size=100', name: '@joana.pinha' },
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker2&backgroundColor=FF6B6B&size=100', name: '@carlos.s' },
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker3&backgroundColor=9B59B6&size=100', name: '@maria.o' },
    ],
    comments: 2000,
    shares: 32000,
    location: 'Academia FitHarmony',
    isLiked: false,
  },
  {
    id: '2',
    user: 'Ana Paula Nutri',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=AnaPaulaNutri&backgroundColor=2ECC71&size=100' },
    time: 'Há 12 h',
    text: 'Salvou meu dia! Dor reduziu 80% em 5 minutos ✨',
    image: postImages.nutrition1,
    likes: 980,
    likers: [
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker4&backgroundColor=4576F2&size=100', name: '@ana.p' },
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker5&backgroundColor=20B2AA&size=100', name: '@pedro.l' },
    ],
    comments: 120,
    shares: 40,
    isLiked: true,
  },
  {
    id: '3',
    user: 'Dr. Carlos Martinez',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=CarlosMartinez&backgroundColor=20B2AA&size=100' },
    time: 'Há 2 h',
    text: 'Dica importante: Hidratação adequada é fundamental para o bom funcionamento dos rins. Beba pelo menos 2L de água por dia! 💧',
    likes: 1523,
    likers: [
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker6&backgroundColor=4576F2&size=100', name: '@dr.carlos' },
    ],
    comments: 89,
    shares: 234,
    location: 'Clínica Nephros',
    isLiked: false,
  },
  {
    id: '4',
    user: 'Dra. Mariana Silva',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=MarianaSilva&backgroundColor=9B59B6&size=100' },
    time: 'Há 5 h',
    text: 'Acabei de sair de uma cirurgia incrível! A tecnologia está revolucionando a medicina. Paciente já está se recuperando muito bem 🏥',
    image: postImages.medical1,
    images: [
      postImages.medical1,
      postImages.medical2,
      postImages.medical3,
      postImages.medical4,
    ],
    likes: 3247,
    likers: [
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker7&backgroundColor=9B59B6&size=100', name: '@mariana.s' },
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker8&backgroundColor=FF69B4&size=100', name: '@luana.f' },
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker9&backgroundColor=F39C12&size=100', name: '@roberto.s' },
    ],
    comments: 456,
    shares: 1200,
    location: 'Hospital Santa Casa',
    isLiked: false,
  },
  {
    id: '5',
    user: 'Jamile Costa',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JamileCosta&backgroundColor=E74C3C&size=100' },
    time: 'Há 1 dia',
    text: 'Sessão de fisioterapia incrível hoje! Movimento é vida 💪 Quem mais está cuidando da postura no trabalho?',
    image: postImages.therapy1,
    likes: 892,
    likers: [
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker10&backgroundColor=E74C3C&size=100', name: '@jamile.c' },
    ],
    comments: 67,
    shares: 23,
    location: 'Clínica MovimentAR',
    isLiked: true,
  },
  {
    id: '6',
    user: 'Luana Pereira',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=LuanaPereira&backgroundColor=27AE60&size=100' },
    time: 'Há 8 h',
    text: 'Palestra sobre saúde mental no trabalho foi um sucesso! Obrigada a todos que participaram 🧠✨',
    image: postImages.health1,
    likes: 2156,
    likers: [
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker11&backgroundColor=27AE60&size=100', name: '@luana.p' },
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker12&backgroundColor=4576F2&size=100', name: '@bruno.m' },
    ],
    comments: 334,
    shares: 567,
    location: 'Auditório UNIFESP',
    isLiked: false,
  },
  {
    id: '7',
    user: 'Prof. Roberto Santos',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=RobertoSantos&backgroundColor=F39C12&size=100' },
    time: 'Há 6 h',
    text: 'Estudos recentes mostram que 30 minutos de caminhada diária podem reduzir o risco de doenças cardiovasculares em até 35%. Vamos nos movimentar! 🚶‍♂️',
    image: postImages.science1,
    likes: 4521,
    likers: [
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker13&backgroundColor=F39C12&size=100', name: '@roberto.s' },
    ],
    comments: 678,
    shares: 1890,
    location: 'Universidade de São Paulo',
    isLiked: false,
  },
  {
    id: '8',
    user: 'Enfermeira Paula',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=EnfermeiraPaula&backgroundColor=FF69B4&size=100' },
    time: 'Há 4 h',
    text: 'Plantão noturno terminado! Cada sorriso de paciente vale cada hora dedicada 😊 #EnfermagemComAmor',
    image: postImages.hospital1,
    likes: 756,
    likers: [
      { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker14&backgroundColor=FF69B4&size=100', name: '@paula.e' },
    ],
    comments: 123,
    shares: 45,
    location: 'Hospital das Clínicas',
    isLiked: true,
  },
];