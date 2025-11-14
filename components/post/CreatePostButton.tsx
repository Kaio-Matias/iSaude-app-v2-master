import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface CreatePostButtonProps {
  onCreateNote?: () => void;
  onCreateMedia?: () => void;
  onCreatePulse?: () => void;
}

export default function CreatePostButton({
  onCreateNote,
  onCreateMedia,
  onCreatePulse,
}: CreatePostButtonProps) {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));

  const handleCreatePost = () => {
    setShowCreateMenu(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeCreateMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCreateMenu(false);
    });
  };

  const handleCreateOption = (type: 'note' | 'media' | 'pulse') => {
    closeCreateMenu();
    switch (type) {
      case 'note':
        onCreateNote?.();
        break;
      case 'media':
        onCreateMedia?.();
        break;
      case 'pulse':
        onCreatePulse?.();
        break;
    }
  };

  return (
    <>
      {/* Botão Principal */}
      <TouchableOpacity 
        style={[styles.createPostButton, showCreateMenu && styles.createPostButtonRotated]}
        onPress={showCreateMenu ? closeCreateMenu : handleCreatePost}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={showCreateMenu ? "close" : "add"} 
          size={24} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>

      {/* Menu de Criação */}
      <Modal
        visible={showCreateMenu}
        transparent={true}
        animationType="none"
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={closeCreateMenu}>
          <Animated.View 
            style={[
              styles.createMenuOverlay,
              { opacity: fadeAnim }
            ]}
          >
            <TouchableWithoutFeedback>
              <View style={styles.createMenuContainer}>
                {/* Nota */}
                <Animated.View 
                  style={[
                    styles.floatingButton,
                    styles.noteButton,
                    {
                      transform: [{ scale: scaleAnim }]
                    }
                  ]}
                >
                  <TouchableOpacity 
                    style={styles.floatingButtonContent}
                    onPress={() => handleCreateOption('note')}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.floatingButtonIcon, { backgroundColor: '#8B5CF6' }]}>
                      <Ionicons name="pencil" size={18} color="#FFFFFF" />
                    </View>
                    <Text style={styles.floatingButtonText}>Nota</Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* Fotos e Vídeos */}
                <Animated.View 
                  style={[
                    styles.floatingButton,
                    styles.mediaButton,
                    {
                      transform: [{ scale: scaleAnim }]
                    }
                  ]}
                >
                  <TouchableOpacity 
                    style={styles.floatingButtonContent}
                    onPress={() => handleCreateOption('media')}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.floatingButtonIcon, { backgroundColor: '#EF4444' }]}>
                      <Ionicons name="images" size={18} color="#FFFFFF" />
                    </View>
                    <Text style={styles.floatingButtonText}>Fotos e Vídeos</Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* Pulse */}
                <Animated.View 
                  style={[
                    styles.floatingButton,
                    styles.pulseButton,
                    {
                      transform: [{ scale: scaleAnim }]
                    }
                  ]}
                >
                  <TouchableOpacity 
                    style={styles.floatingButtonContent}
                    onPress={() => handleCreateOption('pulse')}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.floatingButtonIcon, { backgroundColor: '#06B6D4' }]}>
                      <Ionicons name="pulse" size={18} color="#FFFFFF" />
                    </View>
                    <Text style={styles.floatingButtonText}>Pulse</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  createPostButton: {
    position: 'absolute',
    bottom: 30, // Mais próximo das tabs
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#4576F2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Para Android
    shadowColor: '#4576F2', // Para iOS
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  createPostButtonRotated: {
    transform: [{ rotate: '45deg' }],
  },
  createMenuOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  createMenuContainer: {
    position: 'absolute',
    bottom: 150, // Ajustado para acompanhar o botão principal
    right: 20,
    alignItems: 'flex-end',
  },
  floatingButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  noteButton: {
    // Botão mais próximo do botão principal
  },
  mediaButton: {
    // Botão do meio
  },
  pulseButton: {
    // Botão mais distante do botão principal
  },
  floatingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  floatingButtonIcon: {
    width: 28,
    height: 28,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  floatingButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E2532',
  },
});