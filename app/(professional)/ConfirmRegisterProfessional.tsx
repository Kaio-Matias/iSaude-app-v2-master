import { View, Text, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button'; // Correção 1
import { router } from 'expo-router';
import { api } from '../../lib/api';
import { useRegister } from '../../context/RegisterContext';

export default function ConfirmRegisterProfessional() {
  const { data, clearData } = useRegister();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'PROFISSIONAL',
        cpf: data.cpf,
        phone: data.phone,
        // Seus campos específicos de profissional (certifique-se que o backend aceita)
        // crm: data.professionalId,
        // specialty: data.specialty
      };

      await api.post('/api/user', payload);

      Alert.alert('Sucesso', 'Profissional cadastrado!', [
        { 
          text: 'Ir para Login', 
          onPress: () => {
            clearData();
            router.replace('/login');
          } 
        }
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Falha no cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5 items-center justify-center">
      <View className="items-center mb-10">
        <Image
          source={require('../../assets/images/cadastro-confirmado-profissional.png')}
          className="w-64 h-64 mb-5"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-primary text-center mb-2">
          Confirmação Profissional
        </Text>
        <Text className="text-gray-500 text-center text-base">
          Finalize seu cadastro para atender.
        </Text>
      </View>

      <View className="w-full gap-y-4">
        {/* Correção 2: Texto como children */}
        <Button onPress={handleConfirm} disabled={loading}>
            {loading ? "Processando..." : "Finalizar Cadastro"}
        </Button>

        {/* Correção 3: Variant secondary */}
        <Button variant="secondary" onPress={() => router.back()} disabled={loading}>
            Voltar
        </Button>
      </View>
    </SafeAreaView>
  );
}