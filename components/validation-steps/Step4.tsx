import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StepLayout from './StepLayout';

interface Step4Props { 
  onFinish: () => void; 
  onSelfieCapture?: () => void;
}

// Step 4: Selfie + tela de "Documentos em Análise"
export default function Step4({ onFinish, onSelfieCapture }: Step4Props) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [reviewMode, setReviewMode] = useState(false); // após selfie

  function handleTakeSelfie() {
    if (isCapturing) return;
    setIsCapturing(true);

    setTimeout(() => {
      setIsCapturing(false);
      setReviewMode(true);
      onSelfieCapture?.(); // Notifica que selfie foi capturada
    }, 1000);
  }

  function handleGoHome() {
    onFinish(); 
  }

  if (reviewMode) {
    return (
      <StepLayout
        footer={(
          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome} activeOpacity={0.85}>
            <Text style={styles.homeButtonText}>Voltar para o Início</Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.illustrationWrapper}>
          <Image
            source={require('../../assets/images/done.png')}
            resizeMode="contain"
            style={{ width: '100%', height: 250 }}
          />
        </View>
        <Text style={styles.reviewTitle}>Documentos em Análise</Text>
        <Text style={styles.reviewSubtitle}>
          Seus documentos foram recebidos e estão em análise. Em até 48 horas você receberá um retorno sobre sua validação.
        </Text>
        <Text style={styles.reviewSubtitle}>
          Enquanto isso, pode continuar utilizando nossa plataforma normalmente.
        </Text>
      </StepLayout>
    );
  }

  return (
    <StepLayout
      footer={(
        <TouchableOpacity
          style={[styles.button, isCapturing && styles.buttonDisabled]}
          onPress={handleTakeSelfie}
          activeOpacity={0.85}
          disabled={isCapturing}
        >
          <Text style={[styles.buttonText, isCapturing && styles.buttonTextDisabled]}>
            {isCapturing ? 'Capturando...' : 'Tirar Selfie'}
          </Text>
        </TouchableOpacity>
      )}
    >
      <Text style={styles.title}>Vamos tirar uma selfie?</Text>
      <Text style={styles.subtitle}>Último passo! Vamos comparar sua selfie com a foto do documento.</Text>
      <Text style={styles.description}>
        Fique tranquilo(a): usamos tecnologia de reconhecimento facial que apaga a imagem após a validação.
      </Text>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
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
  },
  button: {
    marginVertical: 25,
    backgroundColor: '#4576F2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#99B3FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: '#f0f3f9',
  },
  // Review screen styles
  illustrationWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 14,
  },
  reviewSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    marginBottom: 14,
  },
  homeButton: {
    marginVertical: 25,
    backgroundColor: '#01AEA4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
