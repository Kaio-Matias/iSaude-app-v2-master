import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: Math.max(insets.top, 12), paddingBottom: Math.max(insets.bottom + 16, 24) }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Localização em Tempo Real</Text>

        <View style={styles.imageWrapper}>
          <Image source={require('../../assets/images/location.png')} style={styles.image} />
        </View>

        <View style={styles.content}>
          <Text style={styles.headline}>A saúde mais perto de você!</Text>
          <Text style={styles.description}>
            Precisamos da sua permissão para acessar sua localização em tempo real enquanto você usa o app.{"\n"}
            Usaremos essa informação para conectar você a pessoas e locais próximos, além de oferecer conteúdo personalizado enquanto você navega no app.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/permissions/contacts')} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Permitir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => router.replace('/permissions/contacts')}>
            <Text style={styles.linkText}>Deixar para depois</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: {
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: '100%'
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  content: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  headline: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  footer: {
    width: '100%',
    marginTop: 24,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A7FFB',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkButton: {},
  linkText: { color: '#4A7FFB', fontSize: 14, fontWeight: '500' },
});