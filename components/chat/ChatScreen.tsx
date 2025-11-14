import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bubble, GiftedChat, IMessage, InputToolbar, MessageText } from 'react-native-gifted-chat';
import { chatConversations } from './ChatMockData';
import { formatChatMessages } from './formatChatMessages';
import { messageService } from './MessageService';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const conversation = chatConversations.find(c => c.id === id);
  const [messages, setMessages] = useState<IMessage[]>(
    conversation ? formatChatMessages([...conversation.messages].reverse()) : []
  );

  useEffect(() => {
    // Marcar mensagens da conversa como lidas quando a tela for aberta
    if (id && typeof id === 'string') {
      messageService.markConversationAsRead(id);
    }
  }, [id]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  }, []);

  if (!conversation) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Conversa não encontrada.</Text>
        <TouchableOpacity onPress={() => router.push('/conversas')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={{ marginLeft: 8 }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/conversas')} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Image source={conversation.avatar} style={styles.avatar} />
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.name}>{conversation.name}</Text>
          {conversation.verified && (
            <Ionicons name="checkmark-circle" size={18} color="#19B99A" style={{ marginLeft: 4 }} />
          )}
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="search" size={22} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#222" />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        renderBubble={props => (
          (props.currentMessage as any).type === 'status' ? null : (
            <Bubble
              {...props}
              wrapperStyle={{
                right: { backgroundColor: '#4576F2' },
                left: { backgroundColor: '#F2F2F2' },
              }}
              textStyle={{
                right: { color: '#fff' },
                left: { color: '#333' },
              }}
            />
          )
        )}
        renderMessageText={props => (
          (props.currentMessage as any).type === 'status' ? (
            <View style={{ alignItems: 'center', marginVertical: 8 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (props.currentMessage as any).color,
                borderRadius: 12,
                paddingVertical: 8,
                marginHorizontal: 16,
                marginBottom: 4,
              }}>
                <Ionicons
                  name={(props.currentMessage as any).status === 'Chamada Recebida' ? 'call' : 'call-outline'}
                  size={18}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                  {(props.currentMessage as any).status}
                </Text>
                <Text style={{ color: '#fff', marginLeft: 12, fontSize: 13 }}>
                  {new Date((props.currentMessage as any).createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ) : (
            <MessageText {...props} />
          )
        )}
        showAvatarForEveryMessage={false}
        renderAvatarOnTop={true}
        renderUsernameOnMessage={false}
        placeholder="Digite sua mensagem aqui"
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={styles.inputToolbar}
            primaryStyle={{ alignItems: 'center' }}
          />
        )}
        textInputProps={{
          style: styles.textInput,
          placeholder: 'Digite sua mensagem aqui',
          placeholderTextColor: '#A0A4AE',
        }}
        renderActions={() => (
          <TouchableOpacity style={styles.inputIcon}>
            <Ionicons name="attach" size={22} color="#222" />
          </TouchableOpacity>
        )}
        renderSend={props => (
          <TouchableOpacity
            style={styles.sendButtonFilled}
            onPress={() => {
              if (props.text && props.text.trim().length > 0 && typeof props.onSend === 'function') {
                props.onSend({ text: props.text.trim(), user: { _id: 1 } }, true);
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 32, // Ajuste para evitar sobreposição com status bar
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5EAF0',
    backgroundColor: '#fff',
    gap: 8,
  },
  headerIcon: {
    padding: 4,
    marginRight: 2,
  },
  inputToolbar: {
    borderTopWidth: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
  },
  inputIcon: {
    padding: 4,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  sendButtonFilled: {
    backgroundColor: '#4576F2',
    borderRadius: 20,
    padding: 8,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  verified: {
    fontSize: 12,
    color: '#19B99A',
    fontWeight: 'bold',
  },
});
