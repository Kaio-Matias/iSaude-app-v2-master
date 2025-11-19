import api from '../../lib/api';

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
    this.getNotifications();
  }

  private async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get('/api/social-midia/notificacoes');
      this.notifications = response.data;
      this.updateUnreadCount();
      return this.notifications;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return []; // 404 é esperado, retorna vazio sem logar erro.
      }
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  private updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  // Obter todas as notificações
  getAllNotifications(): Notification[] {
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
      image: 'placeholder.png',
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