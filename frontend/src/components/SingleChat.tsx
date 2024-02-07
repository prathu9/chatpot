import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSenderName, getSenderDetail } from "../utils/chatLogics";
import ProfileModal from "./Miscellaneous/ProfileModel";
import UpdatedGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleChat = ({fetchAgain, setFetchAgain}: any) => {
    const {user, selectedChat, setSelectedChat} = ChatState();
    
    return(
        <>
           {selectedChat ? 
            <>
                <Text
                    fontSize={{base: "28px", md: "30px"}}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{base: "space-between"}}
                    alignItems="center"
                >
                    <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat(null)} 
                            aria-label="back button"                    
                    />
                    {
                        !selectedChat.isGroupChat ? (
                            <>
                                {getSenderName(user, selectedChat.users)}
                                <ProfileModal user={getSenderDetail(user, selectedChat.users)!} />
                            </>
                        ):(
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdatedGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />
                            </>
                        )
                    }
                </Text>
                <Box
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#e8e8e8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                >
                    {/*Message here */}
                </Box>
            </>:
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
            </Box>}
        </>
    )
}

export default SingleChat;