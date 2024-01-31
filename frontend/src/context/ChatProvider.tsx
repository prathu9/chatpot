import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {name: string,
    email: string,
    pic: string,
    token: string,
    _id: string}

type ChatContextValueType = {
   user: User | null,
   //setUser: React.Dispatch<React.SetStateAction<User | null>> 
}

const ChatContext = createContext<ChatContextValueType | null>(null);

type ChatProviderProps = {
    children: ReactNode
}

const ChatProvider = ({children}: ChatProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if(userInfo){
            const parsedUserInfo = JSON.parse(userInfo);
            setUser(parsedUserInfo);
        }
        else{
            navigate("/");
        }
    }, [navigate])
    
    return(
        <ChatContext.Provider value={{user}}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;