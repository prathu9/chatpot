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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChatState, User } from "../../context/ChatProvider";
import { useState } from "react";
import UserBadgeItem from "../UserBadgeItem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UpdatedGroupChatModal = ({fetchAgain, setFetchAgain}: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [renameLoading, setRenameLoading] = useState(false);
  const {user, selectedChat, setSelectedChat} = ChatState();

  const toast = useToast();

  const handleRemove = (user: User | null) => {
    console.log(user);
  }

  const handleRename = () => {

  }

  const handleSearch = (value: string) => {
    console.log(value);
  }

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
          >{selectedChat?.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {
                    selectedChat?.users.map((u) => (
                        <UserBadgeItem
                            key={user?._id}
                            user={u}
                            handleFunction={() => handleRemove(u)}
                        />
                    ))
                }
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
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">Leave group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatedGroupChatModal;
