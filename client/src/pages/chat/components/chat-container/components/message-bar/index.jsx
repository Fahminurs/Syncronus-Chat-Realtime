import { useSocket } from '@/context/SocketContext';
import { useAppStore } from '@/store';
import { Content } from '@radix-ui/react-dialog';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { GrAttachment } from "react-icons/gr";
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';

const MessageBar = () => {
    const emojiRef = useRef();
    const { sendMessage, sendTypingStatus } = useSocket(); // Mengambil fungsi dari SocketContext
    const { selectedChatData, selectedChatType, userInfo } = useAppStore();
    const [message, setMessage] = useState('');
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiRef]);

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    };

    const handleSendMessage = async () => {
        if (selectedChatType === "contact") {
            sendMessage({
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            });
            setMessage(''); // Menghapus input pesan setelah mengirim
        }
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
        sendTypingStatus(true); // Memberikan tahu pengguna lain bahwa pengguna ini sedang mengetik
    };

    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input 
                    type="text" 
                    className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" 
                    placeholder="Enter Message" 
                    value={message}  
                    onChange={handleChange} // Menggunakan fungsi handleChange
                />
                <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
                    <GrAttachment className='text-2xl'/>
                </button>
                <div className="relative">
                    <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                    >
                        <RiEmojiStickerLine className='text-2xl'/>
                    </button>
                    {emojiPickerOpen && (
                        <div className="absolute bottom-16 right-0" ref={emojiRef}>
                            <EmojiPicker 
                                theme='dark' 
                                onEmojiClick={handleAddEmoji}
                                autoFocusSearch={false}
                            />
                        </div>
                    )}
                </div>
            </div>
            <button 
                className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all" 
                onClick={handleSendMessage}
            >
                <IoSend className="text-2xl" />
            </button>
        </div>
    );
};

export default MessageBar;