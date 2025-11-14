export interface Story {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: any;
  };
  stories: StoryItem[];
  hasNewStories: boolean;
}

export interface StoryItem {
  id: string;
  type: 'image' | 'video' | 'text';
  content: string | any; // URL da imagem/video ou texto
  duration?: number;
  timestamp: number;
  backgroundColor?: string;
  textColor?: string;
  caption?: string; // Legenda para imagens/vídeos
  captionPosition?: 'top' | 'center' | 'bottom'; // Posição da legenda
}

export interface UserStory extends Story {
  isCurrentUser: boolean;
}

// Avatars DiceBear para stories
const avatars = {
  // Padrão único para usuário logado
  user: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100' },
  carlos: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=CarlosMartinez&backgroundColor=20B2AA&size=100' },
  mariana: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=MarianaSilva&backgroundColor=9B59B6&size=100' },
  jamile: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JamileCosta&backgroundColor=E74C3C&size=100' },
  luana: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=LuanaPereira&backgroundColor=27AE60&size=100' },
  jorge: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JorgeZikenay&backgroundColor=FF6B6B&size=100' },
  ana: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=AnaPaulaNutri&backgroundColor=2ECC71&size=100' },
};

const storyImages = {
  workout: { uri: 'https://picsum.photos/seed/workout1/400/600' },
  medical: { uri: 'https://picsum.photos/seed/medical1/400/600' },
  done: { uri: 'https://picsum.photos/seed/success1/400/600' },
  fitness: { uri: 'https://picsum.photos/seed/fitness1/400/600' },
  health: { uri: 'https://picsum.photos/seed/health1/400/600' },
  nature: { uri: 'https://picsum.photos/seed/nature1/400/600' },
  therapy: { uri: 'https://picsum.photos/seed/therapy1/400/600' },
  nutrition: { uri: 'https://picsum.photos/seed/nutrition1/400/600' },
};

