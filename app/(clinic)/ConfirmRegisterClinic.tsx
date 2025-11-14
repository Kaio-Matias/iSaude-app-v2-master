import React from "react";
import { View, Text, Image, SafeAreaView, ScrollView } from "react-native";
import { Button } from "../../components/ui/Button";
import Stepper from "../../components/ui/Stepper";
import { router } from "expo-router";
import { BackHeader } from "../../components/ui/BackHeader";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfirmedRegisterClinic(props: any) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Cadastro Confirmado!" hideBackIcon />
      <Stepper totalSteps={5} currentStep={6} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-4 pt-2 items-center justify-start w-full">
          <View className="w-full items-center mt-2 mb-2">
           
          </View>
         
          <View className="items-center justify-center w-full" style={{ backgroundColor: '#fff', borderRadius: 8, height: '65%', marginBottom: 24, paddingVertical: 8 }}>
            <Image
              source={require("../../assets/images/Confirm-Register-Clinic.png")}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          </View>
          <View className="w-full px-2 flex justify-center">
            <Text className="text-2xl font-bold mb-1 text-left w-full" style={{ marginBottom: 4 }}>
            Cadastro realizado com sucesso!
            </Text>
            <Text className="text-gray-500 text-base text-left w-full">
            Agora sua Unidade faz parte do iSaúde e você pode vincular profissionais, gerenciar serviços e se conectar com pacientes que buscam acolhimento e confiança. Vamos transformar o cuidado juntos.
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24, backgroundColor: "#fff" }}>
        <Button
          onPress={() => router.replace('/(tabs)/home')}
          className="w-full rounded-lg"
          style={{ backgroundColor: '#01AEA4' }}
        >
          Começar a Navegar
        </Button>
      </View>
    </SafeAreaView>
  );
}
