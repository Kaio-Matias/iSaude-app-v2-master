import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostHeaderProps {
  onClose: () => void;
  onPublish: () => void;
  canPublish: boolean;
}

export default function PostHeader({ 
  onClose, 
  onPublish, 
  canPublish
}: PostHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={24} color="#1E2532" />
      </TouchableOpacity>
      
      <View style={styles.spacer} />
      
      <TouchableOpacity 
        style={[
          styles.publishButton, 
          !canPublish && styles.publishButtonDisabled
        ]} 
        onPress={canPublish ? onPublish : undefined}
        activeOpacity={canPublish ? 0.8 : 1}
      >
        <Text style={[
          styles.publishText,
          !canPublish && styles.publishTextDisabled
        ]}>
          Publicar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5EAF0',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  publishButton: {
    backgroundColor: '#4576F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonDisabled: {
    backgroundColor: '#E5EAF0',
  },
  publishText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  publishTextDisabled: {
    color: '#9CA3AF',
  },
});