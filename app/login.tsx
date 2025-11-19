import React, { useState } from "react";
import { Image, SafeAreaView, Text, View, ImageBackground, Alert } from "react-native";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ReusableModal } from "../components/ui/ReusableModal";
import { ChevronRight, ArrowRight, KeyRound, Mail } from "lucide-react-native";
import { Link as UILink } from "../components/ui/Link";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { api } from "../lib/api"; // Usando a API direta

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [modalVisible, setModalVisible] = useState(true);
    const [loading, setLoading] = useState(false);

    const insets = useSafeAreaInsets();
    const algumModalAberto = Boolean(modalVisible);

    const handleNavigateToRegister = () => {
        setModalVisible(false);
        router.push('/RegisterScreen');
    };

    const handleLogin = async () => {
        if (!email || !senha) return Alert.alert("Erro", "Preencha todos os campos");

        setLoading(true);
        try {
            // Chamada real para a API (BFF)
            const response = await api.post('/api/user/login', {
                email: email.trim(),
                password: senha
            });

            const { token, user } = response.data;

            // Salva sessão
            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userData', JSON.stringify(user));
            
            console.log("Login com sucesso:", user.name);
            router.replace('/(tabs)/home');

        } catch (error: any) {
            const msg = error.response?.data?.error || "Verifique suas credenciais.";
            Alert.alert("Erro no Login", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require("../assets/images/home-image.png")} className={`flex-1${algumModalAberto ? ' pb-80' : ''}`}>
            <SafeAreaView className="flex-1 bg-transparent">
                <View className="flex-1 px-4 pt-10">
                    <View className={`flex-1 items-center justify-center${algumModalAberto ? ' pb-80' : ''}`}>
                        <Image source={require("../assets/images/logo-text.png")} className="w-60 h-30" resizeMode="contain" />
                    </View>
                </View>

                <ReusableModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                    <Text className="text-2xl font-bold mb-1">Que bom ter você de volta!</Text>
                    <Text className="text-lg text-gray-500 mb-4">
                        Utilize suas Informações de Login para entrar na comunidade iSaúde!
                    </Text>
                    <Input
                        label="Email"
                        placeholder="Digite seu email aqui"
                        value={email}
                        onChangeText={setEmail}
                        icon={<Mail size={18} color="#A0AEC0" />}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Input
                        label="Senha"
                        placeholder="Digite sua senha aqui"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        icon={<KeyRound size={18} color="#A0AEC0" />}
                    />
                    <View className="flex-row justify-end p-4 mb-10">
                        <UILink
                            onPress={() => {
                                setModalVisible(false);
                                router.push('/ForgotPasswordScreen');
                            }}
                            variant="black"
                            icon={<ChevronRight size={16} color="#222" />}
                        >
                            Esqueci minha Senha!
                        </UILink>
                    </View>
                    <Button onPress={handleLogin} icon={<ArrowRight size={20} color="white" />} disabled={loading}>
                        {loading ? "Entrando..." : "Continuar"}
                    </Button>
                    <View className="flex-row justify-center mt-4">
                        <Text className="text-center text-lg">Novo por aqui? </Text>
                        <UILink onPress={handleNavigateToRegister} className="text-lg">Crie uma conta!</UILink>
                    </View>
                </ReusableModal>

                {!algumModalAberto && (
                  <Button
                    className="self-center w-10/12"
                    style={{ marginBottom: insets.bottom + 24 }}
                    onPress={() => setModalVisible(true)}
                  >
                    Começar
                  </Button>
                )}
            </SafeAreaView>
        </ImageBackground>
    );
}