export class ChatMessageDtoModel {
  id: number | undefined
  chatId: string | undefined
  senderId: number | undefined
  recipientId: number | undefined
  content: string | undefined
  timestamp: string | undefined
  isRead: boolean | undefined
}
