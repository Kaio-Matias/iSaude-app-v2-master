import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, KeyboardTypeOptions, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
  iconColor?: string;
  keyboardType?: KeyboardTypeOptions;
  className?: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onFocus?: () => void;
  onBlur?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  icon,
  iconColor,
  keyboardType = 'default',
  className = '',
  style = {},
  containerStyle = {},
  onFocus,
  onBlur,
  autoCapitalize,
  autoCorrect,
}) => {
  const [show, setShow] = useState(!secureTextEntry);
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
    if (onFocus) onFocus();
  };
  const handleBlur = () => {
    setFocused(false);
    if (onBlur) onBlur();
  };

  // Generaliza: se for Text, muda cor; se for ícone Lucide (tem prop color), muda color; senão mantém padrão
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      // Se for @
      if (icon.type === Text && (icon as any).props.children === '@') {
        const iconEl = icon as React.ReactElement<{ style?: any, children?: any }>;
        return React.cloneElement(iconEl, {
          style: [iconEl.props.style, { color: focused ? '#2563eb' : '#a0aec0' }]
        });
      }
      // Se for Lucide ou outro ícone SVG com prop color
      const iconEl = icon as React.ReactElement<{ color?: string }>;
      if (iconEl.props && Object.prototype.hasOwnProperty.call(iconEl.props, 'color')) {
        return React.cloneElement(iconEl, {
          color: focused ? '#2563eb' : iconEl.props.color || '#a0aec0'
        });
      }
    }
    return icon;
  };

  return (
    <View className="mb-4" style={containerStyle}>
      {!!label && <Text className="mb-1 text-xl font-semibold text-gray-700">{label}</Text>}
      <View
        className="flex-row items-center bg-gray-100 rounded-lg px-3 h-[50px]"
        style={[
          { borderWidth: 1, borderColor: focused ? '#2563eb' : '#e5e7eb', backgroundColor: '#f3f4f6', borderRadius: 12 },
        ]}
      >
        {icon && <View className="mr-2">{renderIcon()}</View>}
        <TextInput
          className={`flex-1 text-lg text-gray-900 pt-0 pb-10 ${className}`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show && secureTextEntry}
          placeholderTextColor="#A0AEC0"
          keyboardType={keyboardType}
          style={[
            {
              height: 45,
              paddingTop: 0,
              paddingBottom: 10,
              textAlignVertical: 'center',
              backgroundColor: 'transparent',
              borderWidth: 0,
            },
            style,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShow(!show)}>
            {show ? <EyeOff size={20} color="#A0AEC0" /> : <Eye size={20} color="#A0AEC0" />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}; 