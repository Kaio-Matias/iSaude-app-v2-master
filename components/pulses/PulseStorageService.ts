import api from '../../lib/api';
import { storiesService } from '../stories/StoriesService';
import { PulseData } from './PulseData';

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
  isLiked: boolean;
  likeCount: number;
  comments: PulseComment[];
}

class PulseStorageService {
  private interactions: Map<string, PulseInteraction> = new Map();
  private pulses: PulseData[] = [];

  constructor() {
    this.getPulses();
  }

  // Obter pulses
  async getPulses(): Promise<PulseData[]> {
    try {
      const response = await api.get('/pulses');
      this.pulses = response.data;
      return this.pulses;
    } catch (error) {
      console.error('Error fetching pulses:', error);
      return [];
    }
  }

  // Curtidas
  async toggleLike(pulseId: string, currentLikes: number): Promise<{ isLiked: boolean; likeCount: number }> {
    const interaction = this.interactions.get(pulseId) || {
      pulseId,
      isLiked: false,
      likeCount: currentLikes,
      comments: []
    };

    interaction.isLiked = !interaction.isLiked;
    interaction.likeCount = interaction.isLiked ? 
      interaction.likeCount + 1 : 
      interaction.likeCount - 1;

    this.interactions.set(pulseId, interaction);

    // Atualizar o pulse na lista
    const pulseIndex = this.pulses.findIndex(p => p.id === pulseId);
    if (pulseIndex !== -1) {
      this.pulses[pulseIndex].interactions.likes.isLiked = interaction.isLiked;
      this.pulses[pulseIndex].interactions.likes.count = interaction.likeCount;
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      isLiked: interaction.isLiked,
      likeCount: interaction.likeCount
    };
  }

  // Comentários
  async addComment(pulseId: string, text: string, user: string = 'Você', avatar: any = { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100' }): Promise<PulseComment> {
    const interaction = this.interactions.get(pulseId) || {
      pulseId,
      isLiked: false,
      likeCount: 0,
      comments: []
    };

    const newComment: PulseComment = {
      id: `comment-${Date.now()}`,
      pulseId,
      text,
      user,
      avatar,
      timestamp: Date.now()
    };

    interaction.comments.unshift(newComment);
    this.interactions.set(pulseId, interaction);

    // Atualizar contador de comentários no pulse
    const pulseIndex = this.pulses.findIndex(p => p.id === pulseId);
    if (pulseIndex !== -1) {
      this.pulses[pulseIndex].interactions.comments.count += 1;
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return newComment;
  }

  async getComments(pulseId: string): Promise<PulseComment[]> {
    const interaction = this.interactions.get(pulseId);
    const comments = interaction?.comments || [];
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return comments;
  }

  // Seguir/Deixar de seguir autor
  async toggleFollow(authorId: string): Promise<boolean> {
    this.pulses.forEach(pulse => {
      if (pulse.author.id === authorId) {
        pulse.author.isFollowing = !pulse.author.isFollowing;
      }
    });

    const isFollowing = this.pulses.find(p => p.author.id === authorId)?.author.isFollowing || false;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return isFollowing;
  }

  // Criar novo pulse
  async createPulse(data: {
    description: string;
    audience: 'public' | 'followers' | 'private';
    selectedPeople: any[];
    selectedLocation: string;
    selectedVideo: any;
    currentLocation?: {
      latitude: number;
      longitude: number;
      address: string;
    };
  }): Promise<PulseData> {
    const newPulse: PulseData = {
      id: `user-pulse-${Date.now()}`,
      author: {
        id: 'current_user',
        name: 'Você',
        avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=200',
        isVerified: false,
        specialty: 'Profissional de Saúde',
        isFollowing: false
      },
      video: {
        url: data.selectedVideo.uri,
        thumbnail: data.selectedVideo.uri,
        duration: Math.round((data.selectedVideo.duration || 30000) / 1000),
        resolution: {
          width: data.selectedVideo.width || 1080,
          height: data.selectedVideo.height || 1920
        }
      },
      content: {
        title: data.description.substring(0, 50) + (data.description.length > 50 ? '...' : ''),
        description: data.description
      },
      audio: {
        name: 'Som Original',
        artist: 'Você'
      },
      taggedPeople: {
        count: data.selectedPeople.length,
        users: data.selectedPeople.map((person, index) => ({
          id: `tagged-${index}`,
          name: person.name || person,
          avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${person.name || person}&size=100`
        }))
      },
      interactions: {
        likes: {
          count: 0,
          isLiked: false
        },
        comments: {
          count: 0
        },
        shares: {
          count: 0
        },
        views: {
          count: 0
        }
      },
      createdAt: new Date().toISOString(),
      location: data.selectedLocation ? {
        name: data.selectedLocation
      } : undefined,
      medicalCategory: 'education',
      visibility: data.audience
    };

    // Adicionar no início da lista
    this.pulses.unshift(newPulse);
    
    // Inicializar interações
    this.interactions.set(newPulse.id, {
      pulseId: newPulse.id,
      isLiked: false,
      likeCount: 0,
      comments: [],
    });

    // Adicionar aos stories
    storiesService.addUserStory(
      newPulse.video.url,
      'video',
      newPulse.video.url,
      newPulse.content.description ? `Pulse: ${newPulse.content.description}` : 'Novo Pulse publicado!',
      'bottom'
    );
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    return newPulse;
  }

  // Obter status de interação
  async getInteractionStatus(pulseId: string): Promise<{ isLiked: boolean; likeCount: number; commentCount: number }> {
    const interaction = this.interactions.get(pulseId);
    const pulse = this.pulses.find(p => p.id === pulseId);
    
    return {
      isLiked: interaction?.isLiked || false,
      likeCount: interaction?.likeCount || pulse?.interactions.likes.count || 0,
      commentCount: interaction?.comments.length || pulse?.interactions.comments.count || 0
    };
  }
}

export const pulseStorageService = new PulseStorageService();