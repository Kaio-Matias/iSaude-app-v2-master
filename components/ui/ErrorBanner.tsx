import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform, StatusBar } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

interface ErrorBannerProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ visible, title, subtitle, onClose }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      if (onClose) {
        const timer = setTimeout(() => {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -100,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            })
          ]).start(() => {
            if (onClose) onClose();
          });
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible, onClose, opacity, translateY]);

  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

  if (!visible) return null;

  return (
    <Animated.View style={{
      backgroundColor: '#fff',      borderRadius: 0,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingTop: statusBarHeight,
      borderBottomWidth: 3,
      borderBottomColor: '#ef4444',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      opacity,
      transform: [{ translateY }],
    }}>
      <AlertCircle size={24} color="#ef4444" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#dc2626', fontWeight: 'bold', fontSize: 16 }} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
        {subtitle && <Text style={{ color: '#6b7280', fontSize: 14, marginTop: 2 }} numberOfLines={2} ellipsizeMode="tail">{subtitle}</Text>}
      </View>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={{ marginLeft: 8 }}>
          <Text style={{ fontSize: 20, color: '#222', fontWeight: 'bold' }}>×</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}; 