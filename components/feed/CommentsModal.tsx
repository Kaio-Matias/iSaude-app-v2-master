import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Comment, storageService } from './StorageService';

interface CommentsModalProps {
  visible: boolean;
  postId: string;
  onClose: () => void;
  onCommentAdded: () => void;
}

export default function CommentsModal({ visible, postId, onClose, onCommentAdded }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Avatar do usuário logado (simulado)
  const currentUser = {
    name: 'Você',
    avatar: require('@/assets/images/seuflash.png')
  };

  useEffect(() => {
    const loadComments = async () => {
      try {
        const loadedComments = await storageService.getComments(postId);
        setComments(loadedComments);
      } catch {
        console.error('Erro ao carregar comentários');
      }
    };

    if (visible) {
      loadComments();
    }
  }, [visible, postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const comment = await storageService.addComment(
        postId,
        newComment.trim(),
        currentUser.name,
        currentUser.avatar
      );
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      onCommentAdded(); // Atualiza o contador no post
    } catch {
      Alert.alert('Erro', 'Não foi possível adicionar o comentário');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    Alert.alert(
      'Excluir Comentário',
      'Tem certeza que deseja excluir este comentário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const success = await storageService.deleteComment(commentId, postId);
            if (success) {
              setComments(prev => prev.filter(c => c.id !== commentId));
              onCommentAdded(); // Atualiza o contador
            }
          }
        }
      ]
    );
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image source={item.avatar} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{item.user}</Text>
          <Text style={styles.commentTime}>{formatTime(item.timestamp)}</Text>
          {item.user === currentUser.name && (
            <TouchableOpacity 
              style={styles.deleteBtn}
              onPress={() => handleDeleteComment(item.id)}
            >
              <Ionicons name="trash-outline" size={14} color="#6B7480" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Comentários</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#1E2532" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderComment}
          style={styles.commentsList}
          contentContainerStyle={styles.commentsContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={48} color="#6B7480" />
              <Text style={styles.emptyText}>Seja o primeiro a comentar!</Text>
            </View>
          }
        />

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <Image source={currentUser.avatar} style={styles.inputAvatar} />
          <TextInput
            style={styles.textInput}
            placeholder="Adicione um comentário..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { opacity: newComment.trim() ? 1 : 0.5 }]}
            onPress={handleAddComment}
            disabled={!newComment.trim() || loading}
          >
            <Ionicons name="send" size={20} color="#4576F2" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5EAF0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2532',
  },
  closeBtn: {
    padding: 4,
  },
  commentsList: {
    flex: 1,
  },
  commentsContent: {
    paddingVertical: 8,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F2F5',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E2532',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 11,
    color: '#6B7480',
    flex: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#2E3642',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7480',
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5EAF0',
    backgroundColor: '#fff',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#E5EAF0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#F8F9FA',
  },
  sendBtn: {
    marginLeft: 8,
    padding: 8,
  },
});