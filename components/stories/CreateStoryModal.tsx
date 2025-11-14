import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { storiesService } from './StoriesService';

interface CreateStoryModalProps {
  visible: boolean;
  onClose: () => void;
  onStoryCreated: () => void;
}



const backgroundColors = [
  '#4576F2', '#FF6B6B', '#20B2AA', '#9B59B6',
  '#E74C3C', '#27AE60', '#F39C12', '#2ECC71',
  '#3498DB', '#E67E22', '#8E44AD', '#16A085'
];

export default function CreateStoryModal({ visible, onClose, onStoryCreated }: CreateStoryModalProps) {
  const [storyText, setStoryText] = useState('');
  const [selectedColor, setSelectedColor] = useState(backgroundColors[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{uri: string; type: 'image' | 'video'} | null>(null);
  const [captionPosition, setCaptionPosition] = useState<'top' | 'center' | 'bottom'>('bottom');

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária', 
        'Precisamos de acesso à sua galeria para selecionar fotos e vídeos.'
      );
      return false;
    }
    return true;
  };

  const selectPhoto = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.9, // Aumentar qualidade para evitar imagens corrompidas
        allowsMultipleSelection: false,
        base64: false, // Não precisamos de base64
        exif: false, // Não precisamos de dados EXIF
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        console.log('Foto selecionada:', {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        });
        
        // Validar se a URI é válida
        if (!asset.uri || asset.uri.length === 0) {
          Alert.alert('Erro', 'URI da imagem inválida');
          return;
        }

        // Validar se o arquivo realmente existe
        if (!asset.uri.startsWith('file://') && !asset.uri.startsWith('content://')) {
          Alert.alert('Erro', 'Formato de URI não suportado');
          return;
        }
        
        setSelectedMedia({
          uri: asset.uri,
          type: 'image'
        });
        setStoryText(''); // Limpar texto quando selecionar mídia
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a foto');
    }
  };

  const selectVideo = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8, // Reduzir qualidade para melhor performance
        videoMaxDuration: 30, // Máximo de 30 segundos
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        console.log('Vídeo selecionado:', {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          duration: asset.duration,
          fileSize: asset.fileSize,
        });
        
        // Validar se a URI é válida
        if (!asset.uri || asset.uri.length === 0) {
          Alert.alert('Erro', 'URI do vídeo inválida');
          return;
        }
        
        setSelectedMedia({
          uri: asset.uri,
          type: 'video'
        });
        setStoryText(''); // Limpar texto quando selecionar mídia
      }
    } catch (error) {
      console.error('Erro ao selecionar vídeo:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o vídeo');
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
  };

  const handleCreateStory = async () => {
    if (!storyText.trim() && !selectedMedia) {
      Alert.alert('Erro', 'Digite algum texto ou selecione uma foto/vídeo para o seu story');
      return;
    }

    setIsCreating(true);
    try {
      if (selectedMedia) {
        // Criar story com mídia - passa a URI como conteúdo e legenda
        storiesService.addUserStory(storyText.trim() || '', selectedMedia.type, selectedMedia.uri, storyText.trim() || undefined, captionPosition);
        console.log('Story com mídia criado - URI:', selectedMedia.uri, 'Caption:', storyText.trim(), 'Position:', captionPosition);
      } else {
        // Criar story de texto
        storiesService.addUserStory(storyText.trim(), 'text', selectedColor);
        console.log('Story de texto criado');
      }
      
      Alert.alert(
        'Sucesso!', 
        'Seu Flash foi criado!',
        [
          {
            text: 'Ok',
            onPress: () => {
              setStoryText('');
              setSelectedColor(backgroundColors[0]);
              setSelectedMedia(null);
              setCaptionPosition('bottom');
              onStoryCreated();
              onClose();
            }
          }
        ]
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível publicar o story');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setStoryText('');
    setSelectedColor(backgroundColors[0]);
    setSelectedMedia(null);
    setCaptionPosition('bottom');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent={false}>
      <SafeAreaView style={[styles.container, { backgroundColor: selectedColor }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Story</Text>
          <TouchableOpacity 
            style={[styles.publishBtn, isCreating && styles.publishBtnDisabled]} 
            onPress={handleCreateStory}
            disabled={isCreating}
          >
            <Text style={styles.publishBtnText}>
              {isCreating ? 'Publicando...' : 'Publicar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.storyPreview}>
          {selectedMedia ? (
            <View style={styles.mediaContainer}>
              {selectedMedia.type === 'image' ? (
                <Image 
                  source={{ uri: selectedMedia.uri }} 
                  style={styles.previewImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.error('Erro ao carregar preview da imagem:', {
                      error: error.nativeEvent.error,
                      uri: selectedMedia.uri
                    });
                    Alert.alert('Erro', 'Não foi possível carregar a imagem selecionada');
                  }}
                  onLoad={() => console.log('Preview da imagem carregado com sucesso')}
                  onLoadStart={() => console.log('Iniciando carregamento do preview')}
                />
              ) : (
                <Video
                  source={{ uri: selectedMedia.uri }}
                  style={styles.previewVideo}
                  shouldPlay={false}
                  isLooping={false}
                  resizeMode={ResizeMode.COVER}
                />
              )}
              <TouchableOpacity style={styles.removeMediaBtn} onPress={removeMedia}>
                <Ionicons name="close-circle" size={32} color="#FF4444" />
              </TouchableOpacity>
              {storyText.trim() && (
                <View style={[
                  styles.overlayTextContainer,
                  captionPosition === 'top' && styles.overlayTextTop,
                  captionPosition === 'center' && styles.overlayTextCenter,
                  captionPosition === 'bottom' && styles.overlayTextBottom,
                ]}>
                  <Text style={styles.overlayText}>{storyText}</Text>
                </View>
              )}
            </View>
          ) : (
            <TextInput
              style={styles.storyInput}
              placeholder="Digite seu story aqui..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={storyText}
              onChangeText={setStoryText}
              multiline
              textAlign="center"
              maxLength={200}
            />
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.colorPicker}>
            <Text style={styles.sectionTitle}>Cor de fundo:</Text>
            <View style={styles.colorGrid}>
              {backgroundColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.tools}>
            <TouchableOpacity style={styles.toolBtn} onPress={selectPhoto}>
              <Ionicons name="camera" size={24} color="#FFFFFF" />
              <Text style={styles.toolBtnTextActive}>Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn} onPress={selectVideo}>
              <Ionicons name="videocam" size={24} color="#FFFFFF" />
              <Text style={styles.toolBtnTextActive}>Vídeo</Text>
            </TouchableOpacity>
          </View>

          {!selectedMedia && (
            <View style={styles.characterCount}>
              <Text style={styles.characterCountText}>
                {storyText.length}/200 caracteres
              </Text>
            </View>
          )}

          {selectedMedia && (
            <View style={styles.mediaOptions}>
              <TextInput
                style={styles.captionInput}
                placeholder="Adicione uma legenda (opcional)..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={storyText}
                onChangeText={setStoryText}
                maxLength={100}
              />
              <Text style={styles.captionCount}>
                {storyText.length}/100 caracteres
              </Text>
              
              {storyText.trim() && (
                <View style={styles.positionSection}>
                  <Text style={styles.positionTitle}>Posição da legenda:</Text>
                  <View style={styles.positionButtons}>
                    <TouchableOpacity
                      style={[
                        styles.positionBtn,
                        captionPosition === 'top' && styles.positionBtnActive
                      ]}
                      onPress={() => setCaptionPosition('top')}
                    >
                      <Ionicons name="arrow-up" size={16} color={captionPosition === 'top' ? '#4576F2' : '#FFFFFF'} />
                      <Text style={[
                        styles.positionBtnText,
                        captionPosition === 'top' && styles.positionBtnTextActive
                      ]}>Topo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.positionBtn,
                        captionPosition === 'center' && styles.positionBtnActive
                      ]}
                      onPress={() => setCaptionPosition('center')}
                    >
                      <Ionicons name="remove" size={16} color={captionPosition === 'center' ? '#4576F2' : '#FFFFFF'} />
                      <Text style={[
                        styles.positionBtnText,
                        captionPosition === 'center' && styles.positionBtnTextActive
                      ]}>Centro</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.positionBtn,
                        captionPosition === 'bottom' && styles.positionBtnActive
                      ]}
                      onPress={() => setCaptionPosition('bottom')}
                    >
                      <Ionicons name="arrow-down" size={16} color={captionPosition === 'bottom' ? '#4576F2' : '#FFFFFF'} />
                      <Text style={[
                        styles.positionBtnText,
                        captionPosition === 'bottom' && styles.positionBtnTextActive
                      ]}>Base</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 24,
  },
  closeBtn: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  publishBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishBtnDisabled: {
    opacity: 0.5,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  storyPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  storyInput: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    minHeight: 100,
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorPicker: {
    marginBottom: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  toolBtn: {
    alignItems: 'center',
    padding: 16,
  },
  toolBtnText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  comingSoon: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 10,
    marginTop: 2,
  },
  characterCount: {
    alignItems: 'center',
  },
  characterCountText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  mediaContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewImage: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
  },
  previewVideo: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
  },
  overlayTextContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    padding: 12,
  },
  overlayTextTop: {
    top: 50,
  },
  overlayTextCenter: {
    top: '50%',
    transform: [{ translateY: -25 }],
  },
  overlayTextBottom: {
    bottom: 50,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  toolBtnTextActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  mediaOptions: {
    alignItems: 'center',
    paddingTop: 16,
  },
  captionInput: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 8,
  },
  captionCount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  positionSection: {
    marginTop: 16,
    width: '100%',
  },
  positionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  positionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  positionBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  positionBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  positionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  positionBtnTextActive: {
    color: '#4576F2',
    fontWeight: '600',
  },
});