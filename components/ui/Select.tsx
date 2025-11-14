import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { ChevronRight } from "lucide-react-native";

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ label, value, options, onSelect }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 24 }}>
      <Text className="font-semibold text-base mb-2">{label}</Text>
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-100 rounded-xl px-4 py-3"
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text className="text-base text-gray-700">{value}</Text>
        <ChevronRight size={20} color="#A0AEC0" />
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            activeOpacity={1}
            onPress={() => setVisible(false)}
          />
          <View style={{ width: '90%', backgroundColor: "#fff", borderRadius: 16, paddingVertical: 0, paddingHorizontal: 0, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <ScrollView style={{ maxHeight: 300 }}>
              {options.map((opt, idx) => (
                <TouchableOpacity
                  key={opt}
                  className={`px-4 py-3 ${opt === value ? 'bg-blue-100' : ''}`}
                  onPress={() => {
                    onSelect(opt);
                    setVisible(false);
                  }}
                  style={{
                    borderTopLeftRadius: idx === 0 ? 16 : 0,
                    borderTopRightRadius: idx === 0 ? 16 : 0,
                    borderBottomLeftRadius: idx === options.length - 1 ? 16 : 0,
                    borderBottomRightRadius: idx === options.length - 1 ? 16 : 0,
                    borderBottomWidth: idx === options.length - 1 ? 0 : 1,
                    borderBottomColor: '#F1F1F1',
                  }}
                >
                  <Text className={`text-base ${opt === value ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Select; 