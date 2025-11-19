import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { KeyRound, ArrowRight } from "lucide-react-native";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { BackHeader } from "../../components/ui/BackHeader";
import Stepper from "../../components/ui/Stepper";
import { ErrorBanner } from "../../components/ui/ErrorBanner";
import { router } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRegister } from '../../context/RegisterContext'; // <--- NOVO

export default function PasswordInformationFormPacient() {
  const { updateData } = useRegister(); // <--- NOVO
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const insets = useSafeAreaInsets();

  // Critérios e Força (Mantidos originais)
  const criteria = [
    { label: 'Mínimo de 8 caracteres', valid: senha.length >= 8 },
    { label: 'Letra maiúscula', valid: /[A-Z]/.test(senha) },
    { label: 'Número', valid: /[0-9]/.test(senha) },
    { label: 'Caractere especial', valid: /[^A-Za-z0-9]/.test(senha) },
  ];
  const allCriteriaMet = criteria.every(c => c.valid);

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return 0;
    if (score === 2 || score === 3) return 1;
    return 2;
  };

  const strength = getPasswordStrength(senha);
  const strengthLabels = ["Fraca", "Média", "Forte"];
  const getBarColor = (barIndex: number) => {
    if (strength === 2) return '#10b981';
    if (strength === 1) return barIndex < 2 ? '#f59e42' : '#e5e7eb';
    if (strength === 0) return barIndex === 0 ? '#ef4444' : '#e5e7eb';
    return '#e5e7eb';
  };
  const getStrengthTextColor = () => {
    if (strength === 2) return '#10b981';
    if (strength === 1) return '#f59e42';
    if (strength === 0) return '#ef4444';
    return '#6b7280';
  };

  const isValid = senha.trim() && confirmar.trim() && senha === confirmar && (strength === 2 && allCriteriaMet);

  const handleCriarSenha = () => {
    if (!senha || !confirmar) return setErro("Preencha todos os campos.");
    if (senha !== confirmar) return setErro("As senhas não coincidem.");
    if (!(strength === 2 && allCriteriaMet)) return setErro("A senha precisa ser forte.");
    
    setErro("");
    
    // Salva senha no contexto
    updateData({ password: senha });
    
    router.push("/(pacient)/ConfirmRegisterPacient");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <ErrorBanner visible={!!erro} title={erro} onClose={() => setErro("")} />
      <BackHeader title="Nova Conta" />
      <Stepper totalSteps={4} currentStep={4} />
      
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <View style={{ marginTop: 24 }}>
              <Text className="text-2xl font-bold mb-2">Agora vamos criar uma Senha!</Text>
              <Text className="text-lg text-gray-500 mb-4">Crie uma senha forte que será usada para fazer login.</Text>
              
              <Input
                label="Crie uma Senha"
                placeholder="Digite sua senha aqui"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                icon={<KeyRound size={18} color="#A0AEC0" />}
              />

              {senha.length > 0 && !(strength === 2 && allCriteriaMet) && (
                <View style={{ marginTop: 8 }}>
                  {criteria.filter(c => !c.valid).map((c, idx) => (
                    <Text key={idx} style={{ color: '#ef4444', fontSize: 13 }}>• {c.label}</Text>
                  ))}
                </View>
              )}

              {senha.length > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 2 }}>
                  {[0,1,2].map((i) => (
                    <View key={i} style={{ flex: 1, height: 8, marginHorizontal: 3, borderRadius: 4, backgroundColor: getBarColor(i) }} />
                  ))}
                  <Text style={{ marginLeft: 10, color: getStrengthTextColor(), fontWeight: 'bold', fontSize: 13 }}>
                    {strengthLabels[strength]}
                  </Text>
                </View>
              )}

              <Input
                label="Digite novamente a Senha"
                placeholder="Digite sua senha aqui"
                value={confirmar}
                onChangeText={setConfirmar}
                secureTextEntry
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24, borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
        <Button onPress={handleCriarSenha} icon={<ArrowRight size={18} color="white" />} disabled={!isValid}>
          Próximo
        </Button>
      </View>
    </View>
  );
}