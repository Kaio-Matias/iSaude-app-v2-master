import React, { useState, useEffect } from "react";
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { BackHeader } from "../../components/ui/BackHeader";
import { Mail, User, Phone, ChevronRight, ArrowRight } from "lucide-react-native";
import Stepper from "../../components/ui/Stepper";
import { Link } from "../../components/ui/Link";
import { router } from "expo-router";
import { ConfirmSmsCodeModal } from '../../components/modals/ConfirmSmsCodeModal';
import { SucessVerificationModal } from '../../components/modals/SucessVerificationModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPatientProfile } from '../../lib/patient';
import { useAuth } from '../../hooks/useAuth';

export default function PersonalInformationFormPacient(props: any) {
  const { isAuthenticated } = useAuth();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const insets = useSafeAreaInsets();

  const isValid = nome.trim() && cpf.trim() && email.trim() && telefone.trim();

  useEffect(() => {
    async function loadProfile() {
      if (!isAuthenticated) {
        setLoadingProfile(false);
        return;
      }
      try {
        const profile = await getPatientProfile();
        setNome(profile.name);
        setEmail(profile.email);
        // Assuming CPF and telefone are part of the profile, add them here
        // setCpf(profile.cpf);
        // setTelefone(profile.telefone);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o perfil do paciente.");
        console.error("Failed to load patient profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, [isAuthenticated]);

  const handleContinue = () => {
    if (!isValid) return;
    if (!verified) {
      setShowModal(true);
      return;
    }
    router.push("/(pacient)/BasicInformationFormPacient");
  };

  // Função para formatar CPF
  function formatCpf(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    let formatted = cleaned;
    if (cleaned.length > 9) formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    else if (cleaned.length > 6) formatted = cleaned.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    else if (cleaned.length > 3) formatted = cleaned.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    return formatted;
  }

  // Função para formatar telefone
  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numeros;
  }

  if (loadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <BackHeader title="Nova Conta" />
      <Stepper totalSteps={4} currentStep={1} />
      
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
            <Text className="text-2xl font-bold mb-1 mt-4">Vamos começar sua jornada!</Text>
            <Text className="text-lg text-gray-500 mb-4">
             Precisamos dos seus dados para criar sua conta.
            </Text>
            <Input
              label="Nome Completo"
              placeholder="Carlos Magno de Souza"
              icon={<User size={18} color="#A0AEC0" />}
              value={nome}
              onChangeText={setNome}
            />
            <View className="mb-2">
              <Input
                label="CPF"
                placeholder="000.000.000-00"
                className="m-0 p-0"
                icon={<User size={18} color="#A0AEC0" />}
                value={cpf}
                onChangeText={(text: string) => setCpf(formatCpf(text))}
              />
              <Link
                onPress={() => {
                  // Aqui você pode abrir um modal explicativo, se desejar
                }}
                variant="muted"
                icon={<ChevronRight size={16} color="#222" />}
              >
                Por que pedimos seu CPF?
              </Link>
            </View>
            <Input
              label="Email"
              placeholder="seuemail@exemplo.com"
              icon={<Mail size={18} color="#A0AEC0" />}
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Número de Telefone"
              placeholder="(00) 00000-0000"
              icon={<Phone size={18} color="#A0AEC0" />}
              value={formatarTelefone(telefone)}
              onChangeText={(v: string) => setTelefone(v.replace(/\D/g, "").slice(0, 11))}
            />
          </View>
          <View style={{ paddingHorizontal: 24, paddingVertical: 24, paddingBottom: Platform.OS === 'android' ? 40 : 24 }}>
            <Text className="text-sm mb-4">
              Ao continuar você concorda com nossos{" "}
              <Link inline variant="black" className="font-semibold" onPress={() => router.push('/Terms')}>Termos de Uso</Link>
              {" "}e{" "}
              <Link inline variant="black" className="font-semibold" onPress={() => router.push('/Polity')}>Política de Privacidade</Link>
              .
            </Text>
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
          onPress={handleContinue}
          icon={<ArrowRight size={18} color="white" />}
          disabled={!isValid}
        >
          Continuar
        </Button>
      </View>

      <ConfirmSmsCodeModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onVerify={() => {
          setVerified(true);
          setShowModal(false);
          setShowSuccess(true);
        }}
        onResend={() => {}}
        phoneEnding={telefone.slice(-4)}
      />
      <SucessVerificationModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onContinue={() => router.push("/(pacient)/BasicInformationFormPacient")}
      />
    </View>
  );
}