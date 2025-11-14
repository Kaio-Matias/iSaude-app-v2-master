import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, Text, Image, Animated } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

import EditScreenInfo from '@/components/EditScreenInfo';

const DOTS = 4;
const DOT_COLORS = [
  "#FFF",
  "#FFF",
  "#FFF",
  "#FFF"
];
const DOT_SIZE = 14;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const anims = Array.from({ length: DOTS }).map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Home" as never);
    }, 2000);
    anims.forEach((anim, i) => {
      const animate = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      setTimeout(animate, i * 160);
    });
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-[#4576F2] justify-center items-center">
      <Image
        source={require("../assets/images/logo-text.png")}
        style={{ width: '50%', height: 120 }}
        resizeMode="contain"
      />
      <View style={{ flexDirection: "row", width: 100, height: 5, justifyContent: "center", alignItems: "center"}}>
        {anims.map((anim, i) => (
          <Animated.View
            key={i}
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              backgroundColor: DOT_COLORS[i],
              marginHorizontal: 3,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-4, 4],
                  }),
                },
              ],
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default SplashScreen; 