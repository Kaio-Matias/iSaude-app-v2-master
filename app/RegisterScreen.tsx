import React from "react";
import { View, Text, Image, ScrollView, Platform } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { BackHeader } from "../components/ui/BackHeader";
import { Button } from "../components/ui/Button";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from "expo-router";

export default function RegisterScreen() {
    const handleBack = () => {
        router.back();
      };
    const insets = useSafeAreaInsets();
    
    return (
        <View style={{ 
            flex: 1, 
            backgroundColor: "#fff",
            paddingTop: insets.top,
            paddingBottom: Platform.OS === 'android' ? insets.bottom : 0,
            paddingLeft: Platform.OS === 'android' ? insets.left : 0,
            paddingRight: Platform.OS === 'android' ? insets.right : 0
        }}>
            {/* Cabeçalho */}
            <BackHeader title="Nova Conta" onBackPress={handleBack} />

            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                keyboardShouldPersistTaps="handled"
            >
                {/* Ilustração */}
                <View className="items-center justify-center mt-2">
                    <Image
                        source={require("../assets/images/register-image.png")}
                        style={{ width: "90%", height: '60%' }}
                        resizeMode="contain"
                    />
                </View>

                {/* Conteúdo */}
                <View className="flex-1 px-6">
                    <Text className="text-2xl font-bold mb-2">Vamos iniciar sua Jornada.</Text>
                    <Text className="text-base text-gray-600 mb-2">
                        No iSaúde, conectamos profissionais de saúde, clínicas, farmácias e pacientes em uma rede de cuidado e bem-estar.
                    </Text>
                    <Text className="text-base text-gray-600 mb-6">
                        Escolha abaixo como você deseja começar sua jornada com a gente:
                    </Text>

                    {/* Botões */}
                    <Button
                        className="flex-row items-center justify-between rounded-xl px-6 py-4 mb-4"
                        onPress={() => router.push('/(pacient)/PersonalInformationFormPacient')}
                        variant="primary"
                        icon={<ArrowRight size={22} color="#fff" />}
                        style={{ marginBottom: 12, justifyContent: 'space-between' }}
                    >
                        <Text className="text-white text-base font-semibold">Quero cuidar da minha Saúde</Text>
                    </Button>

                    <Button
                        className="flex-row items-center justify-between rounded-xl px-6 py-4"
                        onPress={() => router.push('/ConnectTypeScreen')}
                        variant="secondary"
                        icon={<ArrowRight size={22} color="#fff" />}
                        style={{ marginBottom: Platform.OS === 'android' ? insets.bottom + 24 : 24, justifyContent: 'space-between' }}
                    >
                        <Text className="text-white text-base font-semibold">Quero oferecer meus Serviços</Text>
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}