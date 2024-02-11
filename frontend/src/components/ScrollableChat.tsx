import ScrollableFeed from "react-scrollable-feed";
import { MessageType } from "../utils/types";
import { ChatState } from "../context/ChatProvider";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../utils/chatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";

type ScrollableChatProps = {
    messages: MessageType[]
}

const ScrollableChat = ({messages}: ScrollableChatProps) => {
    const {user} = ChatState();

    if(!user){
        return <h1>User not found</h1>
    }

    return(
        <ScrollableFeed>
            {messages && messages.map((currentMessage, index) => (
                <div style={{display: "flex"}} key={currentMessage._id}>
                     {
                        (isSameSender(messages, currentMessage, index, user._id)
                        ||
                        isLastMessage(messages, index, user?._id))
                        && 
                        <Tooltip label={currentMessage.sender.name}
                                  placement="bottom-start"
                                  hasArrow
                        >
                            <Avatar 
                                mt="7px"
                                mr={1}
                                size="sm"
                                cursor="pointer"
                                name={currentMessage.sender.name}
                                src={currentMessage.sender.pic}
                            />
                        </Tooltip>
                     }
                     <span style={{
                        backgroundColor: `${
                            currentMessage.sender._id === user._id ? "#BEE3F8":"#89F5D0"
                        }`,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                        marginLeft: isSameSenderMargin(messages, currentMessage, index, user?._id),
                        marginTop: isSameUser(messages, currentMessage, index)? 3:10
                     }}>
                        {currentMessage.content}
                     </span>
                </div>
            ))}
        </ScrollableFeed>
    );
}

export default ScrollableChat;