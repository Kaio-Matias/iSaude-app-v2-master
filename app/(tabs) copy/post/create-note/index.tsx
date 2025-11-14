import { storageService } from '@/components/feed';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationModal from '../../../../components/post/modals/LocationModal';
import PeopleModal from '../../../../components/post/modals/PeopleModal';
import AudienceSelector from '../../../../components/post/shared/AudienceSelector';
import PostHeader from '../../../../components/post/shared/PostHeader';


export default function CreateNote() {
  const { gallery } = useLocalSearchParams();
  const [text, setText] = useState('');
  const [audience, setAudience] = useState<'public' | 'followers' | 'private'>('followers');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Se foi chamado com parâmetro gallery=true, abrir galeria automaticamente
  React.useEffect(() => {
    if (gallery === 'true') {
      handleGallery();
    }
  }, [gallery]);

  const canPublish = text.trim().length > 0;
  const characterCount = text.length;
  const maxCharacters = 2000;

  const handlePublish = () => {
    if (!canPublish) return;
    
    // Salvar post no sistema mockado com todas as imagens selecionadas
    const mediaUris = selectedImages.length > 0 ? selectedImages : undefined;
    const locationData = currentLocation ? currentLocation.address : selectedLocation;
    const newPost = storageService.addPost(text, mediaUris, selectedPeople, locationData);
    
    console.log('Post publicado:', newPost);
    
    // Navegar de volta para a home (feed)
    router.replace('/(tabs)/home');
  };

  const handleCamera = async () => {
    // Abrir câmera real do celular
    console.log('Abrir câmera do celular');
    
    // Solicitar permissão para acessar a câmera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'É preciso permitir o acesso à câmera para tirar fotos.');
      return;
    }

    // Abrir câmera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setSelectedImages(prev => [...prev, imageUri]);
      console.log('Foto tirada:', imageUri);
    }
  };

  const handleGallery = async () => {
    // Abrir galeria real do celular
    console.log('Abrir galeria do celular');
    
    // Solicitar permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'É preciso permitir o acesso à galeria para selecionar fotos.');
      return;
    }

    // Abrir galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setSelectedImages(prev => [...prev, imageUri]);
      console.log('Imagem selecionada:', imageUri);
    }
  };

  const handleFiles = () => {
    // TODO: Seletor de arquivos
    console.log('Selecionar arquivos');
    Alert.alert('Arquivos', 'Funcionalidade em desenvolvimento');
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
          'Precisamos da permissão de localização para adicionar sua localização ao post.',
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PostHeader 
        onClose={() => router.back()}
        onPublish={handlePublish}
        canPublish={canPublish}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seletor de Audiência no topo */}
        <View style={styles.audienceSection}>
          <AudienceSelector 
            value={audience}
            onChange={setAudience}
          />
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
              placeholder="No que você está pensando, Carlos?"
              placeholderTextColor="#9CA3AF"
              multiline
              value={text}
              onChangeText={setText}
              maxLength={maxCharacters}
            />
          </View>
        </View>

        {/* Carrossel de Imagens - largura total da tela */}
        {selectedImages.length > 0 && (
          <View style={styles.imageCarousel}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
              {selectedImages.map((imageUri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: imageUri }} style={styles.carouselImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                  >
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <Text style={styles.imageCount}>{selectedImages.length} fotos adicionadas</Text>
          </View>
        )}

        {/* Informações Adicionais */}
        <View style={styles.additionalInfo}>
          {selectedPeople.length > 0 && (
            <View style={styles.infoItem}>
              <Ionicons name="person" size={16} color="#4576F2" />
              <Text style={styles.infoText}>Com outras {selectedPeople.length} pessoas</Text>
            </View>
          )}
          
          {selectedLocation && (
            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color="#4576F2" />
              <Text style={styles.infoText}>{selectedLocation}</Text>
            </View>
          )}
        </View>

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
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity onPress={handleCamera} style={styles.actionButton}>
            <Ionicons name="camera-outline" size={20} color="#4576F2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGallery} style={styles.actionButton}>
            <Ionicons name="image-outline" size={20} color="#4576F2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePeople} style={styles.actionButton}>
            <Ionicons name="person-outline" size={20} color="#4576F2" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleLocation} 
            style={[styles.actionButton, loadingLocation && styles.buttonDisabled]}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <ActivityIndicator size="small" color="#4576F2" />
            ) : (
              <Ionicons name="location-outline" size={20} color="#4576F2" />
            )}
          </TouchableOpacity>
        </View>
      </View>



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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  audienceSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mainSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'flex-start',
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

  bottomActionButtons: {
    position: 'absolute',
    bottom: 0,
    right: 16,
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    borderRadius: 18,
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
  imageCarousel: {
    marginTop: 16,
    paddingLeft: 16,
  },
  imagesScroll: {
    marginBottom: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  carouselImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCount: {
    fontSize: 12,
    color: '#6B7480',
    textAlign: 'right',
    paddingRight: 16,
  },
  additionalInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  buttonDisabled: {
    opacity: 0.5,
  },
});