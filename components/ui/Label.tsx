import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

interface LabelProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const Label: React.FC<LabelProps> = ({ children, style }) => (
  <Text className="mb-1 text-xl font-semibold text-gray-700" style={style}>
    {children}
  </Text>
); 