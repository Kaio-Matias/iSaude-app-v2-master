import React, { useState } from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, View, Linking, ImageBackground, Alert } from "react-native";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ReusableModal } from "../components/ui/ReusableModal";
import { ChevronRight, ArrowRight, KeyRound, Mail } from "lucide-react-native";
import { Link as UILink } from "../components/ui/Link";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from "expo-router";
import { signIn } from "../lib/auth";
import { useAuth } from "../hooks/useAuth";

import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [modalVisible, setModalVisible] = useState(true);
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
    const [smsModal, setSmsModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const insets = useSafeAreaInsets();

    const algumModalAberto = Boolean(modalVisible || forgotPasswordModal || smsModal);

    const handleShowSmsModal = (phone: string) => {
        setPhoneNumber(phone);
        setForgotPasswordModal(false);
        setSmsModal(true);
    };

    const handleBackToForgotPassword = () => {
        setSmsModal(false);
        setForgotPasswordModal(true);
    };

    const handleVerifyCode = (code: string) => {
        console.log("Código verificado:", code);
        // Aqui você pode adicionar a lógica de verificação
        setSmsModal(false);
    };

    const handleResendCode = () => {
        console.log("Reenviando código para:", phoneNumber);
        // Aqui você pode adicionar a lógica de reenvio
    };

    const handleNavigateToRegister = () => {
        setModalVisible(false); // Fecha o modal
        router.push('/RegisterScreen');
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const { token } = await signIn({ email, password: senha });
            login(token);
            console.log("Login successful, token:", token);
            router.replace('/(tabs)/home');
        } catch (error) {
            Alert.alert("Erro no Login", error instanceof Error ? error.message : "Ocorreu um erro desconhecido.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <ImageBackground source={require("../assets/images/home-image.png")} className={`flex-1${algumModalAberto ? ' pb-80' : ''}`}>
            <SafeAreaView className="flex-1 bg-transparent">
                <View className="flex-1 px-4 pt-10">
                    {/* Topo com imagem e logo */}
                    <View className={`flex-1 items-center justify-center${algumModalAberto ? ' pb-80' : ''}`}>
                        <Image source={require("../assets/images/logo-text.png")} className="w-60 h-30" resizeMode="contain" />
                    </View>
                
                </View>
                {/* Modal de exemplo */}
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
                {/* Botão 'Começar' só aparece se nenhum modal estiver aberto */}
                {!algumModalAberto && (
                  <Button
                    className="self-center w-10/12"
                    style={{ marginBottom: insets.bottom + 24 }}
                    onPress={() => setModalVisible(true)}
                  >
                    Começar
                  </Button>
                )}
                {/* Modal de Esqueceu a Senha */}
                {/* <ForgotPasswordModal ... /> */}
                {/* Modal de Confirmação SMS */}
                {/* <ConfirmSmsCodeModal ... /> */}
            </SafeAreaView>
        </ImageBackground>
    );
}
