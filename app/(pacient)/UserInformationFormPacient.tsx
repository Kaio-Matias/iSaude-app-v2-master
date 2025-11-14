import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { router } from "expo-router";
import { BackHeader } from "../../components/ui/BackHeader";
import Stepper from "../../components/ui/Stepper";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SUGESTOES = [
  "maria.gen",
  "mariagen174",
  "gen.m014",
  "maria.souza"
];

export default function UserInformationFormPacient(props: any) {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const isValid = username.trim().length > 0;

  const handleNext = () => {
    if (!isValid) return;
    if (props.onConfirm) props.onConfirm(username);
    router.push("/(pacient)/PasswordInformationFormPacient");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <BackHeader title="Nova Conta" />
      <Stepper totalSteps={4} currentStep={3} />
      
      {/* Conteúdo principal com scroll */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <Text className="text-2xl font-bold mb-1 mt-4">Escolha um nome de usuário</Text>
            <Text className="text-base text-gray-500 mb-6">
              Esse nome será usado para identificar você na plataforma.
            </Text>
            <Input
              label="Nome de Usuário"
              placeholder="Ex: carlos.souza"
              value={username}
              onChangeText={setUsername}
              icon={<Text className={inputFocused ? "text-blue-600 text-base mr-1" : "text-gray-400 text-base mr-1"}>@</Text>}
              className="text-base text-gray-800"
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            <Text className="text-black text-xs mb-1 text-left">Alguns nomes disponíveis</Text>
            <View className="mb-4 px-6">
            {SUGESTOES.map((s) => (
              <TouchableOpacity key={s} onPress={() => setUsername(s)} className="mb-1">
                <Text className="text-gray-500 text-sm">@{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
          disabled={!isValid}
        >
          Próximo
        </Button>
      </View>
    </View>
  );
}
