import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Location {
  id: string;
  name: string;
  address: string;
}

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: Location) => void;
}

const mockLocations: Location[] = [
  { id: '1', name: 'Hospital São Paulo', address: 'Margarido, Bauru - Park Brasil' },
  { id: '2', name: 'Clínica Médica Central', address: 'Centro, Bauru - São Paulo' },
  { id: '3', name: 'Hospital Beneficência Portuguesa', address: 'Vila Universitária, Bauru' },
  { id: '4', name: 'UPA Geisel', address: 'Geisel, Bauru - São Paulo' },
];

export default function LocationModal({ visible, onClose, onSelect }: LocationModalProps) {
  const [searchText, setSearchText] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(mockLocations);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredLocations(mockLocations);
    } else {
      const filtered = mockLocations.filter(location =>
        location.name.toLowerCase().includes(text.toLowerCase()) ||
        location.address.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  };

  const handleSelectLocation = (location: Location) => {
    onSelect(location);
    onClose();
  };

  const renderLocation = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleSelectLocation(item)}
      activeOpacity={0.7}
    >
      <Ionicons name="location-outline" size={20} color="#4576F2" />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Adicionar Local</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#1E2532" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar locais para adicionar"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item.id}
          renderItem={renderLocation}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5EAF0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2532',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1E2532',
  },
  list: {
    paddingHorizontal: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E2532',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#6B7480',
  },
});