import { View, Text, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button'; // Correção 1: Chaves {}
import { router } from 'expo-router';
import { api } from '../../lib/api';
import { useRegister } from '../../context/RegisterContext';

export default function ConfirmRegisterPacient() {
  const { data, clearData } = useRegister();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'PACIENTE',
        cpf: data.cpf,
        phone: data.phone,
      };

      console.log("Enviando para API:", payload);

      await api.post('/api/user', payload);

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        { text: 'OK', onPress: () => {
            clearData();
            router.replace('/login'); 
        }}
      ]);

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Não foi possível criar a conta.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5 items-center justify-center">
      <View className="items-center mb-10">
        <Image
          source={require('../../assets/images/cadastro-confirmado.png')}
          className="w-64 h-64 mb-5"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-primary text-center mb-2">
          Tudo pronto!
        </Text>
        <Text className="text-gray-500 text-center text-base">
          {data.name}, agora é só confirmar para criar sua conta de paciente.
        </Text>
      </View>

      <View className="w-full gap-y-4">
        {/* Correção 2: Texto como children em vez de title */}
        <Button onPress={handleConfirm} disabled={loading}>
           {loading ? "Criando conta..." : "Confirmar Cadastro"}
        </Button>
        
        {!loading && (
          /* Correção 3: Variant secondary em vez de outline */
          <Button
            variant="secondary"
            onPress={() => router.back()}
          >
            Voltar e Corrigir
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}