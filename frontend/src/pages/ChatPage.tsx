import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import { ChatState } from "../context/ChatProvider";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";
import { useState } from "react";

const ChatPage = () => {
    const {user} = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
      <div style={{width: "100%"}}>
        {user && <SideDrawer />}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
          {user && <MyChats />}
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
      </div>
    )
  }
  
  export default ChatPage;