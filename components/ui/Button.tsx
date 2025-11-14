import React from 'react';
import { TouchableOpacity, Text, ViewStyle, StyleProp, View } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, onPress, style, icon, className = "w-full", variant = 'primary', disabled = false }) => {
  const bgClass = variant === 'secondary' ? 'bg-blue-400' : 'bg-blue-500';
  return (
    <TouchableOpacity
      className={`${className} ${bgClass} p-4 rounded-xl items-center flex-row justify-center`}
      style={[disabled ? { opacity: 0.5 } : {}, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text className="text-white text-xl font-semibold text-center">{children}</Text>
      {icon && <View className="ml-2 items-center justify-center">{icon}</View>}
    </TouchableOpacity>
  );
}; 