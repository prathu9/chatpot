import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { ChatState, User } from "../../context/ChatProvider";
import axios, { AxiosError } from "axios";
import UserListItem from "../UserListItem";
import UserBadgeItem from "../UserBadgeItem";

const GroupChatModel = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  if (!user) {
    return <h1>User not available</h1>;
  }

  const handleSearch = async (query: string) => {
    setSearch(query);

    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if(!groupChatName || !selectedUsers){
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      return;
    }

    try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

        const {data} = await axios.post("http://localhost:5000/api/chat/group", {
          chatName: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id))
        }, config);

        setChats([data, ...chats]);
        onClose();
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
    } catch (error) {
      if(error instanceof AxiosError){
        toast({
          title: "Failed to Create the Chat!",
          description: error.response?.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
      }
      else{
        console.log(error);
        toast({
          title: "Error occured",
          description: `Some error occured while add group`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
      }
    }
  };

  const handleGroup = (userToAdd: User) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser: User) => {
    setSelectedUsers(selectedUsers.filter(sel => delUser._id !== sel._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult
                .slice(0, 4)
                .map((user: User) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
