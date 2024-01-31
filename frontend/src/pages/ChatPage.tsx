import axios from "axios";
import {useEffect, useState} from "react";

type ChatType = {
  _id: string,
  chatName: string
}

const ChatPage = () => {
    const [chats, setChats] = useState<ChatType[]>([]);

    const fetchChats = async () => {
        const {data} = await axios.get("http://localhost:5000/api/chats");
        
        setChats(data);
    }

    useEffect(() => {
        fetchChats();
    }, [])

    return (
      <div>
        {
            chats.map(chat => (
                <h1 key={chat._id}>{chat.chatName}</h1>
            ))
        }
      </div>
    )
  }
  
  export default ChatPage;