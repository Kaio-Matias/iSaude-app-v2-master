// Serviço de armazenamento em memória para comentários e curtidas
// Os dados são mantidos apenas durante a sessão atual

import { Post, mockPosts } from './PostData';

export interface Comment {
  id: string;
  postId: string;
  text: string;
  user: string;
  avatar: any;
  timestamp: number;
}

export interface PostInteraction {
  postId: string;
  isLiked: boolean;
  likeCount: number;
  comments: Comment[];
  likers: any[]; // Lista dinâmica de pessoas que curtiram
}

class LocalStorageService {
  private interactions: Map<string, PostInteraction> = new Map();
  private posts: Post[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Inicializar posts com dados mock
    this.posts = [...mockPosts];
    
    // Avatars DiceBear para comentários mockados
    const avatars = {
      carlos: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=CarlosMartinez&backgroundColor=20B2AA&size=100' },
      mariana: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=MarianaSilva&backgroundColor=9B59B6&size=100' },
      jamile: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JamileCosta&backgroundColor=E74C3C&size=100' },
      luana: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=LuanaPereira&backgroundColor=27AE60&size=100' },
      jorge: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JorgeZikenay&backgroundColor=FF6B6B&size=100' },
      ana: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=AnaPaulaNutri&backgroundColor=2ECC71&size=100' },
    };

    // Comentários mockados para o post do Jorge (id: '1')
    const jorgeComments: Comment[] = [
      {
        id: 'mock-1-1',
        postId: '1',
        text: 'Excelente demonstração! Vou testar esses exercícios 💪',
        user: 'Dr. Carlos Martinez',
        avatar: avatars.carlos,
        timestamp: Date.now() - 7200000, // 2 horas atrás
      },
      {
        id: 'mock-1-2',
        postId: '1',
        text: 'Muito útil! Trabalho no home office e estava precisando disso',
        user: 'Dra. Mariana Silva',
        avatar: avatars.mariana,
        timestamp: Date.now() - 3600000, // 1 hora atrás
      },
      {
        id: 'mock-1-3',
        postId: '1',
        text: 'Como fisioterapeuta, posso confirmar que são exercícios seguros e eficazes! 👏',
        user: 'Jamile Costa',
        avatar: avatars.jamile,
        timestamp: Date.now() - 1800000, // 30 min atrás
      },
    ];

    // Comentários mockados para o post da Ana (id: '2')
    const anaComments: Comment[] = [
      {
        id: 'mock-2-1',
        postId: '2',
        text: 'Que bom que ajudou! ✨',
        user: 'Jorge Zikenay',
        avatar: avatars.jorge,
        timestamp: Date.now() - 1200000, // 20 min atrás
      },
    ];

    // Comentários para o post do Dr. Carlos (id: '3')
    const carlosComments: Comment[] = [
      {
        id: 'mock-3-1',
        postId: '3',
        text: 'Informação valiosa! Obrigada por compartilhar 💧',
        user: 'Luana Pereira',
        avatar: avatars.luana,
        timestamp: Date.now() - 900000, // 15 min atrás
      },
      {
        id: 'mock-3-2',
        postId: '3',
        text: 'Sempre esqueço de beber água... vou colocar um lembrete!',
        user: 'Ana Paula Nutri',
        avatar: avatars.ana,
        timestamp: Date.now() - 600000, // 10 min atrás
      },
    ];

    // Comentários para o post da Dra. Mariana (id: '4')
    const marianaComments: Comment[] = [
      {
        id: 'mock-4-1',
        postId: '4',
        text: 'Parabéns pelo sucesso da cirurgia! 👏',
        user: 'Dr. Carlos Martinez',
        avatar: avatars.carlos,
        timestamp: Date.now() - 2700000, // 45 min atrás
      },
      {
        id: 'mock-4-2',
        postId: '4',
        text: 'A tecnologia realmente está mudando tudo na medicina!',
        user: 'Jamile Costa',
        avatar: avatars.jamile,
        timestamp: Date.now() - 1800000, // 30 min atrás
      },
      {
        id: 'mock-4-3',
        postId: '4',
        text: 'Inspirador! Que o paciente tenha uma recuperação rápida 🙏',
        user: 'Luana Pereira',
        avatar: avatars.luana,
        timestamp: Date.now() - 1200000, // 20 min atrás
      },
    ];

    // Configurar interações mockadas
    this.interactions.set('1', {
      postId: '1',
      isLiked: false,
      likeCount: 25300,
      comments: jorgeComments,
      likers: [
        { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker1&backgroundColor=2ECC71&size=100', name: '@joana.pinha' },
        { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker2&backgroundColor=FF6B6B&size=100', name: '@carlos.s' },
        { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker3&backgroundColor=9B59B6&size=100', name: '@maria.o' },
      ],
    });

    this.interactions.set('2', {
      postId: '2',
      isLiked: true,
      likeCount: 981, // +1 porque está curtido
      comments: anaComments,
      likers: [
        { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker4&backgroundColor=4576F2&size=100', name: '@ana.p' },
        { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker5&backgroundColor=20B2AA&size=100', name: '@pedro.l' },
      ],
    });

    this.interactions.set('3', {
      postId: '3',
      isLiked: false,
      likeCount: 1523,
      comments: carlosComments,
      likers: [
        { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker6&backgroundColor=4576F2&size=100', name: '@dr.carlos' },
      ],
    });

    this.interactions.set('4', {
      postId: '4',
      isLiked: false,
      likeCount: 3247,
      comments: marianaComments,
      likers: [
        { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker7&backgroundColor=9B59B6&size=100', name: '@mariana.s' },
        { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker8&backgroundColor=FF69B4&size=100', name: '@luana.f' },
        { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liker9&backgroundColor=F39C12&size=100', name: '@roberto.s' },
      ],
    });
  }


  // Curtidas
  async toggleLike(postId: string, currentLikes: number): Promise<{ isLiked: boolean; likeCount: number }> {
    const interaction = this.interactions.get(postId) || {
      postId,
      isLiked: false,
      likeCount: currentLikes,
      comments: [],
      likers: []
    };

    // Avatar do usuário atual (simulando usuário logado)
    const currentUser = {
      uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100',
      name: 'Você'
    };

    interaction.isLiked = !interaction.isLiked;
    
    if (interaction.isLiked) {
      // Adiciona o usuário atual aos likers
      interaction.likeCount = interaction.likeCount + 1;
      interaction.likers.unshift(currentUser); // Adiciona no início
    } else {
      // Remove o usuário atual dos likers
      interaction.likeCount = interaction.likeCount - 1;
      interaction.likers = interaction.likers.filter(liker => liker.name !== 'Você');
    }

    this.interactions.set(postId, interaction);

    return {
      isLiked: interaction.isLiked,
      likeCount: interaction.likeCount
    };
  }

  async getLikeStatus(postId: string, defaultLikes: number): Promise<{ isLiked: boolean; likeCount: number }> {
    const interaction = this.interactions.get(postId);
    return {
      isLiked: interaction?.isLiked || false,
      likeCount: interaction?.likeCount || defaultLikes
    };
  }

  async getInteraction(postId: string): Promise<PostInteraction | null> {
    return this.interactions.get(postId) || null;
  }

  // Comentários
  async addComment(postId: string, text: string, user: string, avatar: any): Promise<Comment> {
    const interaction = this.interactions.get(postId) || {
      postId,
      isLiked: false,
      likeCount: 0,
      comments: [],
      likers: []
    };

    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      text,
      user,
      avatar,
      timestamp: Date.now()
    };

    interaction.comments.unshift(newComment); // Adiciona no início
    this.interactions.set(postId, interaction);

    return newComment;
  }

  async getComments(postId: string): Promise<Comment[]> {
    const interaction = this.interactions.get(postId);
    return interaction?.comments || [];
  }

  async getCommentCount(postId: string, defaultCount: number): Promise<number> {
    const interaction = this.interactions.get(postId);
    const localComments = interaction?.comments?.length || 0;
    return defaultCount + localComments;
  }

  async deleteComment(commentId: string, postId: string): Promise<boolean> {
    const interaction = this.interactions.get(postId);
    if (!interaction) return false;

    interaction.comments = interaction.comments.filter(c => c.id !== commentId);
    this.interactions.set(postId, interaction);

    return true;
  }

  // Gerenciamento de posts
  getPosts(): Post[] {
    // Retornar todos os posts (incluindo os do usuário)
    return this.posts;
  }

  // Função para limpar posts do usuário atual (stories que foram convertidos em posts)
  clearUserPosts(): void {
    this.posts = this.posts.filter(post => post.user !== 'Você');
  }

  addPost(content: string, mediaUris?: string[], taggedPeople?: any[], location?: string): Post {
    // Criar fontes das imagens adequadas para React Native
    let imageSource = undefined;
    let imagesArray = undefined;
    
    if (mediaUris && mediaUris.length > 0) {
      imagesArray = mediaUris.map(uri => ({ uri }));
      // Manter compatibilidade com o campo image (primeira imagem)
      imageSource = imagesArray[0];
    }
    
    // Extrair apenas os nomes das pessoas marcadas
    let peopleNames: string[] = [];
    if (taggedPeople && taggedPeople.length > 0) {
      peopleNames = taggedPeople.map(person => person.name || person);
    }
    
    // Adicionar informações sobre pessoas marcadas ao texto se houver
    let fullText = content;
    if (peopleNames.length > 0) {
      fullText += `\n\n👥 Marcado: ${peopleNames.join(', ')}`;
    }
    
    const newPost: Post = {
      id: `user-post-${Date.now()}`,
      user: 'Você',
      avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100' },
      time: 'Agora',
      text: fullText,
      image: imageSource,
      images: imagesArray,
      likes: 0,
      comments: 0,
      shares: 0,
      location: location,
      isLiked: false,
    };

    // Adicionar no início da lista (posts mais recentes primeiro)
    this.posts.unshift(newPost);
    
    // Inicializar interações para o novo post
    this.interactions.set(newPost.id, {
      postId: newPost.id,
      isLiked: false,
      likeCount: 0,
      comments: [],
      likers: [],
    });
    
    return newPost;
  }
}

export const storageService = new LocalStorageService();