import React from "react";
import { SafeAreaView, Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { BackHeader } from "../components/ui/BackHeader";
import { Button } from "../components/ui/Button";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from "expo-router";

export default function ConnectTypeScreen() {
    const handleBack = () => {
        router.back();
      };
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
            {/* Cabeçalho */}
            <BackHeader title="Nova Conta" onBackPress={handleBack} />

            {/* Ilustração */}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View className="items-center justify-center">
                    <Image
                        source={require("../assets/images/register-image-part2.png")}
                        style={{ width: "90%", height: "60%" }}
                        resizeMode="contain"
                    />
                </View>

                {/* Conteúdo */}
                <View className="flex-1 px-6 ">
                    <Text className="text-xl font-bold mb-2">Como você quer se conectar?</Text>
                    <Text className="text-base text-gray-600 mb-6">
                        Escolha se deseja oferecer seus serviços como <Text style={{fontWeight: 'bold'}}>profissional de saúde</Text> ou cadastrar sua <Text style={{fontWeight: 'bold'}}>unidade de atendimento</Text> (Clínicas, Laboratórios, Consultórios e outros).
                    </Text>

                    {/* Botões */}
                    <Button
                        onPress={() => router.push('/(professional)/PersonalInformationFormProfessional')}
                        className="flex-row items-center justify-between rounded-xl px-6 py-4 mb-4"
                        style={{ backgroundColor: '#01AEA4', justifyContent: 'space-between', marginBottom: 12 }}
                        icon={<ArrowRight size={22} color="#fff" />}
                    >
                        <Text className="text-white text-base font-semibold">Continuar como Profissional de Saúde</Text>
                    </Button>

                    <Button
                      onPress={() => router.push('/(clinic)/PersonalInformationFormClinic')}
                        className="flex-row items-center justify-between rounded-xl px-6 py-4"
                        style={{ backgroundColor: '#7F5CE1', justifyContent: 'space-between', marginBottom: insets.bottom + 12 }}
                        icon={<ArrowRight size={22} color="#fff" />}
                    >
                        <Text className="text-white text-base font-semibold">Continuar como Unidade de Atendimento</Text>
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
} 