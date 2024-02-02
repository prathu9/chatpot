import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

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
};

type ChatContextValueType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedChat: ChatType | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
};

const ChatContext = createContext<ChatContextValueType | null>(null);

type ChatProviderProps = {
  children: ReactNode;
};

const ChatProvider = ({ children }: ChatProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
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
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const chatInfo = useContext(ChatContext);
  if (chatInfo) {
    return { ...chatInfo };
  } else {
    return {
      user: null,
      setUser: null,
      selectedChat: null,
      setSelectedChat: null,
      chats: [],
      setChats: null
    };
  }
};

export default ChatProvider;
