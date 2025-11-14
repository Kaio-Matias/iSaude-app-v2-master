import { Stack } from 'expo-router';

// Este layout define o grupo de rotas como um Stack Navigator
// e esconde o cabeçalho (header) por defeito para todos os ecrãs dentro dele.
export default function Layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}