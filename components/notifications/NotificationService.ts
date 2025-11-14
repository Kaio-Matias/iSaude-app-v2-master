// Serviço de gerenciamento de notificações
// Mantém o estado das notificações não vistas durante a sessão

export interface Notification {
  id: string;
  type: 'consulta' | 'curtiu' | 'seguiu' | 'comentario' | 'mencionado';
  title?: string;
  description?: string;
  user?: {
    name: string;
    avatar: any;
  };
  post?: any;
  time: string;
  message?: string;
  canFollowBack?: boolean;
  canRemove?: boolean;
  isRead?: boolean;
}

class NotificationService {
  private notifications: Notification[] = [];
  private unreadCount: number = 0;

  constructor() {
    this.initializeMockNotifications();
  }

  private initializeMockNotifications() {
    const avatars = {
      jorge: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JorgeZikenay&backgroundColor=FF6B6B&size=100' },
      ana: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=AnaPaulaNutri&backgroundColor=2ECC71&size=100' },
      user: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100' },
    };

    // Mock de posts para usar nas notificações
    const posts = [
      {
        id: 'p1',
        image: require('@/assets/images/publicacao1.png'),
        time: 'Há 05 Minutos',
        title: 'Publicação 1',
      },
      {
        id: 'p2',
        image: require('@/assets/images/publicacao1.png'),
        time: 'Há 05 Minutos',
        title: 'Publicação 2',
      },
    ];

    const notificationsToday = [
      {
        id: '1',
        type: 'consulta' as const,
        icon: require('@/assets/images/informacoes.png'),
        title: 'Consulta agendada para hoje.',
        description: 'A consulta com a Dra. Maria Glenda irá iniciar hoje às...',
        time: 'Há 05 Minutos',
        isRead: false,
      },
      {
        id: '2',
        type: 'curtiu' as const,
        user: {
          name: 'Nome de Usuário',
          avatar: avatars.ana,
        },
        post: posts[0],
        time: posts[0].time,
        message: 'curtiu sua publicação.',
        isRead: false,
      },
      {
        id: '3',
        type: 'curtiu' as const,
        user: {
          name: 'Nome de Usuário',
          avatar: avatars.jorge,
        },
        post: posts[0],
        time: posts[0].time,
        message: 'curtiu sua publicação.',
        isRead: false,
      },
      {
        id: '4',
        type: 'curtiu' as const,
        user: {
          name: 'Nome de Usuário',
          avatar: avatars.ana,
        },
        post: posts[0],
        time: posts[0].time,
        message: 'curtiu sua publicação.',
        isRead: false,
      },
      {
        id: '5',
        type: 'curtiu' as const,
        user: {
          name: 'Nome de Usuário',
          avatar: avatars.jorge,
        },
        post: posts[0],
        time: posts[0].time,
        message: 'curtiu sua publicação.',
        isRead: false,
      },
      {
        id: '6',
        type: 'curtiu' as const,
        user: {
          name: 'Nome de Usuário',
          avatar: avatars.ana,
        },
        post: posts[0],
        time: posts[0].time,
        message: 'curtiu sua publicação.',
        isRead: false,
      },
      {
        id: '7',
        type: 'seguiu' as const,
        user: {
          name: 'Nome de Usuário',
          avatar: avatars.jorge,
        },
        time: posts[0].time,
        message: 'começou a seguir você.',
        canFollowBack: true,
        isRead: false,
      },
      {
        id: '8',
        type: 'mencionado' as const,
        user: {
          name: 'Nome de Usuário',
          avatar: avatars.ana,
        },
        post: posts[0],
        time: posts[0].time,
        message: 'mencionou você em um comentário.',
        isRead: false,
      },
    ];

    const notificationsWeek = [
      {
        id: '9',
        type: 'seguiu' as const,
        user: {
          name: 'Nome de Usuário',
          avatar: avatars.jorge,
        },
        time: posts[0].time,
        message: 'pediu para se conectar.',
        canFollowBack: true,
        canRemove: true,
        isRead: true, // Notificações antigas já são consideradas lidas
      },
      {
        id: '10',
        type: 'comentario' as const,
        user: {
          name: 'Nome de Usuário',
          avatar: require('@/assets/images/ana.png'),
        },
        post: posts[0],
        time: posts[0].time,
        message: 'que você conhece está no iSaúde.',
        isRead: true,
      },
    ];

    this.notifications = [...notificationsToday, ...notificationsWeek];
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  // Obter todas as notificações
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Obter notificações não lidas
  getUnreadCount(): number {
    return this.unreadCount;
  }

  // Marcar todas as notificações como lidas
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.updateUnreadCount();
  }

  // Adicionar uma nova notificação (simula chegada de nova notificação)
  addNotification(notification: Omit<Notification, 'id' | 'isRead'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
    };
    this.notifications.unshift(newNotification); // Adiciona no início
    this.updateUnreadCount();
  }

  // Simular chegada de novas notificações (para teste)
  simulateNewNotifications(): void {
    const avatars = {
      jorge: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JorgeZikenay&backgroundColor=FF6B6B&size=100' },
      ana: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=AnaPaulaNutri&backgroundColor=2ECC71&size=100' },
    };

    const posts = [{
      id: 'p1',
      image: require('@/assets/images/publicacao1.png'),
      time: 'Agora',
      title: 'Nova Publicação',
    }];

    // Adiciona algumas notificações novas
    this.addNotification({
      type: 'curtiu',
      user: {
        name: 'Novo Usuário',
        avatar: avatars.jorge,
      },
      post: posts[0],
      time: 'Agora',
      message: 'curtiu sua publicação.',
    });

    this.addNotification({
      type: 'seguiu',
      user: {
        name: 'Outro Usuário',
        avatar: avatars.ana,
      },
      time: 'Agora',
      message: 'começou a seguir você.',
      canFollowBack: true,
    });
  }
}

export const notificationService = new NotificationService();