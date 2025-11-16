import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getComments, addComment, deleteComment, Comment } from '../../lib/feed';

interface InlineCommentsProps {
  postId: string;
  onCommentCountChange: () => void;
  maxVisible?: number;
}

export default function InlineComments({ postId, onCommentCountChange, maxVisible = 3 }: InlineCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: Substituir por dados do usuário logado a partir de um contexto de autenticação
  const currentUser = {
    name: 'Usuário Logado',
    avatar: { uri: `https://api.dicebear.com/7.x/avataaars/png?seed=CurrentUser&backgroundColor=4576F2&size=100` }
  };

  useEffect(() => {
    const loadComments = async () => {
      try {
        const loadedComments = await getComments(postId);
        setComments(loadedComments);
      } catch {
        console.error('Erro ao carregar comentários');
      }
    };

    loadComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const addedComment = await addComment(postId, newComment.trim());
      setComments(prevComments => [addedComment, ...prevComments]);
      setNewComment('');
      onCommentCountChange(); // Atualiza o contador no post
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
            try {
              await deleteComment(postId, commentId);
              setComments(prevComments => prevComments.filter(c => c.id !== commentId));
              onCommentCountChange(); // Atualiza o contador
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir o comentário');
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

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image source={item.avatar} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.commentUser}>{item.user}</Text>
          <Text style={styles.commentText}>{item.text}</Text>
        </View>
        <View style={styles.commentFooter}>
          <Text style={styles.commentTime}>{formatTime(item.timestamp)}</Text>
          <TouchableOpacity style={styles.likeComment}>
            <Text style={styles.likeText}>Curtir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.replyComment}>
            <Text style={styles.replyText}>Responder</Text>
          </TouchableOpacity>
          {item.user === currentUser.name && (
            <TouchableOpacity 
              style={styles.deleteComment}
              onPress={() => handleDeleteComment(item.id)}
            >
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const visibleComments = showAll ? comments : comments.slice(0, maxVisible);
  const hasMoreComments = comments.length > maxVisible;

  if (comments.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Image source={currentUser.avatar} style={styles.inputAvatar} />
          <TextInput
            style={styles.textInput}
            placeholder="Escreva um comentário..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          {newComment.trim().length > 0 && (
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleAddComment}
              disabled={loading}
            >
              <Ionicons name="send" size={16} color="#4576F2" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {hasMoreComments && !showAll && (
        <TouchableOpacity 
          style={styles.showMoreBtn}
          onPress={() => setShowAll(true)}
        >
          <Text style={styles.showMoreText}>
            Ver todos os {comments.length} comentários
          </Text>
        </TouchableOpacity>
      )}
      
      <FlatList
        data={visibleComments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
        scrollEnabled={false}
      />

      <View style={styles.inputContainer}>
        <Image source={currentUser.avatar} style={styles.inputAvatar} />
        <TextInput
          style={styles.textInput}
          placeholder="Escreva um comentário..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />
        {newComment.trim().length > 0 && (
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleAddComment}
            disabled={loading}
          >
            <Ionicons name="send" size={16} color="#4576F2" />
          </TouchableOpacity>
        )}
      </View>
      
      {showAll && hasMoreComments && (
        <TouchableOpacity 
          style={styles.showLessBtn}
          onPress={() => setShowAll(false)}
        >
          <Text style={styles.showLessText}>Mostrar menos</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  showMoreBtn: {
    paddingVertical: 4,
    marginBottom: 8,
  },
  showMoreText: {
    fontSize: 13,
    color: '#6B7480',
    fontWeight: '500',
  },
  showLessBtn: {
    paddingVertical: 4,
    marginTop: 8,
  },
  showLessText: {
    fontSize: 13,
    color: '#6B7480',
    fontWeight: '500',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 12,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#F0F2F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  commentUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E2532',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 13,
    color: '#1E2532',
    lineHeight: 16,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 12,
  },
  commentTime: {
    fontSize: 11,
    color: '#6B7480',
    marginRight: 12,
  },
  likeComment: {
    marginRight: 12,
  },
  likeText: {
    fontSize: 11,
    color: '#6B7480',
    fontWeight: '600',
  },
  replyComment: {
    marginRight: 12,
  },
  replyText: {
    fontSize: 11,
    color: '#6B7480',
    fontWeight: '600',
  },
  deleteComment: {},
  deleteText: {
    fontSize: 11,
    color: '#6B7480',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5EAF0',
    marginTop: 8,
  },
  inputAvatar: {
    width: 28,
    height: 28,
    borderRadius: 12,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 80,
    minHeight: 32,
    borderWidth: 1,
    borderColor: '#E5EAF0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    backgroundColor: '#F8F9FA',
  },
  sendBtn: {
    marginLeft: 8,
    padding: 6,
  },
});