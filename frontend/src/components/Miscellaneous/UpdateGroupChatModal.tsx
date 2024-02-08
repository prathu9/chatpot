import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChatState, User } from "../../context/ChatProvider";
import { useState } from "react";
import UserBadgeItem from "../UserBadgeItem";
import axios, { AxiosError } from "axios";
import UserListItem from "../UserListItem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UpdatedGroupChatModal = ({ fetchAgain, setFetchAgain }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [renameLoading, setRenameLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const handleAddUser = async (userToAdd: User) => {
    if(selectedChat?.users.find(u => u._id === userToAdd._id)){
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    if(selectedChat?.groupAdmin !== user?._id){
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    try {
      setLoading(true);

      const config ={
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      }

      const {data} = await axios.put("http://localhost:5000/api/chat/groupadd", {
        chatId: selectedChat?._id,
        userId: userToAdd._id
      },config);

      setLoading(false);
      setSelectedChat(data);
      setFetchAgain(true);

    } catch (error) {
      if(error instanceof AxiosError){
        toast({
          title: "Error Occured!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
      }
      setLoading(false);
    }
  }

  const handleRemove = (user: User | null) => {
    console.log(user);
  };

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.put("http://localhost:5000/api/chat/rename", {
        chatId: selectedChat?._id,
        chatName: groupChatName,
      }, config);

      setSelectedChat(data);
      setFetchAgain(true);
      setRenameLoading(false);
      toast({
        title: "Updated successfully!",
        description: "Updated group name successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error occured!",
          description: error.response?.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query: string) => {
    setSearch(query);
    if(!query){
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      }

      const {data} = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      });
      setLoading(true);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
        aria-label="Update group chat modal"
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat?.users.map((u) => (
                <UserBadgeItem
                  key={u?._id+"5"}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {
              loading? (
                <Spinner size="lg"/>
              ):(
                searchResult?.map((u) => (
                  <UserListItem 
                    key={u?._id}
                    user={u}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )
            }
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatedGroupChatModal;
