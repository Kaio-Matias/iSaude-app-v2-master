// Serviço de comentários para Pulses
// Similar ao StorageService mas específico para pulses

export interface PulseComment {
  id: string;
  pulseId: string;
  text: string;
  user: string;
  avatar: any;
  timestamp: number;
}

export interface PulseInteraction {
  pulseId: string;
  comments: PulseComment[];
}

class PulseCommentsService {
  private interactions: Map<string, PulseInteraction> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Comentários mockados para alguns pulses
    const pulse1Comments: PulseComment[] = [
      {
        id: 'pulse-comment-1-1',
        pulseId: 'pulse-1',
        text: 'Incrível! Vou tentar esses exercícios em casa 💪',
        user: 'Dr. Carlos Martinez',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=CarlosMartinez&backgroundColor=20B2AA&size=100' },
        timestamp: Date.now() - 3600000, // 1 hora atrás
      },
      {
        id: 'pulse-comment-1-2',
        pulseId: 'pulse-1',
        text: 'Como fisioterapeuta, posso confirmar que são exercícios seguros! 👏',
        user: 'Jamile Costa',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JamileCosta&backgroundColor=E74C3C&size=100' },
        timestamp: Date.now() - 1800000, // 30 min atrás
      },
    ];

    const pulse2Comments: PulseComment[] = [
      {
        id: 'pulse-comment-2-1',
        pulseId: 'pulse-2',
        text: 'Que receita saudável! Vou testar hoje mesmo 🥗',
        user: 'Ana Paula Nutri',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=AnaPaulaNutri&backgroundColor=2ECC71&size=100' },
        timestamp: Date.now() - 7200000, // 2 horas atrás
      },
    ];

    // Configurar interações mockadas
    this.interactions.set('pulse-1', {
      pulseId: 'pulse-1',
      comments: pulse1Comments,
    });

    this.interactions.set('pulse-2', {
      pulseId: 'pulse-2',
      comments: pulse2Comments,
    });
  }

  // Adicionar comentário
  async addComment(pulseId: string, text: string, user: string, avatar: any): Promise<PulseComment> {
    const interaction = this.interactions.get(pulseId) || {
      pulseId,
      comments: [],
    };

    const newComment: PulseComment = {
      id: Date.now().toString(),
      pulseId,
      text,
      user,
      avatar,
      timestamp: Date.now()
    };

    interaction.comments.unshift(newComment); // Adiciona no início
    this.interactions.set(pulseId, interaction);

    return newComment;
  }

  // Obter comentários
  async getComments(pulseId: string): Promise<PulseComment[]> {
    const interaction = this.interactions.get(pulseId);
    return interaction?.comments || [];
  }

  // Obter contagem de comentários
  async getCommentCount(pulseId: string, defaultCount: number): Promise<number> {
    const interaction = this.interactions.get(pulseId);
    const localComments = interaction?.comments?.length || 0;
    return defaultCount + localComments;
  }

  // Deletar comentário
  async deleteComment(commentId: string, pulseId: string): Promise<boolean> {
    const interaction = this.interactions.get(pulseId);
    if (!interaction) return false;

    interaction.comments = interaction.comments.filter(c => c.id !== commentId);
    this.interactions.set(pulseId, interaction);

    return true;
  }
}

export const pulseCommentsService = new PulseCommentsService();