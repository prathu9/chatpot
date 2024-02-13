import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { MessageType } from "../utils/types";

export type User = {
  name: string;
  email: string;
  pic: string;
  token: string;
  _id: string;
};
export type ChatType = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  groupAdmin?: User;
};

type ChatContextValueType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedChat: ChatType | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
  notifications: MessageType[];
  setNotifications: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

const ChatContext = createContext<ChatContextValueType | null>(null);

type ChatProviderProps = {
  children: ReactNode;
};

const ChatProvider = ({ children }: ChatProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [notifications, setNotifications] = useState<MessageType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser(parsedUserInfo);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = ():ChatContextValueType => {
  const chatInfo = useContext(ChatContext);
  if (chatInfo) {
    return { ...chatInfo };
  } else {
    return {
      user: null,
      setUser: () => {},
      selectedChat: null,
      setSelectedChat: () => {},
      chats: [],
      setChats: () => {},
      notifications: [],
      setNotifications: () => {} 
    };
  }
};

export default ChatProvider;
