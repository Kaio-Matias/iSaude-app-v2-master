import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  selfieCapturada?: boolean;
}

export default function Stepper({ currentStep, totalSteps, selfieCapturada = false }: StepperProps) {
  return (
    <View style={styles.stepperContainer}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1;
        return (
          <View key={step} style={styles.stepperItem}>
            <View style={[
              styles.stepCircle,
              currentStep === step && (step === 4 && selfieCapturada ? styles.stepCircleCompleted : styles.stepCircleActive),
              (currentStep > step || (currentStep === 4 && selfieCapturada)) && styles.stepCircleCompleted
            ]}>
              <Text style={[
                styles.stepNumber,
                currentStep === step && styles.stepNumberActive,
                (currentStep > step || (currentStep === 4 && selfieCapturada)) && styles.stepNumberCompleted
              ]}>
                {step}
              </Text>
            </View>
            {index < totalSteps - 1 && (
              <View style={[
                styles.stepLine,
                (currentStep > step || (currentStep === 4 && selfieCapturada)) && styles.stepLineCompleted
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  stepperItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  stepCircleActive: {
    backgroundColor: '#4576F2',
    borderColor: '#4576F2',
  },
  stepCircleCompleted: {
    backgroundColor: '#01AEA4',
    borderColor: '#01AEA4',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepNumberCompleted: {
    color: '#fff',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#01AEA4',
  },
});