export const mockStories: Story[] = [
  // Seu Flash (usuário atual)
  {
    id: 'current-user',
    user: {
      id: 'current-user',
      name: 'Seu Flash',
      avatar: avatars.user,
    },
    stories: [
      {
        id: 'user-story-1',
        type: 'text',
        content: 'Começando o dia com energia! 💪',
        timestamp: Date.now() - 3600000, // 1 hora atrás
        backgroundColor: '#4576F2',
        textColor: '#FFFFFF',
        duration: 5000,
      },
      {
        id: 'user-story-2',
        type: 'image',
        content: storyImages.done,
        timestamp: Date.now() - 7200000, // 2 horas atrás
        duration: 5000,
        caption: 'Objetivos alcançados hoje! 🎯',
        captionPosition: 'bottom',
      },
    ],
    hasNewStories: true,
  },

  // Jorge Zikenay
  {
    id: 'jorge',
    user: {
      id: 'jorge',
      name: 'Jorge Zikenay',
      avatar: avatars.jorge,
    },
    stories: [
      {
        id: 'jorge-story-1',
        type: 'image',
        content: storyImages.workout,
        timestamp: Date.now() - 1800000, // 30 min atrás
        duration: 5000,
        caption: 'Treino funcional de hoje! 💪',
        captionPosition: 'bottom',
      },
      {
        id: 'jorge-story-1b',
        type: 'image',
        content: storyImages.fitness,
        timestamp: Date.now() - 1700000,
        duration: 5000,
        caption: 'Exercícios para dor nas costas',
        captionPosition: 'center',
      },
      {
        id: 'jorge-story-2',
        type: 'text',
        content: 'Sessão de treino completa! 🏋️‍♂️\n\nObrigado pela participação de todos',
        timestamp: Date.now() - 900000, // 15 min atrás
        backgroundColor: '#FF6B6B',
        textColor: '#FFFFFF',
        duration: 5000,
      },
    ],
    hasNewStories: true,
  },

  // Dr. Carlos Martinez
  {
    id: 'carlos',
    user: {
      id: 'carlos',
      name: 'Dr. Carlos',
      avatar: avatars.carlos,
    },
    stories: [
      {
        id: 'carlos-story-1',
        type: 'text',
        content: '🩺 Dica do dia:\n\nBeba água regularmente!\n\nSeus rins agradecem 💧',
        timestamp: Date.now() - 2700000, // 45 min atrás
        backgroundColor: '#20B2AA',
        textColor: '#FFFFFF',
        duration: 6000,
      },
    ],
    hasNewStories: true,
  },

  // Dra. Mariana Silva
  {
    id: 'mariana',
    user: {
      id: 'mariana',
      name: 'Dra. Mariana',
      avatar: avatars.mariana,
    },
    stories: [
      {
        id: 'mariana-story-1',
        type: 'image',
        content: storyImages.medical,
        timestamp: Date.now() - 3600000, // 1 hora atrás
        duration: 5000,
        caption: 'Equipamento de última geração 🏥',
        captionPosition: 'top',
      },
      {
        id: 'mariana-story-1b',
        type: 'image',
        content: storyImages.health,
        timestamp: Date.now() - 3500000,
        duration: 5000,
        caption: 'Procedimento minimamente invasivo',
        captionPosition: 'bottom',
      },
      {
        id: 'mariana-story-2',
        type: 'text',
        content: 'Cirurgia realizada com sucesso! 🏥\n\nTecnologia salvando vidas',
        timestamp: Date.now() - 1800000, // 30 min atrás
        backgroundColor: '#9B59B6',
        textColor: '#FFFFFF',
        duration: 5000,
      },
    ],
    hasNewStories: true,
  },

  // Jamile Costa (Fisioterapeuta)
  {
    id: 'jamile',
    user: {
      id: 'jamile',
      name: 'Jamile Costa',
      avatar: avatars.jamile,
    },
    stories: [
      {
        id: 'jamile-story-1',
        type: 'image',
        content: storyImages.therapy,
        timestamp: Date.now() - 5400000, // 1.5 horas atrás
        duration: 5000,
        caption: '🤸‍♀️ Movimento é vida! Cuidem da postura',
        captionPosition: 'center',
      },
      {
        id: 'jamile-story-2',
        type: 'text',
        content: 'Sessão de fisioterapia completa! 💪\n\nObrigada pela participação',
        timestamp: Date.now() - 5200000,
        backgroundColor: '#E74C3C',
        textColor: '#FFFFFF',
        duration: 5000,
      },
    ],
    hasNewStories: false, // Já visualizado
  },

  // Luana Pereira (Psicóloga)
  {
    id: 'luana',
    user: {
      id: 'luana',
      name: 'Luana Pereira',
      avatar: avatars.luana,
    },
    stories: [
      {
        id: 'luana-story-1',
        type: 'text',
        content: '🧠 Saúde Mental\n\né prioridade!\n\nCuidem-se sempre 💚',
        timestamp: Date.now() - 7200000, // 2 horas atrás
        backgroundColor: '#27AE60',
        textColor: '#FFFFFF',
        duration: 5000,
      },
      {
        id: 'luana-story-2',
        type: 'text',
        content: 'Obrigada pela participação na palestra! 📚✨',
        timestamp: Date.now() - 3600000, // 1 hora atrás
        backgroundColor: '#F39C12',
        textColor: '#FFFFFF',
        duration: 4000,
      },
    ],
    hasNewStories: true,
  },

  // Ana Paula Nutri
  {
    id: 'ana',
    user: {
      id: 'ana',
      name: 'Ana Paula',
      avatar: avatars.ana,
    },
    stories: [
      {
        id: 'ana-story-1',
        type: 'image',
        content: storyImages.nutrition,
        timestamp: Date.now() - 10800000, // 3 horas atrás
        duration: 5000,
        caption: '🥗 Alimentação saudável começa com pequenas mudanças!',
        captionPosition: 'bottom',
      },
      {
        id: 'ana-story-2',
        type: 'text',
        content: 'Dicas de nutrição\npara uma vida\nmais saudável! 🌱',
        timestamp: Date.now() - 10600000,
        backgroundColor: '#2ECC71',
        textColor: '#FFFFFF',
        duration: 5000,
      },
    ],
    hasNewStories: false, // Já visualizado
  },
];