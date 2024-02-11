import { User } from "../context/ChatProvider";
import { MessageType } from "./types";

export const getSenderName = (loggedUser: User | null, users: User[]) => {
    if (!loggedUser) {
        return "Unknown";
    }
    return users.filter((user) => loggedUser._id !== user._id)[0].name;
}

export const getSenderDetail = (loggedUser: User | null, users: User[]) => {
    if (!loggedUser) {
        return null;
    }
    return users.filter((user) => loggedUser._id !== user._id)[0];
}

export const isSameSender = (messages: MessageType[], currentMessage: MessageType, index: number, userId: string) => {
    return (
        index < messages.length - 1 &&
        (messages[index + 1].sender._id !== currentMessage.sender._id ||
        messages[index + 1].sender._id === undefined) &&
        messages[index].sender._id !== userId
    );
}

export const isLastMessage = (messages: MessageType[], index: number, userId: string) => {
    return (
        index === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
}

export const isSameSenderMargin = (messages: MessageType[], currentMessage: MessageType, index: number, userId: string) => {
    if (
        index < messages.length - 1 &&
        messages[index + 1].sender._id === currentMessage.sender._id &&
        messages[index].sender._id !== userId
    ) {
        return 33;
    }
    else if (
        (index < messages.length - 1 &&
            messages[index + 1].sender._id !== currentMessage.sender._id &&
            messages[index].sender._id !== userId) ||
        (
            index === messages.length - 1 && messages[index].sender._id !== userId
        )
    ) {
        return 0;
    }
    else {
        return 'auto';
    }
}

export const isSameUser = (messages: MessageType[], currentMessage: MessageType, index: number) => {
    return index > 0 && messages[index - 1].sender._id === currentMessage.sender._id
}