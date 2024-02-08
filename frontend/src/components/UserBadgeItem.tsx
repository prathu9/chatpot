import { Badge } from "@chakra-ui/react";
import { User } from "../context/ChatProvider";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({user, handleFunction}: {user: User, handleFunction: () => void}) => {
    return(
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            fontSize={12}
            variant="solid"
            colorScheme="purple"
            cursor="pointer"
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon p={1}/>
        </Badge>
    )
}

export default UserBadgeItem;