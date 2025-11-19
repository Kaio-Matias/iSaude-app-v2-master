import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Calendar } from "lucide-react-native";

interface DateInputProps {
  label: string;
  value: string;
  onChange?: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
  const handleWebChange = (event: any) => {
    const date = event.target.value; // YYYY-MM-DD
    if (onChange) {
      // Convert YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = date.split('-');
      onChange(`${day}/${month}/${year}`);
    }
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD for HTML input value
  const formattedValue = value ? value.split('/').reverse().join('-') : '';

  return (
    <View style={{ marginBottom: 24 }}>
      <Text className="font-semibold text-base mb-2" style={{ color: "#1A202C" }}>{label}</Text>
      <View
        className="flex-row items-center rounded-xl px-4 py-3"
        style={{
          backgroundColor: "#F7FAFC",
          borderWidth: 1,
          borderColor: "#E2E8F0",
        }}
      >
        <Calendar size={18} color="#4A5568" />
        {/* Using a standard HTML input type="date" for web */}
        <TextInput
          style={{ flex: 1, marginLeft: 8, fontSize: 16, color: value ? "#2D3748" : "#A0AEC0" }}
          value={formattedValue}
          onChange={handleWebChange}
          placeholder="Selecione uma data"
          // @ts-ignore - type="date" is a web-specific prop for TextInput
          type="date"
        />
      </View>
    </View>
  );
};

export default DateInput;
