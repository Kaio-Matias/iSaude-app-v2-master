import React from "react";
import { View, Text } from "react-native";
import { Check } from "lucide-react-native";

interface StepperProps {
  totalSteps: number;
  currentStep: number; // começa em 1
}

const Stepper: React.FC<StepperProps> = ({ totalSteps, currentStep }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 40,
        alignSelf: 'center',
      }}
    >
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const step = idx + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        const isFuture = step > currentStep;
        return (
          <React.Fragment key={step}>
            {idx > 0 && (
              <View
                style={{
                  flex: 1,
                  width: 24,
                  height: 2,
                  backgroundColor: isCompleted ? '#01AEA4' : isActive ? '#4576F2' : '#E5E7EB',
                  alignSelf: 'center',
                  marginHorizontal: 2,
                }}
              />
            )}
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isCompleted ? '#01AEA4' : isActive ? '#4576F2' : '#E5E7EB',
                borderWidth: 2,
                borderColor: isCompleted ? '#01AEA4' : isActive ? '#4576F2' : '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isCompleted ? (
                <Check size={16} color="#fff" strokeWidth={3} />
              ) : (
                <Text style={{ color: isActive ? '#fff' : '#A0AEC0', fontWeight: 'bold', fontSize: 14 }}>{step}</Text>
              )}
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default Stepper; 