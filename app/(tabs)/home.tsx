import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, Text, View, StyleSheet, RefreshControl } from 'react-native';
import PostCard from '../../components/feed/PostCard';
import { Post } from '../../lib/feed';
import { getPosts, likePost, deletePost } from '../../lib/feed';

const FeedList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Erro no componente FeedList:", error);
      // Opcional: mostrar uma mensagem de erro para o usuário
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleLike = async (postId: string) => {
    try {
      // Otimistamente atualiza a UI
      const newPosts = posts.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          const likes = isLiked ? p.likes + 1 : p.likes - 1;
          return { ...p, isLiked, likes };
        }
        return p;
      });
      setPosts(newPosts);

      await likePost(postId);
    } catch (error) {
      console.error(`Erro ao curtir o post ${postId}:`, error);
      // Reverte a UI em caso de erro
      fetchPosts();
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    } catch (error) {
      console.error(`Erro ao deletar o post ${postId}:`, error);
      // Opcional: mostrar uma mensagem de erro para o usuário
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />;
  }

  if (posts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Nenhuma publicação encontrada.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedList;
