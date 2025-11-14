import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Building, Hospital } from 'lucide-react-native';
import Stepper from '../../components/ui/Stepper';
import Select from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { BackHeader } from '../../components/ui/BackHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';

const TIPOS_UNIDADE = [
  'Clínica Médica',
  'Hospital',
  'Laboratório',
  'Consultório',
  'Centro de Diagnóstico',
  'Outro'
];

export default function InstitutionalInformationFormClinic({ navigation }: { navigation: any }) {
  const [cnpj, setCnpj] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [tipoUnidade, setTipoUnidade] = useState('Clínica Médica');
  const insets = useSafeAreaInsets();

  const isValid = cnpj.trim() && nomeFantasia.trim();

  const formatCNPJ = (text: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = text.replace(/\D/g, '');
    
    // Aplica a formatação do CNPJ: XX.XXX.XXX/XXXX-XX
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    } else if (numbers.length <= 12) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    } else {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }
  };

  const handleCNPJChange = (text: string) => {
    const formatted = formatCNPJ(text);
    setCnpj(formatted);
  };

  const handleNext = () => {
    if (!isValid) return;
    // Validação e navegação
    navigation.navigate('UnityInformationFormClinic');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top }}>
      <BackHeader title="Nova Conta" />
      <Stepper totalSteps={5} currentStep={3} />
      
      {/* Conteúdo principal com scroll */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8, marginTop: 24 }}>Informações Institucionais</Text>
            <Text style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>
              Preencha as informações da sua instituição para que possamos conectar você com pacientes e profissionais de forma clara, segura e organizada.
            </Text>
            <Input
              label="CNPJ"
              value={cnpj}
              onChangeText={handleCNPJChange}
              placeholder="01.234.567/0001-10"
              keyboardType="numeric"
              icon={<Building size={20} color="#6B7280" />}
            />
            <Input
              label="Nome Fantasia"
              value={nomeFantasia}
              onChangeText={setNomeFantasia}
              placeholder="Clínica Saúde"
              icon={<Hospital size={20} color="#6B7280" />}
            />
            <Select
              label="Tipo de Unidade"
              value={tipoUnidade}
              options={TIPOS_UNIDADE}
              onSelect={setTipoUnidade}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Botão fixo na parte inferior */}
      <View style={{ 
        paddingHorizontal: 24, 
        paddingBottom: insets.bottom + 24, 
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6'
      }}>
        <Button onPress={handleNext} icon={<ArrowRight size={18} color="white" />} disabled={!isValid}>
          Continuar
        </Button>
      </View>
    </View>
  );
}
