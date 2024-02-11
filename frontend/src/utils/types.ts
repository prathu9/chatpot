import { ChatType, User } from "../context/ChatProvider";


export type MessageType = {
    chat: ChatType,
    content: string,
    sender: User,
    _id: string
}