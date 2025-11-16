import { useTabBadges } from '@/hooks/useTabBadges';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Conversation, messageService } from '../../components/chat/MessageService';

function ChatItem({ chat, onPress }: { chat: Conversation; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress} activeOpacity={0.8}>
      <Image source={chat.avatar} style={styles.chatAvatar} />
      <View style={styles.chatTextContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.chatName}>{chat.name}</Text>
          {chat.verified && <Ionicons name="checkmark-circle" size={16} color="#2ECC71" style={{ marginLeft: 4 }} />}
        </View>
        <Text style={chat.lastMessage.includes('Chamada Ativa') ? styles.chatActive : styles.chatMessage} numberOfLines={1}>{chat.lastMessage}</Text>
        <Text style={styles.chatTime}>{chat.lastMessageTime}</Text>
      </View>
      <View style={styles.chatInfo}>
        {chat.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount.toString()}
            </Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color="#A0A4AE" />
      </View>
    </TouchableOpacity>
  );
}

const tabs = [
  { key: 'principal', label: 'Principal' },
  { key: 'arquivadas', label: 'Arquivadas' },
  { key: 'solicitacoes', label: 'Solicitações' },
];

export default function ConversasScreen() {
  const [selectedTab, setSelectedTab] = useState<'principal'|'arquivadas'|'solicitacoes'>('principal');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { updateBadge } = useTabBadges();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const loadedConversations = await messageService.getConversations();
        setConversations(loadedConversations);
        const totalUnreadChats = loadedConversations.filter(conv => conv.unreadCount > 0).length;
        updateBadge('conversas', totalUnreadChats);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [updateBadge]);

  const filteredChats = conversations.filter(chat => (chat.tab ?? 'principal') === selectedTab);

  const handleChatPress = (chatId: string) => {
    router.push(('/chat/' + chatId) as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error fetching conversations</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Suas Conversas</Text>
        <Image
          source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100' }}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A0A4AE" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="busque por contatos, mensagens e mais..."
          placeholderTextColor="#A0A4AE"
        />
      </View>
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={selectedTab === tab.key ? styles.tabActive : styles.tab}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={selectedTab === tab.key ? styles.tabTextActive : styles.tabText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedTab === 'solicitacoes' && (
        <Text style={styles.solicitacaoTitle}>Você possui {filteredChats.filter(c => c.unreadCount > 0).length} nova(s) solicitação(ões) de mensagem</Text>
      )}
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={() => handleChatPress(item.id)} />
        )}
        contentContainerStyle={styles.chatsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', paddingTop: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F7F8FA',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2532',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E2532',
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    backgroundColor: '#E5EAF0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#4576F2',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontWeight: '500',
    fontSize: 13,
    color: '#4A5463',
    textAlign: 'center',
    includeFontPadding: false,
  },
  tabTextActive: {
    fontWeight: '500',
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    includeFontPadding: false,
  },
  chatsList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  chatAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  chatName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E2532',
    marginRight: 2,
  },
  chatMessage: {
    fontSize: 13,
    color: '#4A5463',
    marginTop: 2,
  },
  chatActive: {
    fontSize: 13,
    color: '#2ECC71',
    marginTop: 2,
    fontWeight: '700',
  },
  chatInfo: {
    alignItems: 'flex-end',
    marginLeft: 8,
    minWidth: 60,
  },
  chatTime: {
    fontSize: 11,
    color: '#A0A4AE',
    marginTop: 2,
    textAlign: 'left',
  },
  badge: {
    backgroundColor: '#4576F2',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  solicitacaoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E2532',
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
});
