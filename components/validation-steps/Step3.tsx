import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StepLayout from './StepLayout';

interface Step3Props { onNext: () => void; }

export default function Step3({ onNext }: Step3Props) {
  const [specialtyDoc, setSpecialtyDoc] = useState<string | null>(null);
  const selected = !!specialtyDoc;

  function handleSelect() {
    setSpecialtyDoc('specialty-registry');
  }

  return (
    <StepLayout
      footer={(
        <TouchableOpacity
          style={[styles.button, !selected && styles.buttonDisabled]}
          onPress={onNext}
          disabled={!selected}
          activeOpacity={selected ? 0.85 : 1}
        >
          <Text style={[styles.buttonText, !selected && styles.buttonTextDisabled]}>Próximo ➜</Text>
        </TouchableOpacity>
      )}
    >
      <Text style={styles.title}>Quase lá. Valide seu documento de especialidade.</Text>
      <Text style={styles.subtitle}>
        Precisamos do seu registro profissional para confirmar que você está apto a atuar na plataforma!
      </Text>
      <Text style={styles.description}>
        Isso garante segurança aos pacientes e validade jurídica aos documentos que você emitir.
      </Text>
      <View style={styles.documentOptions}>
        <TouchableOpacity
          style={styles.documentOption}
          onPress={handleSelect}
          activeOpacity={0.7}
        >
          <View style={styles.documentIcon}>
            <MaterialCommunityIcons
              name="file-certificate-outline"
              size={28}
              color={selected ? '#01AEA4' : '#4a4f57'}
            />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle}>Registro de Qualificação de Especialista</Text>
            <Text style={styles.documentSubtitle}>
              {selected ? 'Documento adicionado' : 'Clique para adicionar o documento'}
            </Text>
          </View>
          {selected && (
            <Ionicons name="checkmark-circle" size={30} color="#01AEA4" />
          )}
        </TouchableOpacity>
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  subtitle: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 15 },
  description: { fontSize: 14, color: '#888', lineHeight: 20, marginBottom: 30 },
  documentOptions: { marginBottom: 30 },
  documentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  documentInfo: { flex: 1 },
  documentTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  documentSubtitle: { fontSize: 10, color: '#666' },
  button: { backgroundColor: '#4576F2', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginVertical: 25 },
  buttonDisabled: { backgroundColor: '#d0d7de' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonTextDisabled: { color: '#66707a' },
});
