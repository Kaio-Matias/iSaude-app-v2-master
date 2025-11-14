import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { BackHeader } from "../../components/ui/BackHeader";
import Stepper from "../../components/ui/Stepper";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from "lucide-react-native";

function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, "");
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return valor;
}

export default function UnityInformationFormClinic(props: any) {
  const [email, setEmail] = useState("");
  const [telefones, setTelefones] = useState([""]);
  const [inputFocused, setInputFocused] = useState<{ email: boolean; telefone: number | null }>({ email: false, telefone: null });
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    if (props.onConfirm) props.onConfirm({ email, telefones });
    router.push("/(clinic)/PasswordInformationFormClinic");
  };

  const handleTelefoneChange = (value: string, idx: number) => {
    let numeros = value.replace(/\D/g, "");
    if (numeros.length > 11) numeros = numeros.slice(0, 11);
    const novos = [...telefones];
    novos[idx] = numeros;
    setTelefones(novos);
  };

  const handleTelefoneFocus = (idx: number) => {
    setInputFocused({ ...inputFocused, telefone: idx });
  };

  const handleTelefoneBlur = () => {
    setInputFocused({ ...inputFocused, telefone: null });
  };

  const adicionarTelefone = () => {
    setTelefones([...telefones, ""]);
  };

  const podeAvancar = email.trim() && telefones.some(t => t.trim());

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Nova Conta" onBackPress={() => router.back()} />
      <Stepper totalSteps={5} currentStep={4} />
      
      {/* Conteúdo principal com scroll */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-14">
            <Text className="font-bold text-2xl mb-1 text-left">Vamos manter sua Unidade conectada!</Text>
            <Text className="text-gray-500 text-base mb-0.5 text-left">Agora vamos definir algumas informações de contato!</Text>
            <Text className="text-gray-500 text-base mb-3 text-left">Insira seu melhor Email e um Número de Telefone para enviarmos um Código de Verificação para ativar sua conta.</Text>
          </View>
          <View className="px-6 pt-6">
            <Input
              label="Email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChangeText={setEmail}
              icon={<Feather name="mail" size={16} color={inputFocused.email ? '#2563eb' : '#9ca3af'} style={{ marginRight: 4 }} />}
              
              onFocus={() => setInputFocused({ ...inputFocused, email: true })}
              onBlur={() => setInputFocused({ ...inputFocused, email: false })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View className="px-6 pt-2">
            <Text className="font-semibold text-base mb-2 text-left">Número de Telefone</Text>
            {telefones.map((telefone, idx) => (
              <View key={idx} className="flex-row items-center mb-3">
                <View style={{ flex: 1 }}>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={formatarTelefone(telefone)}
                    onChangeText={(v: string) => handleTelefoneChange(v, idx)}
                    icon={<Feather name="phone" size={16} color={inputFocused.telefone === idx ? '#2563eb' : '#9ca3af'} style={{ marginRight: 4 }} />}
                    className="text-base text-gray-800"
                    onFocus={() => handleTelefoneFocus(idx)}
                    onBlur={handleTelefoneBlur}
                    keyboardType="phone-pad"
                  />
                </View>
                {telefones.length > 1 && (
                  <TouchableOpacity
                    onPress={() => setTelefones(telefones.filter((_, i) => i !== idx))}
                    className="ml-2 justify-center mb-6"
                    style={{ height: 48 }}
                  >
                    <Feather name="x" size={22} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <Button onPress={adicionarTelefone} className="bg-blue-100 rounded-md py-3 mt-2 flex-row items-center justify-center w-full">
              <Text className=" font-medium mr-1">Adicionar Telefone </Text>
              <Feather name="plus" size={16} color="#fff" />
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Botão fixo na parte inferior */}
      <View style={{ 
        paddingHorizontal: 24, 
        paddingBottom: insets.bottom + 24, 
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6'
      }}>
        <Button
          onPress={handleNext}
          icon={<ArrowRight size={18} color="white" />}
          disabled={!podeAvancar}
        >
          Próximo
        </Button>
      </View>
    </SafeAreaView>
  );
}
