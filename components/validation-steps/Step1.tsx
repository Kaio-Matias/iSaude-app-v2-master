import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StepLayout from './StepLayout';

interface Step1Props {
  onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
  const [frontDoc, setFrontDoc] = useState<string | null>(null);
  const [backDoc, setBackDoc] = useState<string | null>(null);
  const bothSelected = !!frontDoc && !!backDoc;

  function handleSelect(which: 'front' | 'back') {
    // Placeholder: aqui abrir câmera / picker. Por enquanto só marca como "ok".
    if (which === 'front') setFrontDoc('captured-front'); else setBackDoc('captured-back');
  }

  return (
    <StepLayout
      footer={(
        <TouchableOpacity
          style={[styles.button, !bothSelected && styles.buttonDisabled]}
          onPress={onNext}
          disabled={!bothSelected}
          activeOpacity={bothSelected ? 0.85 : 1}
        >
          <Text style={[styles.buttonText, !bothSelected && styles.buttonTextDisabled]}>Próximo ➜</Text>
        </TouchableOpacity>
      )}
    >
      <Text style={styles.title}>Primeiro, vamos confirmar sua identidade.</Text>
      <Text style={styles.subtitle}>
        Precisamos da frente e verso de um documento oficial com foto 
        que valide quem você é de verdade!
      </Text>
      <Text style={styles.description}>
        Isso protege sua conta e garante segurança a todos na 
        plataforma.
      </Text>
      <View style={styles.documentOptions}>
        <TouchableOpacity
          style={styles.documentOption}
          onPress={() => handleSelect('front')}
          activeOpacity={0.7}
        >
          <View style={styles.documentIcon}>
            <MaterialCommunityIcons
              name="card-account-details-outline"
              size={28}
              color={frontDoc ? '#01AEA4' : '#4a4f57'}
            />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>Frente do Documento</Text>
            <Text style={styles.documentSubtitle}>
              {frontDoc ? 'Documento adicionado' : 'Clique para adicionar o documento'}
            </Text>
          </View>
          {frontDoc && (
            <Ionicons name="checkmark-circle" size={30} color="#01AEA4" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.documentOption}
          onPress={() => handleSelect('back')}
          activeOpacity={0.7}
        >
          <View style={styles.documentIcon}>
            <MaterialCommunityIcons
              name="card-text-outline"
              size={28}
              color={backDoc ? '#01AEA4' : '#4a4f57'}
            />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>Verso do Documento</Text>
            <Text style={styles.documentSubtitle}>
              {backDoc ? 'Documento adicionado' : 'Clique para adicionar o documento'}
            </Text>
          </View>
          {backDoc && (
            <Ionicons name="checkmark-circle" size={30} color="#01AEA4" />
          )}
        </TouchableOpacity>
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  // layout wrappers moved to StepLayout
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 30,
  },
  documentOptions: {
    marginBottom: 30,
  },
  documentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  documentIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentIconText: {
    fontSize: 24,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  documentSubtitle: {
    fontSize: 10,
    color: '#666',
  },
  button: {
    marginVertical: 20,
    backgroundColor: '#4576F2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#d0d7de',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: '#66707a',
  },
  // removed selected container background; seleção agora só altera cor do ícone
});
