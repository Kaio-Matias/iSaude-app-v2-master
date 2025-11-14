import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CreateStoryModal from './CreateStoryModal';
import { Story } from './StoriesData';
import { storiesService } from './StoriesService';
import StoryViewer from './StoryViewer';

interface StoriesSectionProps {
  onStoryCreated?: () => void;
}

export default function StoriesSection({ onStoryCreated }: StoriesSectionProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [showViewer, setShowViewer] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = () => {
    const allStories = storiesService.getStories();
    
    // Separar o usuário atual dos outros
    const currentUserStory = allStories.find(story => story.user.id === 'current-user');
    const otherStories = allStories.filter(story => story.user.id !== 'current-user');
    
    // Ordenar stories: não visualizados primeiro, depois visualizados
    const sortedOtherStories = otherStories.sort((a, b) => {
      // Stories com conteúdo novo (não visualizado) vêm primeiro
      if (a.hasNewStories && !b.hasNewStories) return -1;
      if (!a.hasNewStories && b.hasNewStories) return 1;
      return 0; // Manter ordem original se ambos têm o mesmo status
    });
    
    // Se o usuário tem stories, adicionar com nome diferente para visualizar
    const storiesToShow = [...sortedOtherStories];
    
    if (currentUserStory && currentUserStory.stories.length > 0) {
      storiesToShow.unshift({
        ...currentUserStory,
        id: 'current-user-view',
        user: {
          ...currentUserStory.user,
          name: 'Meus Flashs'
        }
      });
    }
    
    // Sempre adicionar o botão de criar no início
    storiesToShow.unshift({
      id: 'create-story',
      user: {
        id: 'create-story',
        name: 'Criar Flash',
        avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100' }
      },
      stories: [],
      hasNewStories: false
    });
    
    setStories(storiesToShow);
  };

  const handleStoryPress = (storyIndex: number, itemIndex: number = 0) => {
    const story = stories[storyIndex];
    if (!story || story.stories.length === 0) return;
    
    // Filtrar apenas stories válidas (sem o botão criar)
    const validStories = stories.filter(s => s.stories.length > 0);
    
    // Encontrar o índice do story clicado na lista filtrada
    const mappedIndex = validStories.findIndex(s => s.id === story.id);
    
    if (mappedIndex !== -1) {
      setSelectedStoryIndex(mappedIndex);
      setSelectedItemIndex(itemIndex);
      setShowViewer(true);
    }
  };

  const handleCreateStory = () => {
    setShowCreateModal(true);
  };

  const handleStoryCreated = () => {
    loadStories();
    onStoryCreated?.();
  };

  const renderStoryItem = ({ item, index }: { item: Story; index: number }) => {
    const isCreateButton = item.user.id === 'create-story';
    
    return (
      <TouchableOpacity
        style={styles.storyItem}
        onPress={() => {
          if (isCreateButton) {
            handleCreateStory(); // Botão criar sempre abre modal de criação
          } else {
            handleStoryPress(index); // Outros usuários e "Meus Flashs" abrem viewer
          }
        }}
      >
        <View style={[
          styles.storyContainer,
          // Aplicar borda diretamente baseado no estado
          (!isCreateButton && item.hasNewStories) ? {
            borderWidth: 3,
            borderColor: '#007AFF',
            borderRadius: 16,
          } : null,
          // Borda cinza pontilhada para stories já vistos
          (!isCreateButton && !item.hasNewStories && item.stories.length > 0) ? {
            borderWidth: 2,
            borderColor: '#C7C7CC',
            borderStyle: 'dotted',
            borderRadius: 16,
          } : null,
          isCreateButton ? {
          } : null
        ]}>
          <View style={styles.storyAvatarWrapper}>
            <Image source={item.user.avatar} style={styles.storyAvatar} />
            {isCreateButton && (
              <View style={styles.addIcon}>
                <Ionicons name="add" size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
        </View>
        <Text style={styles.storyLabel} numberOfLines={1}>
          {item.user.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flashs</Text>
      </View>
      
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderStoryItem}
        contentContainerStyle={styles.storiesContainer}
      />

      <StoryViewer
        visible={showViewer}
        stories={stories.filter(story => story.stories.length > 0)}
        initialStoryIndex={selectedStoryIndex}
        initialItemIndex={selectedItemIndex}
        onClose={() => {
          setShowViewer(false);
          // Recarregar stories para atualizar bordas após visualizar
          loadStories();
        }}
        onStoryChange={(storyIndex, itemIndex) => {
          setSelectedStoryIndex(storyIndex);
          setSelectedItemIndex(itemIndex);
        }}
      />

      <CreateStoryModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onStoryCreated={handleStoryCreated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF1F5',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5EAF0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E2532',
  },
  storiesContainer: {
    paddingHorizontal: 12,
  },
  storyItem: {
    width: 80,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70,
    height: 70,
    justifyContent: 'center',
    borderRadius: 35,
  },
  storyAvatarWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  addIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#4576F2',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 15, // Fica por cima de tudo
  },
  storyLabel: {
    fontSize: 11,
    color: '#163771',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 75,
  },
});