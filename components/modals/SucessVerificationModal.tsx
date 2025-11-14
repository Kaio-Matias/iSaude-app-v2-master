import React from "react";
import { Dimensions, Text } from 'react-native';
import { ReusableModal } from "../ui/ReusableModal";
import { Button } from "../ui/Button";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp} from "../../types/navigation";

interface SucessVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  nextScreen?: keyof RootStackParamList;
}
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SucessVerificationModal: React.FC<SucessVerificationModalProps> = ({
  visible,
  onClose,
  nextScreen = "",
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleContinue = () => {
    onClose();
    navigation.navigate(nextScreen);
  };

  return (
    <ReusableModal visible={visible} onClose={onClose}  style={{ minHeight: SCREEN_HEIGHT * 0.35}}>
      <Text className="text-2xl font-bold mb-4">Tudo Certo!</Text>
      <Text className="text-gray-500 text-lg mb-4 leading-6">
        Validamos o Código de Verificação, e suas informações de contato foram adicionadas em nossa plataforma.
      </Text>
      <Text className="text-gray-500 text-sm mb-8 leading-5">
        Fique tranquilo! Você sempre pode alterar esses dados no futuro.
      </Text>
      <Button style={{ backgroundColor: '#01AEA4' }} onPress={handleContinue}>
        Continuar Cadastro →
      </Button>
    </ReusableModal>
  );
};