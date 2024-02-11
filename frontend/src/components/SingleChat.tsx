import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ChatState, ChatType } from "../context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSenderName, getSenderDetail } from "../utils/chatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdatedGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { MessageType } from "../utils/types";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const ENDPOINT = "http://localhost:5000";
let socket: Socket;
let selectedChatCompare: ChatType | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleChat = ({ fetchAgain, setFetchAgain }: any) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

  const toast = useToast();

  const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  }

  const fetchMessages = useCallback(async () => {
    if(!selectedChat) return;

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        }

        setLoading (true);
        const {data} = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config);

        setMessages(data);
        setLoading(false);

        socket.emit('join chat', selectedChat._id);
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: "Failed to load the Messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        });
    }
  },[selectedChat, toast, user?.token])

  useEffect(() => {
    fetchMessages();
    
    selectedChatCompare = selectedChat;
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
  },[])

  useEffect(() => {
    socket.on("message recieved", (newMessageReceived) => {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
            // give notification
        }
        else{
            setMessages([...messages, newMessageReceived]);
        }
    })
  })

  const sendMessage = async (e: KeyboardEvent<HTMLDivElement>) => {
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

            socket.emit("new message", data);
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
                  fetchMessages={fetchMessages}
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
                <ScrollableChat messages={messages}/>
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
