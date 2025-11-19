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
import { useRegister } from '../../context/RegisterContext'; // <--- NOVO

const options = ["Masculino", "Feminino", "Outro", "Prefiro não dizer"];

export default function BasicInformationFormPacient() {
  const { updateData } = useRegister(); // <--- NOVO
  const [selectedOption, setSelectedOption] = useState("Masculino");
  const [birthDate, setBirthDate] = useState(""); // Note: seu componente de data retorna string ou date?
  const insets = useSafeAreaInsets();

  const isValid = selectedOption && birthDate;

  const handleNext = () => {
    if (!isValid) return;
    
    // Salva no contexto
    updateData({ 
        gender: selectedOption, 
        birthDate: birthDate 
    });
    
    router.push("/(pacient)/UserInformationFormPacient");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <BackHeader title="Nova Conta" />
      <Stepper totalSteps={4} currentStep={2} />
      
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <Text className="text-2xl font-bold mb-1 mt-4">Queremos te conhecer melhor.</Text>
            <Text className="text-base text-gray-500 mb-6">
              Agora vamos definir algumas informações básicas sobre você.
            </Text>
            <Select
              label="Qual opção melhor representa você?"
              value={selectedOption}
              options={options}
              onSelect={setSelectedOption}
            />
            {/* Assumindo que seu componente DateInput aceita string e retorna string */}
            <DateInput
              label="Data de Nascimento"
              value={birthDate}
              onChange={setBirthDate} 
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24, borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
        <Button onPress={handleNext} icon={<ArrowRight size={18} color="white" />} disabled={!isValid}>
          Próximo
        </Button>
      </View>
    </View>
  );
}