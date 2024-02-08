import { Box } from "@chakra-ui/react"
// import { Dispatch, SetStateAction } from "react"
import { ChatState } from "../context/ChatProvider"
import SingleChat from "./SingleChat"

// type ChatBoxPropType = {
//   fetchAgain: boolean,
//   setFetchAgain: Dispatch<SetStateAction<boolean>>
// }
//{fetchAgain, setFetchAgain}: ChatBoxPropType
function ChatBox() {
 
  const {selectedChat} = ChatState();
  return (
    <Box
      display={{base: selectedChat? "flex":"none", md:"flex"}}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{base: "100%", md: "68%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat />
    </Box>
  )
}

export default ChatBox