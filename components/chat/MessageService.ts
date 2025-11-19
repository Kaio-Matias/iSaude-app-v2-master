import api from '../../lib/api';

// Serviço de gerenciamento de mensagens e conversas
// Mantém o estado das mensagens não lidas durante a sessão

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: any;
  lastMessage: string;
  lastMessageTime: string;
  verified: boolean;
  unreadCount: number;
  messages: Message[];
  tab?: 'principal' | 'arquivadas' | 'solicitacoes';
}

class MessageService {
  // TODO: A propriedade conversations foi removida. A gestão de estado
  // deve ser reavaliada, talvez com um cache ou uma biblioteca de state management.
  // private conversations: Conversation[] = [];

  constructor() {
    // O construtor está vazio agora, a inicialização de dados é feita via API.
  }

  // Obter todas as conversas da API
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get('/api/social-midia/conversations');
      // TODO: Adicionar validação e mapeamento de dados se a resposta da API
      // for diferente da interface Conversation.
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return []; // 404 é esperado, retorna vazio sem logar erro.
      }
      console.error('Erro ao buscar conversas:', error);
      return []; // Retorna um array vazio para outros erros.
    }
  }

  // Obter conversa por ID da API
  async getConversationById(id: string): Promise<Conversation | undefined> {
    try {
      // Endpoint corrigido para /api/chat/{id}
      const response = await api.get(`/api/chat/${id}`);
      // TODO: Adicionar validação e mapeamento de dados.
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar conversa com id ${id}:`, error);
      return undefined;
    }
  }

  // Adicionar uma nova mensagem a uma conversa
  async addMessageToConversation(conversationId: string, text: string): Promise<Message> {
    try {
      const response = await api.post(`/api/chat/${conversationId}/messages`, { text });
      return response.data.message;
    } catch (error) {
      console.error(`Erro ao enviar mensagem para a conversa ${conversationId}:`, error);
      throw error;
    }
  }

  // Marcar mensagens de uma conversa como lidas
  async markConversationAsRead(conversationId: string): Promise<void> {
    try {
      await api.put(`/api/chat/${conversationId}/read`);
    } catch (error) {
      console.error(`Erro ao marcar a conversa ${conversationId} como lida:`, error);
      // Não lançar erro aqui para não quebrar a UI se a chamada falhar
    }
  }

  // TODO: Implementar os métodos abaixo com chamadas de API (POST, PUT, etc.)

  // Obter total de mensagens não lidas
  getTotalUnreadMessages(): number {
    console.warn('getTotalUnreadMessages não está implementado com API');
    return 0;
    // return this.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }

  // Simular novas mensagens (para teste)
  simulateNewMessages(): void {
    console.warn('simulateNewMessages não está implementado com API');
    // // Adicionar mensagem ao Dr. Marcos Toledo
    // this.addMessageToConversation('1', {
    //   text: 'Não esqueça da consulta amanhã às 10h!',
    //   senderId: '1',
    // });

    // // Adicionar mensagem à Jamile Correa
    // this.addMessageToConversation('3', {
    //   text: 'Que bom te ver online! Como foi seu dia?',
    //   senderId: '3',
    // });
  }
}

export const messageService = new MessageService();