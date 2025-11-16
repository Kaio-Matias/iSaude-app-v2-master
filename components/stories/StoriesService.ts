import api from '../../lib/api';
import { Story, StoryItem } from './StoriesData';

class StoriesService {
  private stories: Story[] = [];
  private viewedStories: Set<string> = new Set();

  constructor() {
    this.getStories();
  }

  // Obter todas as stories
  async getStories(): Promise<Story[]> {
    try {
      const response = await api.get('/stories');
      this.stories = response.data;
      return this.stories.map(story => ({
        ...story,
        hasNewStories: story.stories.some(storyItem => !this.viewedStories.has(storyItem.id))
      }));
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  }

  // Obter stories de um usuário específico
  getUserStories(userId: string): Story | null {
    return this.stories.find(story => story.user.id === userId) || null;
  }

  // Marcar story como visualizada
  markStoryAsViewed(storyId: string): void {
    this.viewedStories.add(storyId);
  }

  // Verificar se story foi visualizada
  isStoryViewed(storyId: string): boolean {
    return this.viewedStories.has(storyId);
  }

  // Adicionar nova story do usuário atual
  addUserStory(content: string, type: 'text' | 'image' | 'video', backgroundColorOrUri?: string, caption?: string, captionPosition?: 'top' | 'center' | 'bottom'): void {
    console.log('Adicionando story:', { content, type, backgroundColorOrUri, caption, captionPosition });
    
    const currentUserStory = this.stories.find(story => story.user.id === 'current-user');
    
    if (currentUserStory) {
      const newStory: StoryItem = {
        id: `user-story-${Date.now()}`,
        type,
        content: type === 'text' ? content : backgroundColorOrUri || content, // Para imagens/vídeos, usa a URI
        timestamp: Date.now(),
        backgroundColor: type === 'text' ? (backgroundColorOrUri || '#4576F2') : undefined, // Só usa cor de fundo para texto
        textColor: '#FFFFFF',
        duration: type === 'video' ? 15000 : 5000, // 15s para vídeo, 5s para outros
        caption: caption && caption.trim() ? caption.trim() : undefined,
        captionPosition: captionPosition || 'bottom',
      };

      console.log('Story criado:', newStory);
      currentUserStory.stories.unshift(newStory); // Adiciona no início
      
      // Remove stories antigas se tiver mais de 10
      if (currentUserStory.stories.length > 10) {
        currentUserStory.stories = currentUserStory.stories.slice(0, 10);
      }
      
      currentUserStory.hasNewStories = true;
    }
  }

  // Remover story do usuário atual
  removeUserStory(storyId: string): boolean {
    const currentUserStory = this.stories.find(story => story.user.id === 'current-user');
    
    if (currentUserStory) {
      const initialLength = currentUserStory.stories.length;
      currentUserStory.stories = currentUserStory.stories.filter(story => story.id !== storyId);
      return currentUserStory.stories.length < initialLength;
    }
    
    return false;
  }

  // Obter stories não visualizadas
  getUnviewedStoriesCount(): number {
    let count = 0;
    this.stories.forEach(story => {
      story.stories.forEach(storyItem => {
        if (!this.viewedStories.has(storyItem.id)) {
          count++;
        }
      });
    });
    return count;
  }

  // Limpar stories antigas (mais de 24h)
  cleanOldStories(): void {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    this.stories.forEach(story => {
      story.stories = story.stories.filter(storyItem => {
        return (now - storyItem.timestamp) < twentyFourHours;
      });
    });

    // Remove stories vazias (exceto do usuário atual)
    this.stories = this.stories.filter(story => 
      story.user.id === 'current-user' || story.stories.length > 0
    );
  }

  // Método para resetar visualizações (para testes)
  resetViewedStories(): void {
    this.viewedStories.clear();
  }

  // Método para marcar todos os stories de um usuário como visualizados
  markAllUserStoriesAsViewed(userId: string): void {
    const userStory = this.stories.find(story => story.user.id === userId);
    if (userStory) {
      userStory.stories.forEach(story => {
        this.viewedStories.add(story.id);
      });
    }
  }
}

export const storiesService = new StoriesService();