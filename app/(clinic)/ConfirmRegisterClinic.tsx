import { View, Text, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button'; // Importação correta { }
import { router } from 'expo-router';
import { api } from '../../lib/api';
import { useRegister } from '../../context/RegisterContext'; // Integração com Contexto

export default function ConfirmRegisterClinic() {
  const { data, clearData } = useRegister(); // Pega dados da memória
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Monta o payload usando os dados salvos nas telas anteriores
      const payload = {
        ///name: data.fantasyName || data.name, // Nome Fantasia
        email: data.email,
        password: data.password,
        phone: data.phone,
        //cpf: data.cnpj, // A API usa o campo CPF para documentos genéricos (CNPJ)
        role: 'CLINICA',
        // unityName: data.unityName // Se houver nome da unidade específico
      };

      console.log("Enviando Clínica:", payload);

      await api.post('/api/user', payload);

      Alert.alert('Sucesso', 'Clínica cadastrada com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            clearData();
            router.replace('/login');
          } 
        }
      ]);

    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'Erro ao cadastrar clínica.';
      Alert.alert('Erro', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5 items-center justify-center">
      <View className="items-center mb-10">
        <Image
          source={require('../../assets/images/Confirm-Register-Clinic.png')}
          className="w-64 h-64 mb-5"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-primary text-center mb-2">
          Bem-vindo, Parceiro!
        </Text>
        <Text className="text-gray-500 text-center text-base">
          Confirme os dados da sua unidade de saúde.
        </Text>
      </View>

      <View className="w-full gap-y-4">
        {/* CORREÇÃO: Texto dentro da tag Button */}
        <Button onPress={handleConfirm} disabled={loading}>
           {loading ? "Cadastrando..." : "Confirmar e Acessar"}
        </Button>
        
        {/* CORREÇÃO: Variant 'secondary' em vez de 'outline' */}
        {!loading && (
          <Button 
            variant="secondary" 
            onPress={() => router.back()} 
          >
            Voltar
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}