import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_USERS = [
  { id: '1', name: 'Dra. Maria Glenda', subtitle: 'Clínico Geral', seed: 'MariaGlenda' },
  { id: '2', name: 'Dr. Walter Alencar', subtitle: 'Clínico Geral', seed: 'WalterAlencar' },
  { id: '3', name: 'Dr. Marcos Toledo', subtitle: 'Clínico Geral', seed: 'MarcosToledo' },
  { id: '4', name: 'Luana Paiva', subtitle: 'Clínico Geral', seed: 'LuanaPaiva' },
  { id: '5', name: 'iSaúde', subtitle: 'Perfil Oficial', seed: 'Isaude' },
  { id: '6', name: 'Jamile Correa', subtitle: 'Clínico Geral', seed: 'JamileCorrea' },
  { id: '7', name: 'Dr. Rafael Costa', subtitle: 'Cardiologia', seed: 'RafaelCosta' },
  { id: '8', name: 'Dra. Ana Beatriz', subtitle: 'Dermatologia', seed: 'AnaBeatriz' },
  { id: '9', name: 'Dr. Pedro Lima', subtitle: 'Ortopedia', seed: 'PedroLima' },
  { id: '10', name: 'Dra. Carla Nunes', subtitle: 'Pediatria', seed: 'CarlaNunes' },
  { id: '11', name: 'Dr. Felipe Souza', subtitle: 'Psiquiatria', seed: 'FelipeSouza' },
  { id: '12', name: 'Mariana Oliveira', subtitle: 'Nutrição', seed: 'MarianaOliveira' },
];

export default function AddContactsScreen() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_USERS;
    return MOCK_USERS.filter(u => (u.name + ' ' + u.subtitle).toLowerCase().includes(q));
  }, [query]);
  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Image
        source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(item.seed)}&backgroundColor=4576F2&size=100` }}
        style={styles.avatar}
      />
      <View style={styles.itemText}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Ionicons name="checkmark-circle" size={16} color="#22C55E" style={styles.verifiedIcon} />
        </View>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.followButton} onPress={() => { console.log('Seguir', item.name); }}>
        <Text style={styles.followText}>Seguir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../../assets/images/isaudeicon.png')} style={styles.logo} />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/notificacoes')}>
            <Ionicons name="notifications-outline" size={20} color="#4A5463" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/home')}>
            <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=SeuFlash&backgroundColor=4576F2&size=100' }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Perfis para seguir</Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput value={query} onChangeText={setQuery} placeholder="Busque por pessoas, assuntos e muito mais..." placeholderTextColor="#9CA3AF" style={styles.searchInput} />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 120 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24, color: '#6B7280' }}>Nenhum resultado encontrado</Text>}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EFF1F5' },
  header: { height: 80, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5EAF0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 80, height: 32, resizeMode: 'contain' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  profileButton: { width: 36, height: 36, borderRadius: 10, overflow: 'hidden' },
  profileImage: { width: '100%', height: '100%' },
  container: { paddingHorizontal: 16, paddingTop: 24 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  description: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 14, marginBottom: 12, },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, borderWidth: 1, borderColor: '#E6EEF9', overflow: 'hidden' },
  itemText: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  verifiedIcon: { marginLeft: 8 },
  subtitleRow: { marginTop: 4 },
  subtitle: { fontSize: 12, color: '#6B7280' },
  followButton: { backgroundColor: '#4576F2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, minWidth: 72, alignItems: 'center' },
  followText: { color: '#FFFFFF', fontWeight: '600' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5EAF0', marginBottom: 12 },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 14, color: '#111827' },
});