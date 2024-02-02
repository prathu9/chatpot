import { User } from "../context/ChatProvider";

export const getSenderName = (loggedUser: User | null, users: User[]) => {
    if(!loggedUser){
        return "Unknown";
    }
    return users.filter((user) => loggedUser._id !== user._id)[0].name;
}
