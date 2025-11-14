import { IMessage } from 'react-native-gifted-chat';

export function formatChatMessages(messages: any[]): IMessage[] {
  return messages.map(msg => {
    if (msg.type === 'status') {
      // GiftedChat requires 'text', so we use status as text and custom props for rendering
      return {
        _id: msg._id,
        text: msg.status,
        createdAt: msg.createdAt,
        user: { _id: 0 },
        system: true,
        status: msg.status,
        color: msg.color,
        type: 'status',
      } as IMessage & { status: string; color: string; type: string };
    }
    return {
      _id: msg._id,
      text: msg.text,
      createdAt: msg.createdAt,
      user: msg.user,
    };
  });
}
