import { messageService } from '@/components/chat/MessageService';
import { notificationService } from '@/components/notifications/NotificationService';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface TabBadges {
  home: number;
  explorar: number;
  atendimentos: number;
  conversas: number;
}

interface TabBadgesContextType {
  badges: TabBadges;
  updateBadge: (tab: keyof TabBadges, count: number) => void;
  getTotalUnread: () => number;
}

const TabBadgesContext = createContext<TabBadgesContextType | undefined>(undefined);

export function TabBadgesProvider({ children }: { children: ReactNode }) {
  const [badges, setBadges] = useState<TabBadges>({
    home: 0,
    explorar: 0,
    atendimentos: 0,
    conversas: 0,
  });

  // Inicializar badges quando o app abre
  useEffect(() => {
    const initializeBadges = () => {
      const notifications = notificationService.getUnreadCount();
      const conversations = messageService.getConversations();
      const unreadChats = conversations.filter(conv => conv.unreadCount > 0).length;

      setBadges({
        home: notifications,
        explorar: 0, // TODO: implementar quando explorar for desenvolvido
        atendimentos: 0, // TODO: implementar quando atendimentos for desenvolvido
        conversas: unreadChats,
      });
    };

    initializeBadges();
  }, []);

  const updateBadge = (tab: keyof TabBadges, count: number) => {
    setBadges(prev => ({
      ...prev,
      [tab]: count,
    }));
  };

  const getTotalUnread = () => {
    return Object.values(badges).reduce((total, count) => total + count, 0);
  };

  return (
    <TabBadgesContext.Provider value={{ badges, updateBadge, getTotalUnread }}>
      {children}
    </TabBadgesContext.Provider>
  );
}

export function useTabBadges() {
  const context = useContext(TabBadgesContext);
  if (context === undefined) {
    throw new Error('useTabBadges must be used within a TabBadgesProvider');
  }
  return context;
}