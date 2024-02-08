import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ChatState, ChatType, User } from "../context/ChatProvider";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSenderName } from "../utils/chatLogics";
import GroupChatModel from "./Miscellaneous/GroupChatModal";
//{fetchAgain}:{fetchAgain:boolean}
function MyChats() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Ocurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }, [toast, setChats, user?.token]);

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo") || ""));
    fetchChats();
  }, [fetchChats, setLoggedUser]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModel>
          <Button
            display="flex"
            fontSize={{ base: "18px", md: "10px", lg: "18px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack>
            {chats.map((chat: ChatType) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSenderName(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;
