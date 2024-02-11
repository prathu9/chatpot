import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ChatState, ChatType } from "../context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSenderName, getSenderDetail } from "../utils/chatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdatedGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import { ChangeEvent,useState } from "react";
import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleChat = ({ fetchAgain, setFetchAgain }: any) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState<ChatType[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const toast = useToast();

  const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  }

 

  const sendMessage = async (e: KeyboardEvent) => {
    if(e.key === "Enter" && newMessage){
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`
                }
            };

            setNewMessage("");
            const {data} = await axios.post("http://localhost:5000/api/message", {
                chatId: selectedChat?._id,
                content: newMessage
            }, config)

            
            setMessages([...messages, data]);
        } catch (error) {   
            toast({
                title: "Error Occured!",
                description: "Failed to send the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    }
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
              aria-label="back button"
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderDetail(user, selectedChat.users)!}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdatedGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
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
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div>

              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message.."
                    onChange={typingHandler}
                    value={newMessage}
                />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
