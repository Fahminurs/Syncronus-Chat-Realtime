import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";
import { getColor } from "@/lib/utils"; // Ensure getColor is imported if needed

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData?.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${
                    getColor(selectedChatData?.color) || "bg-gray-500"
                  }`}
                >
                  {selectedChatData ? (
                    selectedChatData.firstName
                      ? selectedChatData.firstName.charAt(0)
                      : selectedChatData.email.charAt(0)
                  ) : (
                    "?" // Placeholder symbol if no data
                  )}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {
              selectedChatType === "contact" && selectedChatData ?
              // Use email if both firstName and lastName are not available
              `${selectedChatData.firstName || ''} ${selectedChatData.lastName || ''}`.trim() || selectedChatData.email :
              selectedChatData?.email || "No email"
            }
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;