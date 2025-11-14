import React from 'react';
import { Text, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';

interface LinkProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'muted' | 'black';
  inline?: boolean;
}

export const Link: React.FC<LinkProps> = ({ children, onPress, style, icon, className = '', variant = 'primary', inline = false }) => {
  let textClass = 'text-blue-500';
  if (variant === 'muted') textClass = 'text-gray-400';
  if (variant === 'black') textClass = 'text-black';

  if (inline) {
    return (
      <Text onPress={onPress} style={style} className={`underline ${textClass} text-base ${className}`}>{children}</Text>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={style} className="flex-row items-center">
      <Text className={`underline ${textClass} text-base ${className}`}>{children}</Text>
      {icon && icon}
    </TouchableOpacity>
  );
}; 