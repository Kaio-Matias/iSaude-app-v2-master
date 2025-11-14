import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AudienceSelectorProps {
  value: 'public' | 'followers' | 'private';
  onChange: (value: 'public' | 'followers' | 'private') => void;
}

const audienceOptions = [
  { value: 'followers' as const, label: 'Apenas Seguidores', icon: 'people-outline' as const },
  { value: 'public' as const, label: 'Público', icon: 'globe-outline' as const },
  { value: 'private' as const, label: 'Apenas eu', icon: 'lock-closed-outline' as const },
];

export default function AudienceSelector({ value, onChange }: AudienceSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  
  const selectedOption = audienceOptions.find(opt => opt.value === value) || audienceOptions[1];

  const handleSelect = (newValue: 'public' | 'followers' | 'private') => {
    onChange(newValue);
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
      >
        <Ionicons name={selectedOption.icon} size={16} color="#4576F2" />
        <Text style={styles.selectorText}>{selectedOption.label}</Text>
        <Ionicons name="chevron-down" size={16} color="#6B7480" />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setShowModal(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            {audienceOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  value === option.value && styles.modalOptionSelected
                ]}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={option.icon} 
                  size={20} 
                  color={value === option.value ? '#4576F2' : '#6B7480'} 
                />
                <Text style={[
                  styles.modalOptionText,
                  value === option.value && styles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {value === option.value && (
                  <Ionicons name="checkmark" size={20} color="#4576F2" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    alignSelf: 'flex-start',
  },
  selectorText: {
    fontSize: 14,
    color: '#4576F2',
    fontWeight: '500',
    marginHorizontal: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    minWidth: 250,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalOptionSelected: {
    backgroundColor: '#F0F4FF',
  },
  modalOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#1E2532',
    marginLeft: 12,
  },
  modalOptionTextSelected: {
    color: '#4576F2',
    fontWeight: '500',
  },
});