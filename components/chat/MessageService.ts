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
  private conversations: Conversation[] = [];

  constructor() {
    this.initializeMockConversations();
  }

  private initializeMockConversations() {
    const conversationsData = [
      {
        id: '1',
        name: 'Dr. Marcos Toledo',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=MarcosToledo&backgroundColor=20B2AA&size=100' },
        lastMessage: 'Chamada Ativa',
        lastMessageTime: 'Há 05 Minutos',
        verified: true,
        unreadCount: 2,
        tab: 'principal' as const,
        messages: [
          {
            id: 'm1-1',
            text: 'Olá! Como você está se sentindo hoje?',
            senderId: '1',
            timestamp: Date.now() - 300000,
            isRead: false,
          },
          {
            id: 'm1-2',
            text: 'Estou bem, obrigado! E você?',
            senderId: 'user',
            timestamp: Date.now() - 240000,
            isRead: true,
          },
          {
            id: 'm1-3',
            text: 'Que bom! Lembre-se de tomar seus remédios',
            senderId: '1',
            timestamp: Date.now() - 180000,
            isRead: false,
          },
        ],
      },
      {
        id: '2',
        name: 'Dra. Maria Genda',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=MariaGenda&backgroundColor=2ECC71&size=100' },
        lastMessage: 'Vou precisar apenas do seu cpf para fazer o agendamento...',
        lastMessageTime: 'Há 05 Minutos',
        verified: true,
        unreadCount: 0,
        tab: 'principal' as const,
        messages: [
          {
            id: 'm2-1',
            text: 'Olá! Gostaria de agendar uma consulta?',
            senderId: '2',
            timestamp: Date.now() - 600000,
            isRead: true,
          },
        ],
      },
      {
        id: '3',
        name: 'Jamile Correa',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JamileCorrea&backgroundColor=E74C3C&size=100' },
        lastMessage: 'KKKKKKKK Eu não acredito!',
        lastMessageTime: 'Há 05 Minutos',
        verified: false,
        unreadCount: 1,
        tab: 'principal' as const,
        messages: [
          {
            id: 'm3-1',
            text: 'KKKKKKKK Eu não acredito!',
            senderId: '3',
            timestamp: Date.now() - 120000,
            isRead: false,
          },
        ],
      },
      {
        id: '4',
        name: 'Luana Paiva',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=LuanaPaiva&backgroundColor=27AE60&size=100' },
        lastMessage: 'Você: Olá! Bom dia amiga',
        lastMessageTime: 'Há 05 Minutos',
        verified: false,
        unreadCount: 0,
        tab: 'principal' as const,
        messages: [
          {
            id: 'm4-1',
            text: 'Olá! Bom dia amiga',
            senderId: 'user',
            timestamp: Date.now() - 300000,
            isRead: true,
          },
        ],
      },
      {
        id: '5',
        name: 'Dr. Walter Alencar',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=WalterAlencar&backgroundColor=9B59B6&size=100' },
        lastMessage: 'Fico no aguardo da nossa Consulta',
        lastMessageTime: 'Há 05 Minutos',
        verified: true,
        unreadCount: 0,
        tab: 'principal' as const,
        messages: [],
      },
      {
        id: '6',
        name: 'iSaúde',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Isaude&backgroundColor=4576F2&size=100' },
        lastMessage: 'Você sabia que no iSaúde, você tem muito mais qualidade de vida?',
        lastMessageTime: 'Há 2 dias',
        verified: true,
        unreadCount: 0,
        tab: 'principal' as const,
        messages: [],
      },
      {
        id: '7',
        name: 'Joana Pinha',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JoanaPinha&backgroundColor=2ECC71&size=100' },
        lastMessage: 'Você: Claro amiga!',
        lastMessageTime: 'Há 17 dias',
        verified: true,
        unreadCount: 1,
        tab: 'solicitacoes' as const,
        messages: [
          {
            id: 'm7-1',
            text: 'Oi! Vi seu perfil no iSaúde e gostaria de conectar',
            senderId: '7',
            timestamp: Date.now() - 86400000 * 17,
            isRead: false,
          },
        ],
      },
    ];

    this.conversations = conversationsData;
  }

  // Obter todas as conversas
  getConversations(): Conversation[] {
    return this.conversations;
  }

  // Obter conversa por ID
  getConversationById(id: string): Conversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  // Obter total de mensagens não lidas
  getTotalUnreadMessages(): number {
    return this.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }

  // Marcar mensagens de uma conversa como lidas
  markConversationAsRead(conversationId: string): void {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      conversation.messages.forEach(message => {
        if (message.senderId !== 'user') {
          message.isRead = true;
        }
      });
    }
  }

  // Adicionar uma nova mensagem a uma conversa
  addMessageToConversation(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): void {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      const newMessage: Message = {
        ...message,
        id: `${conversationId}-${Date.now()}`,
        timestamp: Date.now(),
        isRead: message.senderId === 'user', // Mensagens do usuário são automaticamente lidas
      };

      conversation.messages.push(newMessage);
      conversation.lastMessage = message.senderId === 'user' ? `Você: ${message.text}` : message.text;
      conversation.lastMessageTime = 'Agora';

      // Incrementar contador de não lidas se não for mensagem do usuário
      if (message.senderId !== 'user') {
        conversation.unreadCount += 1;
      }
    }
  }

  // Simular novas mensagens (para teste)
  simulateNewMessages(): void {
    // Adicionar mensagem ao Dr. Marcos Toledo
    this.addMessageToConversation('1', {
      text: 'Não esqueça da consulta amanhã às 10h!',
      senderId: '1',
    });

    // Adicionar mensagem à Jamile Correa
    this.addMessageToConversation('3', {
      text: 'Que bom te ver online! Como foi seu dia?',
      senderId: '3',
    });
  }
}

export const messageService = new MessageService();