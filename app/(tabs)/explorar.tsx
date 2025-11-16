import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../lib/api';

const { width } = Dimensions.get('window');

const HOT_TOPICS = [
  { id: 't1', label: '#nutricionistas', count: '26k publicações' },
  { id: 't2', label: '#SaúdeporAmor', count: '12k publicações' },
  { id: 't3', label: '#psicologos', count: '8k publicações' },
  { id: 't4', label: '#amor', count: '3k publicações' },
];

// Mock images - usar assets ou URLs reais no projeto
const SUGGESTED_IMAGES = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  uri: `https://picsum.photos/seed/explore${i + 1}/400/400`,
}));

export default function ExplorarScreen() {
  const [query, setQuery] = useState('');
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  const renderTopic = ({ item }: { item: typeof HOT_TOPICS[0] }) => (
    <View style={styles.topicCard}>
      <View style={styles.topicLeft}>
        <View style={styles.hashBox}>
          <Text style={styles.hashText}>#</Text>
        </View>
        <View style={styles.topicMeta}>
          <Text style={styles.topicTitle}>{item.label.replace('#', '')}</Text>
          <Text style={styles.topicCount}>{item.count}</Text>
        </View>
      </View>

      <TouchableOpacity>
        <Text style={styles.topicLink}>Ver Publicações</Text>
      </TouchableOpacity>
    </View>
  );

  const renderImage = ({ item }: { item: { id: string; uri: string } }) => (
    <TouchableOpacity style={styles.imageWrapper} activeOpacity={0.8}>
      <Image source={{ uri: item.uri }} style={styles.gridImage} />
    </TouchableOpacity>
  );

  const renderUser = ({ item }: { item: any }) => (
    <View style={styles.userItem}>
      <Image source={typeof item.avatar === 'string' ? { uri: item.avatar } : item.avatar} style={styles.userAvatar} />
      <View style={styles.userItemText}>
        <View style={styles.userNameRow}>
          <Text style={styles.userName}>{item.name}</Text>
          <Ionicons name="checkmark-circle" size={16} color="#22C55E" style={styles.verifiedIcon} />
        </View>
        <View style={styles.userSubtitleRow}>
          <Text style={styles.userSubtitle}>{item.username} • {item.followers} seguidores</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followText}>Seguir</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Text>Error fetching users</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header rendered above the list to match the Home screen spacing */}
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <TouchableOpacity onPress={() => (navigation as any).goBack()} style={{ width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="chevron-back" size={22} color="#1E2532" />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E2532' }}>Explorar</Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9AA4B2" style={{ marginHorizontal: 8 }} />
          <TextInput
            placeholder="Busque por pessoas, assuntos e muito mais..."
            placeholderTextColor="#9AA4B2"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
              <Ionicons name="close" size={16} color="#9AA4B2" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query ? (
        <FlatList
          key="users"
          data={filteredUsers}
          keyExtractor={(i) => i.id}
          renderItem={renderUser}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          key="images"
          data={SUGGESTED_IMAGES}
          keyExtractor={(i) => i.id}
          renderItem={renderImage}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <>
              <View style={[styles.section, { paddingHorizontal: 0 }]}> 
                <Text style={styles.sectionTitle}>Assuntos em alta</Text>
                {HOT_TOPICS.map((t) => (
                  <View key={t.id} style={{ marginBottom: 12 }}>
                    {renderTopic({ item: t } as any)}
                  </View>
                ))}
              </View>

              <View style={[styles.section, { paddingHorizontal: 0 }]}> 
                    <Text style={styles.sectionTitle}>Sugestões de usuários para seguir</Text>
                    <FlatList
                      data={users.slice(0, 6)}
                      horizontal
                      keyExtractor={(i) => i.id}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingVertical: 8 }}
                      renderItem={({ item }) => (
                        <View style={styles.suggestCard} key={item.id}>
                          <TouchableOpacity style={styles.suggestAvatarWrap} activeOpacity={0.9}>
                            <Image source={typeof item.avatar === 'string' ? { uri: item.avatar } : item.avatar} style={styles.suggestAvatar} />
                          </TouchableOpacity>
                              <Text style={styles.suggestName} numberOfLines={1}>{item.name}</Text>
                              <View style={styles.mutualsRow}>
                                <View style={styles.mutualsAvatars}>
                                  {item.mutualsAvatars && item.mutualsAvatars.slice(0,3).map((a:any, idx:number) => (
                                    <Image key={idx} source={a} style={[styles.mutualAvatar, { marginLeft: idx === 0 ? 0 : -10 }]} />
                                  ))}
                                </View>
                                <Text style={styles.mutualsText}>{item.mutuals} em comum</Text>
                              </View>
                          <TouchableOpacity style={styles.suggestFollowButton}>
                            <Text style={styles.suggestFollowText}>Seguir</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    />
              </View>

              <View style={[styles.section, { paddingHorizontal: 0 }]}> 
                <Text style={styles.sectionTitle}>Achamos que você pode gostar</Text>
              </View>
            </>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const IMAGE_MARGIN = 8;
const GRID_IMAGE_SIZE = (width - 32 - IMAGE_MARGIN * 2) / 3; // container padding 16 each side

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EFF1F5' },

  // header card branco full-width — substitua a definição antiga por esta
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: -16,           // estica até as bordas (compensa paddingHorizontal do FlatList)
    paddingHorizontal: 16,           // mantém o alinhamento interno
    paddingTop: 12,
    paddingBottom: 12,

  },

  searchBar: {
    height: 44,
    backgroundColor: '#F2F4F8',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
    marginHorizontal: 20
  },
  searchInput: { flex: 1, height: '100%', color: '#1E2532', paddingLeft: 4, paddingRight: 8 },
  section: { marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E2532', marginBottom: 8 },
  topicRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 6, backgroundColor: '#FFFFFF' },
  topicLabel: { fontSize: 14, color: '#163771' },
  topicLink: { fontSize: 12, color: '#6B7480' },
  topicCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hashBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hashText: { fontSize: 20, fontWeight: '700', color: '#163771' },
  topicMeta: { flexDirection: 'column' },
  topicTitle: { fontSize: 16, fontWeight: '700', color: '#1E2532' },
  topicCount: { fontSize: 12, color: '#6B7480', marginTop: 4 },
  imageWrapper: { marginBottom: IMAGE_MARGIN, width: GRID_IMAGE_SIZE, height: GRID_IMAGE_SIZE, borderRadius: 8, overflow: 'hidden' },
  gridImage: { width: '100%', height: '100%' },
  clearButton: {
    padding: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 14, marginBottom: 12 },
  userAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, borderWidth: 1, borderColor: '#E6EEF9', overflow: 'hidden' },
  userItemText: { flex: 1 },
  userNameRow: { flexDirection: 'row', alignItems: 'center' },
  userName: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  verifiedIcon: { marginLeft: 8 },
  userSubtitleRow: { marginTop: 4 },
  userSubtitle: { fontSize: 12, color: '#6B7280' },
  followButton: { backgroundColor: '#4576F2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, minWidth: 72, alignItems: 'center' },
  followText: { color: '#FFFFFF', fontWeight: '600' },
  suggestCard: { width: 140, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginRight: 12, alignItems: 'center' },
  suggestAvatarWrap: { width: 72, height: 72, borderRadius: 12, overflow: 'hidden', marginBottom: 8, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  suggestAvatar: { width: 68, height: 68, borderRadius: 12 },
  mutualsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  mutualsAvatars: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  mutualAvatar: { width: 20, height: 20, borderRadius: 6, borderWidth: 1, borderColor: '#FFFFFF' },
  mutualsText: { fontSize: 12, color: '#6B7280' },
  suggestName: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  suggestFollowButton: { backgroundColor: '#4576F2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  suggestFollowText: { color: '#FFFFFF', fontWeight: '600' },
});
