import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const ModalInfo: React.FC<Props> = ({
  visible,
  onClose,
  title,
  message,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <View style={S.modalBackground}>
        <View style={S.modalContent}>
          <Text style={S.title}>{title}</Text>
          <Text style={S.subtitle}>{message}</Text>
          <TouchableOpacity style={S.buttonDecline} onPress={onClose}>
            <Text style={S.buttonText}>Закрити</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const S = StyleSheet.create({
  modalBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(211, 211, 211, 0.5)',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonDecline: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#D128A1',
    alignItems: 'center',
    width: 200,
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
