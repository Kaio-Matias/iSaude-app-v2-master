import React, { useState } from "react";
import { Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Phone, ArrowRight } from "lucide-react-native";
import { Link } from "../components/ui/Link";
import { BackHeader } from "../components/ui/BackHeader";
import { router } from "expo-router";
import { ConfirmSmsCodeModal } from "../components/modals/ConfirmSmsCodeModal";
import { ErrorBanner } from "../components/ui/ErrorBanner";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const [phone, setPhone] = useState("");
  const [smsModalVisible, setSmsModalVisible] = useState(false);
  const [erro, setErro] = useState("");
  const insets = useSafeAreaInsets();

  function formatPhone(value: string) {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length < 11) return cleaned;
    return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,7)}-${cleaned.slice(7,11)}`;
  }

  const handleSend = () => {
    if (!phone || phone.length < 11) {
      setErro("Digite um número de telefone válido.");
      return;
    }
    setErro("");
    setSmsModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <BackHeader title="Recuperação de Senha" onBackPress={() => router.back()} />
      <ErrorBanner visible={!!erro} title={erro} onClose={() => setErro("")} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 24, marginBottom: 8 }}>
              Esqueceu sua Senha?
            </Text>
            <Text style={{ fontSize: 15, color: '#6B7280', marginBottom: 32, lineHeight: 20 }}>
              Digite o telefone que você usou para criar sua conta no iSaúde. Vamos te enviar um link para redefinir a senha.
            </Text>
            <Input
              label="Número de Telefone"
              placeholder="(00) 00000-0000"
              value={formatPhone(phone)}
              onChangeText={(text: string) => setPhone(text.replace(/\D/g, "").slice(0,11))}
              icon={<Phone size={18} color="#A0AEC0" />}
              keyboardType="phone-pad"
            />
          </View>
          <View style={{ paddingHorizontal: 24, paddingVertical: 24, paddingBottom: Platform.OS === 'android' ? 40 : 24 }}>
            <Button onPress={handleSend} icon={<ArrowRight size={20} color="white" />} className="w-full">
              Continuar
            </Button>
            <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Link className="mt-4 text-center text-blue-600" onPress={() => router.push('/login')}>
                Não tenho acesso ao Email ou Telefone
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ConfirmSmsCodeModal
        visible={smsModalVisible}
        onClose={() => setSmsModalVisible(false)}
        onVerify={(code: string) => {
          setSmsModalVisible(false);
          router.push('/NovaSenhaScreen');
        }}
        onResend={() => {}}
        phoneEnding={phone.slice(-4)}
      />
    </View>
  );
} 