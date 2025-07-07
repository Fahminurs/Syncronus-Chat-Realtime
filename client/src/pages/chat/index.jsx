import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
    const { userInfo, selectedChatType } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo || !userInfo.profileSetup) {
            toast("Please setup profile to continue.");
            navigate("/profile");
        }
    }, [userInfo, navigate]);

    return (
        <div className="flex h-[100vh] text-white overflow-hidden">
            <ContactsContainer />
            {
                selectedChatType===undefined ?<div className="flex-1 flex md:flex-col border-l-2 border-[#2f303b]">
                <EmptyChatContainer />
            </div>:<ChatContainer/>
            }

        </div>
    );
};

export default Chat;



