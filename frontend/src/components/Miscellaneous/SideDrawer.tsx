import { Box, Tooltip, Button, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react";
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons";
// import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModel";

const SideDrawer = () => {
//   const [search, setSearch] = useState();
//   const [searchResult, setSearchResult] = useState();
//   const [loading, setLoading] = useState();
//   const [loadingChat, setLoadingChat] = useState();

  const {user} = ChatState();

  if(!user){
    return <h1>User not available</h1>
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost">
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4px">
              Search
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">ChatPot</Text>
        
        <div>
            <Menu>
                <MenuButton p={1}>
                    <BellIcon fontSize="2xl" m={1}/>
                </MenuButton>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>
                        <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider/>
                    <MenuItem>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
      </Box>
    </>
  );
};

export default SideDrawer;
