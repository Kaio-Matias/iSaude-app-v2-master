import { SafeHeaderStyles } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Stepper from "../../components/Stepper";
import { Step1, Step2, Step3, Step4 } from "../../components/validation-steps";
export default function ValidacaoDocumentos() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selfieCapturada, setSelfieCapturada] = useState(false);
  const totalSteps = 4;
  // Removed unused height from useWindowDimensions after refactor
  const insets = useSafeAreaInsets();

  function nextStep() {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  }
  function startValidation() {
    setCurrentStep(1);
  }

  function handleFinish() {
    setCurrentStep(0);
    router.push("/(tabs)/home");
  }

  function renderCurrentStep() {
    switch (currentStep) {
      case 0:
        return (
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 24, paddingTop: 20 }}
              style={{ flex: 1, }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.introContainer}>
                <Text style={styles.introTitle}>Verificação de Documentos</Text>
                <Text style={styles.introDescription}>
                  Para garantir a segurança dos pacientes e a validade jurídica
                  dos seus documentos, precisamos confirmar sua identidade e
                  registro profissional.{"\n\n"}É rápido e seguro: seus dados
                  são criptografados e auditados conforme a Lei Geral de
                  Proteção de Dados.
                </Text>
                <Text style={styles.sectionHeading}>Do que precisamos?</Text>
                <View style={styles.requirementList}>
                  {  reqs.map((r) => (
                    <View style={styles.requirementItem} key={r.num}>
                      <View style={styles.requirementNumber}>
                        <Text style={styles.requirementNumberText}>{r.num}</Text>
                      </View>
                      <View style={styles.requirementTexts}>
                        <Text style={styles.requirementTitle}>{r.title}</Text>
                        <Text style={styles.requirementSubtitle}>{r.subtitle}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <Text style={styles.readyText}>Pronto? Vamos lá!</Text>
              </View>
            </ScrollView>
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
              <TouchableOpacity style={styles.primaryButton} onPress={startValidation}>
                <Text style={styles.primaryButtonText}>Iniciar Verificação</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
                <Text style={styles.secondaryButtonText}>Pular por enquanto!</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 1:
        return <Step1 onNext={nextStep} />;
      case 2:
        return <Step2 onNext={nextStep} />;
      case 3:
        return <Step3 onNext={nextStep} />;
      case 4:
        return <Step4 onFinish={handleFinish} onSelfieCapture={() => setSelfieCapturada(true)} />;
      default:
        return null;
    }
  }

  if (currentStep === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil Profissional</Text>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle-outline" size={24} color="black" />
          </View>
        </View>
        <View style={{ flex: 1 }}>{renderCurrentStep()}</View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verificação de Documentos</Text>
        <View style={styles.infoIcon}>
          <Ionicons name="information-circle-outline" size={24} color="black" />
        </View>
      </View>
      <View style={styles.stepperWrapper}>
        <Stepper currentStep={currentStep} totalSteps={totalSteps} selfieCapturada={selfieCapturada} />
      </View>
      <View style={{ flex: 1 }}>
        {renderCurrentStep()}
      </View>
    </View>
  );
}

const reqs = [
  {
    num: 1,
    title: "Documento Oficial com Foto",
    subtitle: "RG, CNH ou Passaporte válidos e legíveis.",
  },
  {
    num: 2,
    title: "Carteira profissional válida",
    subtitle: "CRM, COREN, CRP, etc. Válido",
  },
  {
    num: 3,
    title: "Registro de Qualificação de Especialista",
    subtitle: "RQE válido, emitido pelo Conselho Regional da sua área",
  },
  {
    num: 4,
    title: "Selfie",
    subtitle: "Uma foto do seu rosto bem iluminada e sem acessórios.",
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFF1F5" },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
    ...SafeHeaderStyles.regularHeader,
    paddingTop: 60, // Extra padding for this specific screen
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333", },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: { color: "#666", fontSize: 14, fontWeight: "bold" },
  introContainer: { paddingHorizontal: 20, },
  stepperWrapper: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: "#EFF1F5",
  },
  introTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  requirementList: { marginBottom: 16 },
  requirementItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "400",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4576F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  requirementNumberText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  requirementTexts: { flex: 1 },
  requirementTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  requirementSubtitle: { fontSize: 10, color: "#666", lineHeight: 16, fontWeight: "400" },
  readyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: "#3366FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  startButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  skipLink: { alignItems: "center", paddingVertical: 30 },
  skipLinkText: {
    color: "#3366FF",
    fontSize: 13,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  primaryButton: {
    backgroundColor: '#4A7FFB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4A7FFB',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
