import { PulseData } from './PulseData';

export const mockPulsesData: PulseData[] = [
  {
    id: '1',
    author: {
      id: 'dr_ana',
      name: 'Dra. Ana Silva',
      avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Ana&backgroundColor=4576F2&size=200',
      isVerified: true,
      specialty: 'Cardiologista',
      isFollowing: false
    },
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4',
      thumbnail: 'https://picsum.photos/1080/1920?random=1&blur=2',
      duration: 45,
      resolution: {
        width: 1080,
        height: 1920
      }
    },
    content: {
      title: 'Dicas para um coração saudável 💓',
      description: 'Exercícios simples que podem salvar sua vida. Aprenda a cuidar melhor do seu coração com essas dicas práticas que todo mundo deveria conhecer.'
    },
    audio: {
      name: 'Som Original',
      artist: 'Dra. Ana Silva'
    },
    taggedPeople: {
      count: 3,
      users: [
        {
          id: 'user1',
          name: 'João Silva',
          avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Joao&size=100'
        },
        {
          id: 'user2', 
          name: 'Maria Santos',
          avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Maria&size=100'
        }
      ]
    },
    interactions: {
      likes: {
        count: 1240,
        isLiked: false
      },
      comments: {
        count: 89
      },
      shares: {
        count: 156
      },
      views: {
        count: 15420
      }
    },
    createdAt: '2024-10-06T14:30:00Z',
    location: {
      name: 'Hospital São Paulo'
    },
    medicalCategory: 'education',
    visibility: 'public'
  },
  {
    id: '2',
    author: {
      id: 'dr_jorge',
      name: 'Dr. Jorge Santos',
      avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Jorge&backgroundColor=059669&size=200',
      isVerified: true,
      specialty: 'Neurologista',
      isFollowing: true
    },
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_2mb.mp4',
      thumbnail: 'https://picsum.photos/1080/1920?random=2&blur=2',
      duration: 32,
      resolution: {
        width: 1080,
        height: 1920
      }
    },
    content: {
      title: 'Sinais de AVC que você precisa conhecer',
      description: 'Reconheça os sinais rapidamente e salve vidas. Tempo é cérebro! SAMU: Sorriso, Abraço, Música, Urgência. Cada minuto conta quando se trata de um AVC.'
    },
    audio: {
      name: 'Música Médica',
      artist: 'Dr. Jorge Santos'
    },
    taggedPeople: {
      count: 5,
      users: [
        {
          id: 'user3',
          name: 'Carlos Lima',
          avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Carlos&size=100'
        },
        {
          id: 'user4',
          name: 'Ana Costa',
          avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=AnaCosta&size=100'
        }
      ]
    },
    interactions: {
      likes: {
        count: 2100,
        isLiked: true
      },
      comments: {
        count: 145
      },
      shares: {
        count: 320
      },
      views: {
        count: 28750
      }
    },
    createdAt: '2024-10-05T10:15:00Z',
    medicalCategory: 'awareness',
    visibility: 'public'
  },
  {
    id: '3',
    author: {
      id: 'dra_maria',
      name: 'Dra. Maria Costa',
      avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Maria&backgroundColor=DC2626&size=200',
      isVerified: false,
      specialty: 'Pediatra',
      isFollowing: false
    },
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_5mb.mp4',
      thumbnail: 'https://picsum.photos/1080/1920?random=3&blur=2',
      duration: 58,
      resolution: {
        width: 1080,
        height: 1920
      }
    },
    content: {
      title: 'Vacinação infantil: calendário atualizado',
      description: 'Mantenha seu filho protegido com o calendário de vacinação completo. Saiba quais vacinas são essenciais em cada idade e quando aplicar.'
    },
    audio: {
      name: 'Nana Bebê',
      artist: 'Música Infantil'
    },
    taggedPeople: {
      count: 2,
      users: [
        {
          id: 'user5',
          name: 'Pedro Oliveira',
          avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Pedro&size=100'
        }
      ]
    },
    interactions: {
      likes: {
        count: 780,
        isLiked: false
      },
      comments: {
        count: 56
      },
      shares: {
        count: 98
      },
      views: {
        count: 9850
      }
    },
    createdAt: '2024-10-04T16:45:00Z',
    medicalCategory: 'education',
    visibility: 'public'
  },
  {
    id: '4',
    author: {
      id: 'dr_ana',
      name: 'Dra. Ana Silva',
      avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Ana&backgroundColor=4576F2&size=200',
      isVerified: true,
      specialty: 'Cardiologista',
      isFollowing: false
    },
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_10mb.mp4',
      thumbnail: 'https://picsum.photos/1080/1920?random=4&blur=2',
      duration: 40,
      resolution: {
        width: 1080,
        height: 1920
      }
    },
    content: {
      title: 'Como medir a pressão arterial corretamente',
      description: 'Técnica correta para medição da pressão arterial em casa. Aprenda o passo a passo para garantir medições precisas e confiáveis.'
    },
    audio: {
      name: 'Som Relaxante',
      artist: 'Dra. Ana Silva'
    },
    taggedPeople: {
      count: 1,
      users: [
        {
          id: 'user6',
          name: 'Roberto Silva',
          avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Roberto&size=100'
        }
      ]
    },
    interactions: {
      likes: {
        count: 945,
        isLiked: true
      },
      comments: {
        count: 72
      },
      shares: {
        count: 134
      },
      views: {
        count: 12300
      }
    },
    createdAt: '2024-10-03T08:20:00Z',
    medicalCategory: 'tips',
    visibility: 'public'
  }
];