import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components/ui/Button';
import { BackHeader } from '../components/ui/BackHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Terms() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Termos de Uso" onBackPress={() => router.back()} />
      <View className="flex-1">
        <ScrollView className="flex-1 px-6 pt-2" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
          <Text className="text-gray-700 text-lg">
            Para proteger cada etapa da sua jornada, solicitamos seu CPF por 3 motivos muito importantes:
            {"\n\n"}
            1. Validar sua identidade com segurança durante consultas e procedimentos médicos.
            {"\n\n"}
            2. Garantir transparência na emissão de notas fiscais para exames, medicamentos e serviços.
            {"\n\n"}
            3. Assegurar a integridade das transações e dos seus dados pessoais.
            {"\n\n"}
            Assim, mantemos um ambiente confiável e transparente para você e toda nossa comunidade.
            {"\n\n"}
            Fique tranquilo(a)! Seus dados são protegidos com os mais altos padrões de segurança, e usaremos essas informações apenas para seu benefício.
            {"\n\n"}
            Para proteger cada etapa da sua jornada, solicitamos seu CPF por 3 motivos muito importantes:
            {"\n\n"}
            1. Validar sua identidade com segurança durante consultas e procedimentos médicos.
            {"\n\n"}
            2. Garantir transparência na emissão de notas fiscais para exames, medicamentos e serviços.
            {"\n\n"}
            3. Assegurar a integridade das transações e dos seus dados pessoais.
            {"\n\n"}
            Assim, mantemos um ambiente confiável e transparente para você e toda nossa comunidade.
            {"\n\n"}
            Fique tranquilo(a)! Seus dados são protegidos com os mais altos padrões de segurança, e usaremos essas informações apenas para seu benefício.
          </Text>
        </ScrollView>
        <View className="px-6 pb-6 pt-2 bg-white" style={{ paddingBottom: insets.bottom + 8 }}>
          <Button onPress={() => router.back()} className="bg-[#01AEA4] rounded-md py-3 w-full">
            Entendi!!
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
