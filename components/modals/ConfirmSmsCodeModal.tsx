import React, { useRef, useState } from "react";
import { View, Text, TextInput,TouchableOpacity, Dimensions } from 'react-native';
import { ReusableModal } from "../ui/ReusableModal";
import { Button } from "../ui/Button";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "../../types/navigation";
import { AlertCircle } from "lucide-react-native";
import { ErrorBanner } from "../ui/ErrorBanner";

interface ConfirmSmsCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
  phoneEnding: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ConfirmSmsCodeModal: React.FC<ConfirmSmsCodeModalProps> = ({
  visible,
  onClose,
  onVerify,
  onResend,
  phoneEnding,
}) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);
  const navigation = useNavigation<NavigationProp>();

  const handleChange = (text: string, idx: number) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[idx] = text;
      setCode(newCode);
      setError(false);
      if (text && idx < 5) {
        inputs.current[idx + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    // Simulação de erro
    setError(false);
    onVerify(code.join("222222"));
  };

  const filled = code.every((c) => c.length === 1);

  return (
    <ReusableModal visible={visible} onClose={onClose} style={{ minHeight: SCREEN_HEIGHT * 0.4 }}>
      <ErrorBanner
        visible={error}
        title="Ops... esse código não está certo."
        subtitle="Verifique o código e tente novamente."
        onClose={() => setError(false)}
      />
      <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, marginHorizontal: -24, marginBottom: -24 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Esqueceu sua Senha?</Text>
        <Text style={{ fontSize: 15, color: '#6B7280', marginBottom: 8 }}>
          Enviamos um código de recuperação para o número com final <Text style={{ fontWeight: 'bold', color: '#222' }}>{phoneEnding}</Text>.
        </Text>
        <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
          Não recebeu? Tente reenviar o Código.
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
          {code.map((value, idx) => (
            <TextInput
              key={idx}
              ref={(ref) => {
                inputs.current[idx] = ref;
              }}
              value={value}
              onChangeText={text => handleChange(text, idx)}
              onKeyPress={e => handleKeyPress(e, idx)}
              maxLength={1}
              keyboardType="number-pad"
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: error ? '#dc2626' : value ? '#2563eb' : '#e5e7eb',
                backgroundColor: error ? '#fef2f2' : value ? '#f1f5f9' : '#f9fafb',
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 'bold',
                color: error ? '#dc2626' : '#222',
                marginHorizontal: 4,
              }}
              autoFocus={idx === 0}
            />
          ))}
        </View>
        <Button onPress={handleVerify} disabled={!filled} style={{ backgroundColor: filled ? '#2563eb' : '#e5e7eb' }}>
          <Text style={{ color: filled ? '#fff' : '#9ca3af', fontWeight: 'bold', fontSize: 16 }}>Verificar</Text>
        </Button>
        <TouchableOpacity onPress={onResend} style={{ marginTop: 18, marginBottom: 0 }}>
          <Text style={{ color: '#2563eb', textAlign: 'center', textDecorationLine: 'underline', fontWeight: '500' }}>Reenviar Código</Text>
        </TouchableOpacity>
      </View>
    </ReusableModal>
  );
}; 