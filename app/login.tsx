import React, { useState } from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, View, Linking, ImageBackground } from "react-native";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ReusableModal } from "../components/ui/ReusableModal";
import { ChevronRight, ArrowRight, KeyRound, IdCard } from "lucide-react-native";
import { Link as UILink } from "../components/ui/Link";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from "expo-router";

export default function LoginScreen() {
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [senha, setSenha] = useState("");
    const [modalVisible, setModalVisible] = useState(true);
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
    const [smsModal, setSmsModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");

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
                        label="CPF ou CNPJ"
                        placeholder="Digite seu CPF ou CNPJ aqui"
                        value={cpfCnpj}
                        onChangeText={setCpfCnpj}
                        icon={<IdCard size={18} color="#A0AEC0" />}
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
                    <Button onPress={() => { router.replace('/(tabs)/home')}} icon={<ArrowRight size={20} color="white" />}>
                        Continuar
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
