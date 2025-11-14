import { SafeHeaderStyles } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PreValidacao() {
  const insets = useSafeAreaInsets();

  function handleStartValidation() {
    router.push('/validacao');
  }

  function handleGoBack() {
    router.push('/(tabs)/home');
  }

  return (
    <SafeAreaView style={[styles.container,]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Informações Profissionais</Text>
        <View style={styles.infoIcon}>
          <Ionicons name="information-circle-outline" size={24} color="black" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationWrapper}>
          <Image
            source={require('../../assets/images/informacoes.png')}
            resizeMode="cover"
            style={styles.illustration}
          />
        </View>

        <Text style={styles.title}>Pronto para atender no iSaúde?</Text>
        <Text style={styles.subtitle}>
          Adicione suas informações profissionais como <Text style={{ fontWeight: 'bold' }}>Horário de Funcionamento, Serviços que você oferece, Endereço e Chave Pix</Text> para iniciar seus atendimento em nossa comunidade.
        </Text>
      </View> 

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleStartValidation}>
          <Text style={styles.primaryButtonText}>Adicionar Informações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack}>
          <Text style={styles.secondaryButtonText}>Pular por enquanto! </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    ...SafeHeaderStyles.regularHeader,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoIcon: {
    width: 24,
    height: 24,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  illustrationWrapper: {
    width: '100%',
    marginBottom: 32,
  },
  illustration: {
    width: '100%',
    height: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E2532',
    textAlign: 'left',
    marginBottom: 16,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4A5463',
    textAlign: 'left',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  primaryButton: {
    backgroundColor: '#4A7FFB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4A7FFB',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});