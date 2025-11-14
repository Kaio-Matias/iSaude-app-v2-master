import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Button } from "../../components/ui/Button";
import Stepper from "../../components/ui/Stepper";
import { useNavigation } from "@react-navigation/native";
import { BackHeader } from "../../components/ui/BackHeader";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from "lucide-react-native";

export default function ConfirmedRegisterPacient(props: any) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <BackHeader title="Cadastro Confirmado!" hideBackIcon />
      <Stepper totalSteps={4} currentStep={5} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-4 pt-2 items-center justify-start w-full">
          <View className="w-full items-center mt-2 mb-2">
           
          </View>
         
          <View className="items-center justify-center w-full" style={{ backgroundColor: '#fff', borderRadius: 8, height: '65%', marginBottom: 24, paddingVertical: 8 }}>
            <Image
              source={require("../../assets/images/Confirm-Register-Pacient.png")}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          </View>
          <View className="w-full px-2 flex justify-center">
            <Text className="text-2xl font-bold mb-1 text-left w-full" style={{ marginBottom: 4 }}>
            Cadastro realizado com sucesso!
            </Text>
            <Text className="text-gray-500 text-base text-left w-full">
            Agora você faz parte do iSaúde e pode acessar todos os recursos da nossa plataforma. Bem-vindo!
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ 
        paddingHorizontal: 24, 
        paddingBottom: insets.bottom + 24, 
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6'
      }}>
        <Button
          onPress={() => navigation.navigate('Home')}
          icon={<ArrowRight size={18} color="white" />}
          className="w-full rounded-lg"
          style={{ backgroundColor: '#01AEA4' }}
        >
          Começar a Navegar
        </Button>
      </View>
    </View>
  );
}
