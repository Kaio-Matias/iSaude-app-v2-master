import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Person {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

interface PeopleModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (people: Person[]) => void;
}

const mockPeople: Person[] = [
  { id: '1', name: 'Dra. Maria Glenda', username: '@dra.mariaglen', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=MariaGlenda&backgroundColor=8B5CF6&size=100' },
  { id: '2', name: 'Jorge Zikenay', username: '@jorge.zikenay', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=JorgeZikenay&backgroundColor=FF6B6B&size=100' },
  { id: '3', name: 'Dr. Walter Alencar', username: '@walter.alencar', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=WalterAlencar&backgroundColor=06B6D4&size=100' },
  { id: '4', name: 'Luana Paiva', username: '@luana.paiva', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=LuanaPereira&backgroundColor=27AE60&size=100' },
];

export default function PeopleModal({ visible, onClose, onSelect }: PeopleModalProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState(mockPeople);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredPeople(mockPeople);
    } else {
      const filtered = mockPeople.filter(person =>
        person.name.toLowerCase().includes(text.toLowerCase()) ||
        person.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPeople(filtered);
    }
  };

  const addPerson = (person: Person) => {
    if (!selectedPeople.some(p => p.id === person.id)) {
      setSelectedPeople(prev => [...prev, person]);
    }
  };

  const removePerson = (personId: string) => {
    setSelectedPeople(prev => prev.filter(p => p.id !== personId));
  };

  const handleConfirm = () => {
    onSelect(selectedPeople);
    onClose();
    setSelectedPeople([]);
    setSearchText('');
  };

  const renderPerson = ({ item }: { item: Person }) => {
    const isAdded = selectedPeople.some(p => p.id === item.id);
    
    return (
      <TouchableOpacity
        style={styles.personItem}
        onPress={() => !isAdded && addPerson(item)}
        activeOpacity={isAdded ? 1 : 0.7}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.personInfo}>
          <Text style={styles.personName}>{item.name}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4576F2" />
          </View>
        </View>
        {isAdded && (
          <View style={styles.addedIndicator}>
            <Ionicons name="checkmark" size={16} color="#4576F2" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.title}>Adicionar pessoas à Publicação</Text>
              
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar pessoas"
                  placeholderTextColor="#9CA3AF"
                  value={searchText}
                  onChangeText={handleSearch}
                />
              </View>

              <FlatList
                data={filteredPeople}
                keyExtractor={(item) => item.id}
                renderItem={renderPerson}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                style={styles.peopleList}
              />

              {selectedPeople.length > 0 && (
                <View style={styles.addedSection}>
                  <Text style={styles.addedTitle}>Adicionados</Text>
                  <View style={styles.addedContainer}>
                    {selectedPeople.map((person) => (
                      <View key={person.id} style={styles.addedItem}>
                        <Text style={styles.addedName}>@{person.username.replace('@', '')}</Text>
                        <TouchableOpacity onPress={() => removePerson(person.id)}>
                          <Ionicons name="close" size={16} color="#6B7480" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Botão Adicionar */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.addButton, 
                    selectedPeople.length === 0 && styles.addButtonDisabled
                  ]} 
                  onPress={handleConfirm}
                  disabled={selectedPeople.length === 0}
                >
                  <Text style={[
                    styles.addButtonText,
                    selectedPeople.length === 0 && styles.addButtonTextDisabled
                  ]}>
                    Adicionar {selectedPeople.length > 0 ? `(${selectedPeople.length})` : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2532',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 16,
    color: '#1E2532',
  },
  peopleList: {
    maxHeight: 200,
  },
  list: {
    paddingBottom: 8,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  personInfo: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  personName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E2532',
    marginRight: 6,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  addedIndicator: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5EAF0',
  },
  addedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E2532',
    marginBottom: 12,
  },
  addedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  addedName: {
    fontSize: 12,
    color: '#4576F2',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 20,
    paddingTop: 16,
  },
  addButton: {
    backgroundColor: '#4576F2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#E5EAF0',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonTextDisabled: {
    color: '#9CA3AF',
  },
});