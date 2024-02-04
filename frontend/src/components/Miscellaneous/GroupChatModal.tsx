import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { ReactNode } from "react";

const GroupChatModel = ({children}: {children: ReactNode}) => {
        const {isOpen, onOpen, onClose} = useDisclosure();

        return(
            <>
                <span onClick={onOpen}>{children}</span>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Modal Title</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button variant="ghost">Secondary Action</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        )
}

export default GroupChatModel;