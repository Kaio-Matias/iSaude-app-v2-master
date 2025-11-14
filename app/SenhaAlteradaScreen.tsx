import React from "react";
import { View, Text, Image } from "react-native";
import { Button } from "../components/ui/Button";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SenhaAlteradaScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-white px-6 pb-10">
      <View className="flex-1 ">
        <Image
          source={require("../assets/images/PasswordSucess.png")}
          style={{ width: '100%', height: '60%', resizeMode: 'contain' }}
        />
        <Text className="text-2xl font-bold mt-2 mb-1">
          Senha alterada com Sucesso!
        </Text>
        <Text className="text-base text-gray-500">
          Com a sua ajuda, tornamos nossa comunidade cada vez mais segura e acolhedora para todos.
        </Text>
      </View>
      <Button
        onPress={() => navigation.navigate('Home' as never)}
        className="bg-blue-500 w-full mt-8"
        style={{ marginBottom: insets.bottom + 16 }}
      >
        Voltar para o Login
      </Button>
    </View>
  );
};

export default SenhaAlteradaScreen; 