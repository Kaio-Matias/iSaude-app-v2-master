import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LocationModal from '../../../../components/post/modals/LocationModal';
import PeopleModal from '../../../../components/post/modals/PeopleModal';
import AudienceSelector from '../../../../components/post/shared/AudienceSelector';
import { pulseStorageService } from '../../../../components/pulses/PulseStorageService';



export default function CreatePulseScreen() {
  const insets = useSafeAreaInsets();
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState<'public' | 'followers' | 'private'>('followers');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handlePeople = () => {
    setShowPeopleModal(true);
  };

  const handleLocation = () => {
    Alert.alert(
      'Localização',
      'Como deseja adicionar a localização?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Localização Atual', onPress: getCurrentLocation },
        { text: 'Pesquisar Local', onPress: () => setShowLocationModal(true) }
      ]
    );
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Precisamos da permissão de localização para adicionar sua localização ao pulse.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      Alert.alert('Erro', 'Falha ao solicitar permissão de localização');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoadingLocation(false);
        return;
      }

      // Verificar se os serviços de localização estão habilitados
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          'Localização Desabilitada',
          'Por favor, habilite os serviços de localização nas configurações do dispositivo.',
          [{ text: 'OK' }]
        );
        setLoadingLocation(false);
        return;
      }

      // Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverter geocoding para obter endereço
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationName = [
          address.name,
          address.street,
          address.district,
          address.city,
          address.region
        ].filter(Boolean).join(', ');

        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: locationName
        });
        setSelectedLocation(locationName);
      } else {
        // Fallback se não conseguir o endereço
        const coords = `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: coords
        });
        setSelectedLocation(coords);
      }

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização. Tente novamente.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSelectVideo = () => {
    handleSelectFromGallery();
  };

  const handleRecordVideo = async () => {
    try {
      // Solicitar permissão para acessar a câmera
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!cameraPermission.granted) {
        Alert.alert('Permissão necessária', 'É preciso permitir o acesso à câmera para gravar vídeos.');
        return;
      }

      // Abrir câmera para gravar vídeo
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // Máximo 60 segundos
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const videoAsset = result.assets[0];
        setSelectedVideo({
          uri: videoAsset.uri,
          type: videoAsset.type || 'video',
          duration: videoAsset.duration || 0,
          width: videoAsset.width || 0,
          height: videoAsset.height || 0,
        });

      }
    } catch (error) {

      Alert.alert('Erro', 'Não foi possível gravar o vídeo.');
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      // Solicitar permissão para acessar a galeria
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!galleryPermission.granted) {
        Alert.alert('Permissão necessária', 'É preciso permitir o acesso à galeria para selecionar vídeos.');
        return;
      }

      // Abrir galeria apenas com vídeos
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: 60, // Máximo 60 segundos
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const videoAsset = result.assets[0];
        setSelectedVideo({
          uri: videoAsset.uri,
          type: videoAsset.type || 'video',
          duration: videoAsset.duration || 0,
          width: videoAsset.width || 0,
          height: videoAsset.height || 0,
        });

      }
    } catch (error) {

      Alert.alert('Erro', 'Não foi possível selecionar o vídeo.');
    }
  };

  const canPublish = description.trim().length > 0 || selectedVideo;
  const characterCount = description.length;
  const maxCharacters = 500;

  const handlePublishConfirm = async () => {
    setIsPublishing(true);
    try {
      const newPulse = await pulseStorageService.createPulse({
        description,
        audience,
        selectedPeople,
        selectedLocation,
        selectedVideo,
        currentLocation
      });

      Alert.alert(
        'Sucesso!', 
        'Seu Pulse foi publicado com sucesso!', 
        [
          { 
            text: 'Ver Pulses', 
            onPress: () => router.push('/(tabs)/pulses') 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível publicar o Pulse. Tente novamente.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublish = () => {
    if (!selectedVideo) {
      Alert.alert('Erro', 'Por favor, selecione um vídeo para o seu Pulse');
      return;
    }

    Alert.alert(
      'Publicar Pulse',
      'Seu Pulse será publicado. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Publicar',
          onPress: handlePublishConfirm
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar Pulse</Text>
        <TouchableOpacity 
          onPress={handlePublish} 
          style={[
            styles.publishButton, 
            (!canPublish || isPublishing) && styles.publishButtonDisabled
          ]}
          disabled={!canPublish || isPublishing}
        >
          <Text style={[
            styles.publishButtonText,
            (!canPublish || isPublishing) && styles.publishButtonTextDisabled
          ]}>
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Selection */}
        <View style={styles.videoSection}>
          <TouchableOpacity style={styles.videoSelector} onPress={handleSelectVideo}>
            {selectedVideo ? (
              <View style={styles.videoPreviewContainer}>
                <Image 
                  source={{ uri: selectedVideo.uri }} 
                  style={styles.videoPreview}
                />
                <View style={styles.videoOverlay}>
                  <MaterialIcons name="play-circle-filled" size={40} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.videoDuration}>
                    {selectedVideo.duration ? `${Math.round(selectedVideo.duration / 1000)}s` : 'Vídeo'}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.removeVideoButton}
                  onPress={() => setSelectedVideo(null)}
                >
                  <MaterialIcons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.videoPlaceholder}>
                <MaterialIcons name="videocam" size={48} color="#ccc" />
                <Text style={styles.videoPlaceholderText}>Selecionar Vídeo</Text>
                <Text style={styles.videoSubtext}>Máximo 60 segundos</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Seção principal: Avatar + Input */}
        <View style={styles.mainSection}>
          <Image 
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100' }} 
            style={styles.avatar}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Adicione uma descrição para o pulse..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={description}
              onChangeText={setDescription}
              maxLength={maxCharacters}
            />
          </View>
        </View>

        {/* Seletor de Audiência */}
        <View style={styles.audienceSection}>
          <AudienceSelector 
            value={audience}
            onChange={setAudience}
          />
        </View>

        {/* Informações Adicionais */}
        {(selectedPeople.length > 0 || selectedLocation) && (
          <View style={styles.additionalInfo}>
            {selectedPeople.length > 0 && (
              <View style={styles.infoItem}>
                <MaterialIcons name="person" size={16} color="#4576F2" />
                <Text style={styles.infoText}>Com outras {selectedPeople.length} pessoas</Text>
              </View>
            )}
            
            {selectedLocation && (
              <View style={styles.infoItem}>
                <MaterialIcons name="location-on" size={16} color="#4576F2" />
                <Text style={styles.infoText}>{selectedLocation}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Contador de caracteres e botões de ação fixos na parte inferior */}
      <View style={styles.bottomActionButtons}>
        <Text style={[
          styles.characterCountText,
          characterCount > maxCharacters * 0.9 && styles.characterCountWarning,
          characterCount >= maxCharacters && styles.characterCountError
        ]}>
          {characterCount}/{maxCharacters}
        </Text>
        <View style={styles.bottomActionButtonsContainer}>
          <TouchableOpacity onPress={handlePeople} style={styles.bottomActionButton}>
            <MaterialIcons name="person-outline" size={20} color="#4576F2" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleLocation} 
            style={[styles.bottomActionButton, loadingLocation && styles.buttonDisabled]}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <ActivityIndicator size="small" color="#4576F2" />
            ) : (
              <MaterialIcons name="location-on" size={20} color="#4576F2" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <LocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={(location) => {
          setSelectedLocation(location.name);
          console.log('Local selecionado:', location);
        }}
      />

      <PeopleModal
        visible={showPeopleModal}
        onClose={() => setShowPeopleModal(false)}
        onSelect={(people) => {
          setSelectedPeople(people);
          console.log('Pessoas selecionadas:', people);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  publishButton: {
    backgroundColor: '#4576F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonDisabled: {
    backgroundColor: '#ccc',
  },
  publishButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  publishButtonTextDisabled: {
    color: '#999',
  },
  content: {
    flex: 1,
  },
  videoSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mainSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingTop: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
    minHeight: 120,
  },
  textInput: {
    fontSize: 18,
    lineHeight: 24,
    color: '#1E2532',
    textAlignVertical: 'top',
  },
  audienceSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  videoSelector: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  videoPreviewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoDuration: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  removeVideoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: '#999',
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  videoSubtext: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafbfc',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  additionalInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1E2532',
    marginLeft: 8,
  },
  actionButtonsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  bottomActionButtons: {
    position: 'absolute',
    bottom: 0,
    right: 16,
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  characterCountText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  characterCountWarning: {
    color: '#F59E0B',
  },
  characterCountError: {
    color: '#EF4444',
  },
  bottomActionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  bottomActionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    borderRadius: 18,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});