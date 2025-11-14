import PulseCard from '@/components/pulses/PulseCard';
import PulseCommentsModal from '@/components/pulses/PulseCommentsModal';
import { PulseData } from '@/components/pulses/PulseData';
import { pulseStorageService } from '@/components/pulses/PulseStorageService';
import { SafeHeaderStyles } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PulsesScreen() {
  const [pulses, setPulses] = useState<PulseData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedPulseId, setSelectedPulseId] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  // Carregar pulses usando o storage service
  const loadPulses = async () => {
    try {
      const data = await pulseStorageService.getPulses();
      setPulses(data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar pulses');
    }
  };

  // Refresh dos pulses
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPulses();
    setRefreshing(false);
  };



  // Reset to first item when screen comes into focus and load data
  useFocusEffect(
    useCallback(() => {
      loadPulses();
      setCurrentIndex(0);
      if (flatListRef.current && pulses.length > 0) {
        flatListRef.current.scrollToIndex({ index: 0, animated: false });
      }
    }, [])
  );

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  };

  const handleLike = async (pulseId: string) => {
    try {
      const pulse = pulses.find(p => p.id === pulseId);
      if (!pulse) return;

      const result = await pulseStorageService.toggleLike(
        pulseId, 
        pulse.interactions.likes.count
      );

      setPulses(prevPulses =>
        prevPulses.map(p =>
          p.id === pulseId
            ? {
                ...p,
                interactions: {
                  ...p.interactions,
                  likes: {
                    ...p.interactions.likes,
                    isLiked: result.isLiked,
                    count: result.likeCount
                  }
                }
              }
            : p
        )
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao curtir pulse');
    }
  };

  const handleComment = (pulseId: string) => {
    setSelectedPulseId(pulseId);
    setCommentsModalVisible(true);
  };

  const handleShare = (pulseId: string) => {
    const pulse = pulses.find(p => p.id === pulseId);
    Alert.alert(
      'Compartilhar Pulse',
      `Compartilhar pulse de "${pulse?.author.name}" com seus contatos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartilhar', onPress: () => console.log('Sharing pulse:', pulseId) }
      ]
    );
  };

  const handleFollow = async (authorId: string) => {
    try {
      const isFollowing = await pulseStorageService.toggleFollow(authorId);
      
      setPulses(prevPulses =>
        prevPulses.map(pulse =>
          pulse.author.id === authorId
            ? {
                ...pulse,
                author: {
                  ...pulse.author,
                  isFollowing: isFollowing,
                },
              }
            : pulse
        )
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao seguir usuário');
    }
  };

  const handleCommentAdded = async () => {
    // Atualizar o contador de comentários do pulse
    const updatedPulses = await Promise.all(
      pulses.map(async (pulse) => {
        if (pulse.id === selectedPulseId) {
          const status = await pulseStorageService.getInteractionStatus(pulse.id);
          return {
            ...pulse,
            interactions: {
              ...pulse.interactions,
              comments: {
                count: status.commentCount
              }
            }
          };
        }
        return pulse;
      })
    );
    setPulses(updatedPulses);
  };

  const renderPulseItem = ({ item, index }: { item: PulseData; index: number }) => (
    <View style={{ width: screenWidth, height: screenHeight }}>
      <PulseCard
        pulse={item}
        isActive={index === currentIndex}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onFollow={handleFollow}
      />
    </View>
  );

  const getItemLayout = (_: any, index: number) => ({
    length: screenHeight,
    offset: screenHeight * index,
    index,
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <FlatList
        ref={flatListRef}
        data={pulses}
        renderItem={renderPulseItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        snapToAlignment="center"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        removeClippedSubviews={false}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
        bounces={false}
        scrollEventThrottle={16}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
            titleColor="white"
          />
        }
      />

      {/* Header transparente sobreposto */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 16 }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
              <Ionicons name="pulse-outline" size={20} color="#ffffffff" style={{ marginRight: 4 }} />
              <Text style={styles.headerTitle}>Pulses</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/pulses/create-pulse')} 
            style={styles.headerButton}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Comentários */}
      <PulseCommentsModal
        visible={commentsModalVisible}
        pulseId={selectedPulseId}
        onClose={() => setCommentsModalVisible(false)}
        onCommentAdded={handleCommentAdded}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  headerButton: {
    ...SafeHeaderStyles.headerButton,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
});