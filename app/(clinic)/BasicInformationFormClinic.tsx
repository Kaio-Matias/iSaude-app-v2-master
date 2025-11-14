import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { BackHeader } from "../../components/ui/BackHeader";
import Stepper from "../../components/ui/Stepper";
import { Button } from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import DateInput from "../../components/ui/DateInput";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const options = ["Masculino", "Feminino", "Outro", "Prefiro não dizer"];

export default function BasicInformationFormClinic(props: any) {
  const [selectedOption, setSelectedOption] = useState("Masculino");
  const [birthDate, setBirthDate] = useState("");
  const insets = useSafeAreaInsets();

  const isValid = selectedOption && birthDate.trim();

  const handleNext = () => {
    if (!isValid) return;
    if (props.onConfirm) props.onConfirm();
    router.replace('/(clinic)/InstitutionalInformationFormClinic')
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <BackHeader title="Nova Conta" />
      <Stepper totalSteps={5} currentStep={2} />
      
      {/* Conteúdo principal com scroll */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <Text className="text-2xl font-bold mb-1 mt-4">Olá Carlos! Queremos te conhecer melhor.</Text>
            <Text className="text-base text-gray-500 mb-6">
              Agora vamos definir algumas informações básicas sobre você, para criar uma experiência única em nossa plataforma
            </Text>
            <Select
              label="Qual opção melhor representa você?"
              value={selectedOption}
              options={options}
              onSelect={setSelectedOption}
            />
            <DateInput
              label="Data de Nascimento"
              value={birthDate}
              onChange={setBirthDate}
            />
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
