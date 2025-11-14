import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    Modal,
    PanResponder,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Story } from './StoriesData';
import { storiesService } from './StoriesService';

interface StoryViewerProps {
  visible: boolean;
  stories: Story[];
  initialStoryIndex: number;
  initialItemIndex: number;
  onClose: () => void;
  onStoryChange?: (storyIndex: number, itemIndex: number) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function StoryViewer({
  visible,
  stories,
  initialStoryIndex,
  initialItemIndex,
  onClose,
  onStoryChange,
}: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentItemIndex, setCurrentItemIndex] = useState(initialItemIndex);
  const [progress] = useState(new Animated.Value(0));
  const [paused, setPaused] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar com os índices iniciais quando mudarem
  useEffect(() => {
    setCurrentStoryIndex(initialStoryIndex);
    setCurrentItemIndex(initialItemIndex);
  }, [initialStoryIndex, initialItemIndex]);

  const currentStory = stories[currentStoryIndex];
  const currentItem = currentStory?.stories[currentItemIndex];

  const startProgress = () => {
    if (!currentItem) return;
    
    progress.setValue(0);
    const duration = currentItem.duration || 5000;
    
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished && !paused) {
        nextItem();
      }
    });
  };

  const stopProgress = () => {
    progress.stopAnimation();
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  useEffect(() => {
    if (visible && currentItem) {
      setMediaError(false); // Reset error state when changing story
      startProgress();
      storiesService.markStoryAsViewed(currentItem.id);
    }
    return () => stopProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, currentStoryIndex, currentItemIndex]);

  const nextItem = () => {
    const nextItemIdx = currentItemIndex + 1;
    
    if (nextItemIdx < currentStory.stories.length) {
      setCurrentItemIndex(nextItemIdx);
      onStoryChange?.(currentStoryIndex, nextItemIdx);
    } else {
      nextStory();
    }
  };

  const prevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      onStoryChange?.(currentStoryIndex, currentItemIndex - 1);
    } else {
      prevStory();
    }
  };

  const nextStory = () => {
    const nextStoryIdx = currentStoryIndex + 1;
    
    if (nextStoryIdx < stories.length) {
      setCurrentStoryIndex(nextStoryIdx);
      setCurrentItemIndex(0);
      onStoryChange?.(nextStoryIdx, 0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      const prevStoryIdx = currentStoryIndex - 1;
      const prevStory = stories[prevStoryIdx];
      const lastItemIdx = prevStory.stories.length - 1;
      
      setCurrentStoryIndex(prevStoryIdx);
      setCurrentItemIndex(lastItemIdx);
      onStoryChange?.(prevStoryIdx, lastItemIdx);
    } else {
      onClose();
    }
  };

  const handleDeleteStory = () => {
    if (currentStory.user.id === 'current-user') {
      Alert.alert(
        'Excluir Story',
        'Deseja excluir este story?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () => {
              if (currentItem?.id) {
                const success = storiesService.removeUserStory(currentItem.id);
                if (success) {
                  nextItem();
                }
              }
            }
          }
        ]
      );
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setPaused(true);
      stopProgress();
    },
    onPanResponderMove: () => {},
    onPanResponderRelease: (evt, gestureState) => {
      setPaused(false);
      
      if (Math.abs(gestureState.dy) > 100) {
        onClose();
      } else if (gestureState.dx > 50) {
        prevItem();
      } else if (gestureState.dx < -50) {
        nextItem();
      } else {
        startProgress();
      }
    },
  });

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {currentStory.stories.map((_, index) => (
        <View key={index} style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground} />
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width:
                  index < currentItemIndex
                    ? '100%'
                    : index === currentItemIndex
                    ? progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      })
                    : '0%',
              },
            ]}
          />
        </View>
      ))}
    </View>
  );

  const renderStoryContent = () => {
    if (!currentItem) return null;

    if (currentItem.type === 'text') {
      return (
        <View
          style={[
            styles.textStoryContainer,
            { backgroundColor: currentItem.backgroundColor || '#4576F2' },
          ]}
        >
          <Text
            style={[
              styles.textStoryContent,
              { color: currentItem.textColor || '#FFFFFF' },
            ]}
          >
            {currentItem.content}
          </Text>
        </View>
      );
    }

    if (currentItem.type === 'video') {
      console.log('Carregando vídeo no story:', currentItem.content);
      
      if (mediaError) {
        return (
          <View style={[styles.storyVideo, styles.errorContainer]}>
            <Ionicons name="videocam-outline" size={64} color="#fff" />
            <Text style={styles.errorText}>Erro ao carregar vídeo</Text>
            <Text style={styles.errorSubtext}>Toque para continuar</Text>
          </View>
        );
      }

      return (
        <View style={styles.mediaContainer}>
          <Video
            source={{ uri: currentItem.content }}
            style={styles.storyVideo}
            shouldPlay={!paused && !mediaError}
            isLooping={false}
            resizeMode={ResizeMode.COVER}
            onPlaybackStatusUpdate={(status: any) => {
              if ('isLoaded' in status && !status.isLoaded && 'error' in status) {
                console.log('Erro ao carregar vídeo:', status.error);
                setMediaError(true);
              }
              if ('didJustFinish' in status && status.didJustFinish) {
                nextItem();
              }
            }}
            onError={(error) => {
              console.log('Erro no vídeo:', error);
              setMediaError(true);
            }}
            onLoad={() => console.log('Vídeo carregado com sucesso')}
          />
          {currentItem.caption && currentItem.caption.trim() && (
            <View style={[
              styles.captionContainer,
              currentItem.captionPosition === 'top' && styles.captionTop,
              currentItem.captionPosition === 'center' && styles.captionCenter,
              currentItem.captionPosition === 'bottom' && styles.captionBottom,
            ]}>
              <Text style={styles.captionText}>{currentItem.caption}</Text>
            </View>
          )}
        </View>
      );
    }

    // Para imagem (tanto URL string quanto require)
    const imageSource = typeof currentItem.content === 'string' 
      ? { uri: currentItem.content }
      : currentItem.content;

    console.log('Carregando imagem no story:', {
      content: currentItem.content,
      imageSource,
      type: typeof currentItem.content
    });

    if (mediaError) {
      return (
        <View style={[styles.storyImage, styles.errorContainer]}>
          <Ionicons name="image-outline" size={64} color="#fff" />
          <Text style={styles.errorText}>Erro ao carregar imagem</Text>
          <Text style={styles.errorSubtext}>URI: {typeof currentItem.content === 'string' ? currentItem.content.substring(0, 50) + '...' : 'Asset local'}</Text>
        </View>
      );
    }

    return (
      <View style={styles.mediaContainer}>
        <Image
          source={imageSource}
          style={styles.storyImage}
          resizeMode="cover"
          onError={(error) => {
            console.error('Erro ao carregar imagem do story:', {
              error: error.nativeEvent.error,
              uri: imageSource,
              content: currentItem.content
            });
            setMediaError(true);
          }}
          onLoad={() => {
            console.log('Imagem do story carregada com sucesso');
            setMediaError(false);
          }}
          onLoadStart={() => console.log('Iniciando carregamento da imagem do story')}
          onLoadEnd={() => console.log('Carregamento da imagem finalizado')}
        />
        {currentItem.caption && currentItem.caption.trim() && (
          <View style={[
            styles.captionContainer,
            currentItem.captionPosition === 'top' && styles.captionTop,
            currentItem.captionPosition === 'center' && styles.captionCenter,
            currentItem.captionPosition === 'bottom' && styles.captionBottom,
          ]}>
            <Text style={styles.captionText}>{currentItem.caption}</Text>
          </View>
        )}
      </View>
    );
  };

  if (!visible || !currentStory) return null;

  return (
    <Modal visible={visible} animationType="fade">
      <SafeAreaView style={styles.container}>
        <View {...panResponder.panHandlers} style={styles.storyContainer}>
          {renderProgressBar()}
          
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image source={currentStory.user.avatar} style={styles.avatar} />
              <Text style={styles.userName}>{currentStory.user.name}</Text>
              <Text style={styles.timestamp}>
                {currentItem?.timestamp ? Math.floor((Date.now() - currentItem.timestamp) / 60000) : 0}m
              </Text>
            </View>
            <View style={styles.headerActions}>
              {currentStory.user.id === 'current-user' && (
                <TouchableOpacity style={styles.actionBtn} onPress={handleDeleteStory}>
                  <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {renderStoryContent()}

          {/* Tap areas */}
          <TouchableOpacity
            style={[styles.tapArea, { left: 0 }]}
            onPress={prevItem}
            activeOpacity={1}
          />
          <TouchableOpacity
            style={[styles.tapArea, { right: 0 }]}
            onPress={nextItem}
            activeOpacity={1}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  storyContainer: {
    flex: 1,
    position: 'relative',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 16,
    gap: 4,
    zIndex: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 2,
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    marginRight: 8,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 8,
  },
  textStoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  textStoryContent: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
  },
  storyImage: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  storyVideo: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  tapArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: screenWidth / 3,
    zIndex: 5,
  },
  errorContainer: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  mediaContainer: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
  captionContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  captionTop: {
    top: 120, // Abaixo do header e progress bar
  },
  captionCenter: {
    top: '50%',
    transform: [{ translateY: -25 }],
  },
  captionBottom: {
    bottom: 100, // Acima da área de toque
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
});