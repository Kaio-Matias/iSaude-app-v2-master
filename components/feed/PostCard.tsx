import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import InlineComments from './InlineComments';
import { Post } from '../../lib/feed';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export default function PostCard({ post, onLike, onDelete }: PostCardProps) {
  const [commentCount, setCommentCount] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  // O estado de 'isLiked' e 'likeCount' agora é controlado pelo componente pai (home.tsx)
  const { isLiked, likes: likeCount, likers: currentLikers } = post;

  function formatNumber(n: number) {
    if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
    return String(n);
  }

  const handleLike = () => {
    onLike(post.id);
  };

  const handleCommentPress = () => {
    setShowComments(!showComments);
  };

  const handleCommentAdded = () => {
    // Apenas incrementa o contador localmente. A lógica de API para comentários
    // precisaria ser implementada separadamente.
    setCommentCount(prev => prev + 1);
  };

  const handleMoreOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Excluir Post'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            confirmDelete();
          }
        }
      );
    } else {
      Alert.alert(
        'Opções do Post',
        'O que você gostaria de fazer?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Excluir Post',
      'Tem certeza que deseja excluir esta publicação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDelete(post.id) },
      ]
    );
  };

  const openImageModal = (uri: string) => {
    setSelectedImageUri(uri);
    setModalVisible(true);
  };

  return (
    <View style={[styles.postCard, showComments && styles.postCardWithComments]}>
      <View style={styles.postHeader}>
        <Image source={post.avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{post.user}</Text>
          <View style={styles.locationTimeRow}>
            {post.location && (
              <>
                <Ionicons name="location-outline" size={12} color="#6B7480" />
                <Text style={styles.locationText}>{post.location}</Text>
                <Text style={styles.separator}> • </Text>
              </>
            )}
            <Text style={styles.postTime}>{post.time}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreBtn} onPress={handleMoreOptions}>
          <Text style={styles.moreBtnText}>•••</Text>
        </TouchableOpacity>
      </View>
      {post.text?.length > 0 && <Text style={styles.postText}>{post.text}</Text>}
      
      {/* Carrossel de Imagens */}
      {(post.images && post.images.length > 0) && (
        <View style={styles.imageCarouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            style={styles.imageCarousel}
          >
            {post.images.map((imageSource, index) => {
              const uri = typeof imageSource === 'string' ? imageSource : imageSource.uri;
              return (
                <TouchableOpacity key={index} onPress={() => openImageModal(uri)}>
                  <Image
                    source={{ uri }}
                    style={styles.postImage}
                    resizeMode="cover"
                    onError={(error) => {
                      console.log('Erro ao carregar imagem:', error.nativeEvent.error);
                      setImageError(true);
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          
          {/* Indicadores de página (dots) */}
          {post.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {post.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.activeIndicator
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      )}
      
      {/* Fallback para imagem única (compatibilidade) */}
      {(!post.images || post.images.length === 0) && post.image && !imageError && (
        <View style={styles.imageCarouselContainer}>
          <TouchableOpacity onPress={() => openImageModal(typeof post.image === 'string' ? post.image : (post.image as any).uri)}>
            <Image 
              source={ typeof post.image === 'string' ? { uri: post.image } : { uri: (post.image as any).uri } } 
              style={styles.postImage} 
              resizeMode="cover"
              onError={(error) => {
                console.log('Erro ao carregar imagem:', error.nativeEvent.error);
                console.log('Fonte da imagem:', post.image);
                setImageError(true);
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Estado de erro */}
      {imageError && (
        <View style={[styles.postImage, styles.imageErrorContainer]}>
          <Ionicons name="image-outline" size={48} color="#ccc" />
          <Text style={styles.imageErrorText}>Erro ao carregar imagem</Text>
        </View>
      )}
      <View style={styles.postMetrics}>
        <Text style={styles.metric}>{formatNumber(commentCount)} Comentários</Text>
        <Text style={styles.metric}>{formatNumber(post.shares)} Compartilhamentos</Text>
      </View>
      <View style={styles.actionRow}>
        <View style={styles.actionIcons}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={isLiked ? "#FF3040" : "black"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCommentPress}>
            <Ionicons name="chatbubble-outline" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="paper-plane-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.likesGroup}>
          <View style={styles.likesLine}>
            <View style={styles.heartBadge}><Ionicons name="heart" size={12} color="#fff" /></View>
            <View style={styles.likersAvatars}>
              {currentLikers && currentLikers.slice(0, 3).map((l:any, i:number) => (
                <Image key={i} source={typeof l === 'string' ? { uri: l } : l} style={[styles.likerAvatar, { marginLeft: i === 0 ? 0 : -10 }]} />
              ))}
            </View>
          </View>
          {currentLikers && currentLikers.length > 0 && (
            <Text style={styles.likesTextLine}>{currentLikers[0].name} e outras {formatNumber(likeCount)} pessoas</Text>
          )}
        </View>
      </View>

      {showComments && (
        <InlineComments
          postId={post.id}
          onCommentCountChange={handleCommentAdded}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <ImageViewer
          imageUrls={[{ url: selectedImageUri }]}
          enableSwipeDown={true}
          onSwipeDown={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
          renderHeader={() => (
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        />
      </Modal>
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  postCard: { 
    backgroundColor: '#FFFFFF', 
    marginBottom: 16, 
    marginHorizontal: 16,
    paddingBottom: 8, 
    borderRadius: 16,
    overflow: 'hidden',
  },
  postCardWithComments: {
    paddingBottom: 0,
  },
  postHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 14, 
    paddingTop: 12, 
    paddingBottom: 8 
  },
  avatar: { 
    width: 42, 
    height: 42, 
    borderRadius: 12, 
    marginRight: 10 
  },
  userName: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#1E2532' 
  },
  locationTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: '#6B7480',
    marginLeft: 4,
  },
  separator: {
    fontSize: 11,
    color: '#6B7480',
  },
  postTime: { 
    fontSize: 11, 
    color: '#6B7480' 
  },
  moreBtn: { 
    padding: 6 
  },
  moreBtnText: { 
    fontSize: 16, 
    color: '#6B7480' 
  },
  postText: { 
    fontSize: 14, 
    lineHeight: 20, 
    color: '#2E3642', 
    paddingHorizontal: 14, 
    paddingBottom: 10 
  },
  postImage: { 
    width: width - 60, // Subtrai margens do container (32) + margens internas (28)
    height: width - 60,
    borderRadius: 12,
  },
  postMetrics: { 
    flexDirection: 'row', 
    gap: 12, 
    paddingHorizontal: 14, 
    paddingTop: 10 
  },
  metric: { 
    fontSize: 11, 
    color: '#4A5463' 
  },
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 10, 
    paddingHorizontal: 14, 
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: { 
    backgroundColor: '#EFF1F5',
    borderRadius: 12,
    padding: 6,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likesText: {
    fontSize: 11,
    color: '#4A5463',
  },
  likesGroup: { alignItems: 'flex-end' },
  likersRow: { flexDirection: 'row', alignItems: 'center' },
  likersAvatars: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  likerAvatar: { width: 20, height: 20, borderRadius: 6, borderWidth: 1, borderColor: '#FFFFFF' },
  likesLine: { flexDirection: 'row', alignItems: 'center' },
  heartBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF3040', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  likesTextLine: { fontSize: 11, color: '#4A5463', marginTop: 6 },
  imageErrorContainer: {
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    width: width - 60,
    height: (width - 60) * 0.55,
  },
  imageErrorText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  imageCarouselContainer: {
    position: 'relative',
    marginHorizontal: 14, // Alinha com o avatar (mesmo padding do header)
    marginVertical: 8,
  },
  imageCarousel: {
    width: width - 60, // Subtrai margens do container + margens internas
    height: (width - 60) * 0.55,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
});