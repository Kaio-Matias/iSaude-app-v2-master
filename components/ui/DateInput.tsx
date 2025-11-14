import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Appearance } from "react-native";
import { Calendar } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface DateInputProps {
  label: string;
  value: string;
  onChange?: (date: string) => void;
}

// Função para converter string dd/MM/yyyy para Date
function stringToDate(str: string): Date {
  if (!str) return new Date();
  const [day, month, year] = str.split('/');
  if (!day || !month || !year) return new Date();
  return new Date(Number(year), Number(month) - 1, Number(day));
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);

  const handleConfirm = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    if (onChange) onChange(`${day}/${month}/${year}`);
    setShow(false);
  };

  // Detecta o tema do sistema operacional
  const colorScheme = Appearance.getColorScheme();

  return (
    <View style={{ marginBottom: 24 }}>
      <Text className="font-semibold text-base mb-2" style={{ color: "#1A202C" }}>{label}</Text>
      <TouchableOpacity
        className="flex-row items-center rounded-xl px-4 py-3"
        onPress={() => setShow(true)}
        activeOpacity={0.8}
        style={{
          opacity: 1,
          backgroundColor: "#F7FAFC",
          borderWidth: 1,
          borderColor: "#E2E8F0",
        }}
      >
        <Calendar size={18} color="#4A5568" />
        <Text
          className="ml-2 text-base"
          style={{
            color: value ? "#2D3748" : "#A0AEC0",
          }}
        >
          {value || "Selecione uma data"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={show}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setShow(false)}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        themeVariant={colorScheme === "dark" ? "dark" : "light"}
        locale="pt-BR"
        date={value ? stringToDate(value) : new Date()}
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
      />
    </View>
  );
};

export default DateInput; 