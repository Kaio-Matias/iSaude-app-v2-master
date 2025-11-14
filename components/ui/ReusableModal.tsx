import React from 'react';
import { Modal, View, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';

interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties | any;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ReusableModal: React.FC<ReusableModalProps> = ({ visible, onClose, title, children, className, style }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <TouchableWithoutFeedback onPress={() => { }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%' }}
          >
            <View
              className={`bg-white rounded-t-[24px] p-7 w-full ${className || ''}`}
              style={{
                minHeight: SCREEN_HEIGHT * 0.5,
                maxHeight: SCREEN_HEIGHT * 0.7,
                alignSelf: 'center',
                width: '100%',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingBottom: 32,
                ...(style || {})
              }}
            >
              {title && <Text className="text-lg font-bold mb-4 text-center">{title}</Text>}
              {children}
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
); 