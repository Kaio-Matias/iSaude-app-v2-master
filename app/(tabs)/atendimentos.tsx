import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AtendimentosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atendimentos</Text>
      <Text style={styles.subtitle}>Em breve você verá aqui seus atendimentos, agenda e histórico.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#1E2532', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#4A5463', textAlign: 'center', lineHeight: 20 },
});
