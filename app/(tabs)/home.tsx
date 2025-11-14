import { Post, PostCard, storageService } from '@/components/feed';
import { notificationService } from '@/components/notifications/NotificationService';
import { CreatePostButton } from '@/components/post';
import { StoriesSection } from '@/components/stories';
import { useTabBadges } from '@/hooks/useTabBadges';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function HomeScreen() {
  // Placeholder: integrar com backend / async storage depois
  const [isValidated] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const { updateBadge } = useTabBadges();

  useEffect(() => {
    loadPosts();
    updateUnreadCounts();
  }, [updateBadge]);

  // Recarregar posts quando a tela receber foco (volta da tela de criar post)
  useFocusEffect(
    useCallback(() => {
      loadPosts();
      updateUnreadCounts();
    }, [updateBadge])
  );

  const loadPosts = () => {
    setPosts(storageService.getPosts());
  };

  const updateUnreadCounts = () => {
    const notifications = notificationService.getUnreadCount();
    
    setUnreadNotifications(notifications);
    
    // Atualizar badge da tab home com notificações não lidas
    updateBadge('home', notifications);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
    updateUnreadCounts();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleLike = (postId: string) => {
    // O PostCard já gerencia seu próprio estado de like
    // Não precisamos atualizar a lista aqui para evitar flickering
    console.log('Like no post:', postId);
  };

  const handleDelete = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={handleLike}
      onDelete={handleDelete}
    />
  );



  const handleStoryCreated = () => {
    // Stories são automaticamente recarregadas pelo StoriesSection
    loadPosts();
    console.log('Story criado!');
  };

  const renderStoriesAndTabs = () => (
    <View>
      <StoriesSection onStoryCreated={handleStoryCreated} />
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tabButtonActive} activeOpacity={0.8}>
          <Text style={styles.tabTextActive}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabButtonInactive} 
          activeOpacity={0.8}
          onPress={() => router.push('/pulses')}
        >
          <Ionicons name="pulse-outline" size={12} color="#6B7480" style={{ marginRight: 4 }} />
          <Text style={styles.tabTextInactive}>Pulses</Text>
        </TouchableOpacity>
      </View>
    </View> 
  );

  const ListHeader = () => (
    <>
      {/* {!isValidated && (
        <TouchableOpacity style={styles.validationBanner} onPress={() => router.push('/validacao/pre-validacao')} activeOpacity={0.8}>
          <Text style={styles.validationTitle}>Você ainda não poderá oferecer serviços.</Text>
          <Text style={styles.validationSubtitle}>A verificação de seus documentos profissionais é necessária para começar a atender pelo iSaúde.</Text>
          <View style={styles.progressBar}><View style={styles.progressFill} /></View>
        </TouchableOpacity>
      )} */}
      {renderStoriesAndTabs()}
    </>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Image 
          source={require('@/assets/images/isaudeicon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.headerActions}>
        <View style={styles.notificationButtonContainer}>
          <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/(tabs)/notificacoes')}>
            <Ionicons name="notifications-outline" size={24} color="#4A5463" />
          </TouchableOpacity>
          <NotificationBadge count={unreadNotifications} />
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100' }} 
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleCreateNote = () => {
    console.log('Criar nota');
    // Navegar para tela de criar nota (sem abrir modal)
    router.push('./post/create-note');
  };

  const handleCreateMedia = () => {
    console.log('Criar post com fotos/vídeos');
    // Navegar para a mesma tela mas com modal de galeria aberto
    router.push('./post/create-note?gallery=true');
  };

  const handleCreatePulse = () => {
    console.log('Criar pulse');
    // TODO: Funcionalidade em desenvolvimento
    Alert.alert('Em breve', 'A funcionalidade Pulse estará disponível em breve!');
  };

  const NotificationBadge = ({ count }: { count: number }) => {
    if (count === 0) return null;

    return (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {count > 99 ? '99+' : count.toString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container]} edges={['top']}>
      {renderHeader()}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListHeaderComponent={ListHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Botão de Criar Post */}
      <CreatePostButton
        onCreateNote={handleCreateNote}
        onCreateMedia={handleCreateMedia}
        onCreatePulse={handleCreatePulse}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFF1F5' },
  header: {
    height: 80,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5EAF0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 32,
    marginRight: 8,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4576F2',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButtonContainer: {
    position: 'relative',
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  feedContent: { paddingBottom: 32, paddingTop: 0 },
  validationBanner: {backgroundColor: '#FFFFFF',borderBottomColor: '#E5EAF0', borderBottomWidth: StyleSheet.hairlineWidth,paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10,},
  validationTitle: { fontSize: 13, fontWeight: '600', color: '#1E2532' },
  validationSubtitle: { fontSize: 12, lineHeight: 16, color: '#4A5463' },
  progressBar: { height: 3, backgroundColor: '#E2E8F0', borderRadius: 2, marginTop: 10, overflow: 'hidden' },
  progressFill: { width: '25%', height: '100%', backgroundColor: '#3366FF' },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginRight: 16, // Alinha com a margem direita do feed (16px)
    paddingVertical: 8,
  },
  tabButtonActive: {
    backgroundColor: '#4576F2',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  tabButtonInactive: {
    backgroundColor: '#D8DCE5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabTextActive: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tabTextInactive: {
    fontSize: 12,
    color: '#6B7480',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3040',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
