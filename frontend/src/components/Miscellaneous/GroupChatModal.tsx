import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { ChatState } from "../../context/ChatProvider";

const GroupChatModel = ({children}: {children: ReactNode}) => {
        const {isOpen, onOpen, onClose} = useDisclosure();
        const [groupChatName, setGroupChatName] = useState("");
        const [selectedUsers, setSelectedUsers] = useState([]);
        const [search, setSearch] = useState();
        const [searchResult, setSearchResult] = useState([]);
        const [loading, setLoading] = useState(false);

        const toast = useToast();

        const {user, chats, setChats} = ChatState();

        const handleSearch = (query: string) => {
            console.log(query)
        }

        const handleSubmit = () =>{}

        return(
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
                        >Create Group Chat</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody display="flex" flexDir="column" alignItems="center">
                            <FormControl>
                                <Input placeholder="Chat Name" mb={3} onChange={(e) => setGroupChatName(e.target.value)}/>
                            </FormControl>
                            <FormControl>
                                <Input
                                    placeholder="Add Users"
                                    mb={1}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </FormControl>
                            {/*render searched user */}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                                Create Chat
                            </Button>
                            <Button variant="ghost">Secondary Action</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        )
}

export default GroupChatModel;