import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const ContactList = ({ contacts, isChannel = false }) => {
    const {
        selectedChatData,
        setSelectedChatData,
        setSelectedChatType,
        selectedChatType,
    } = useAppStore();
const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    
    setSelectedChatData(contact);
    
    if (selectedChatData && selectedChatData._id !== contact._id) {
        setSelectedChatMessages([]);
    }
};
    return (
      <div className="mt-5">
    {contacts.map((contact) => (
        <div
            key={contact._id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
                selectedChatData && selectedChatData._id === contact._id
                    ? "bg-[#8417ff] hover:bg-[#8417ff]"
                    : "hover:bg-[#f1f1f1]"
            }`}
            onClick={() => handleClick(contact)}
        >
            <div className="flex gap-5 items-center justify-start text-neutral-300">
                {!isChannel && (
            <Avatar className="h-10 w-10 rounded-full overflow-hidden">
              {contact.image ? (
                <AvatarImage
                  src={`${HOST}/${contact.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
             
                  className={`
                       ${
                  selectedChatData && selectedChatData._id === contact._id? "bg-[ffffff22] border border-white/50"
                    : getColor(contact.color) || "bg-gray-500"
                }
                    uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full `}
                >
                  {contact ? (
                    contact.firstName
                      ? contact.firstName.charAt(0)
                      : contact.email.charAt(0)
                  ) : (
                    "?" // Placeholder symbol if no data
                  )}
                </div>
              )}
            </Avatar>
                )}
{isChannel ? (
    <span>{"contact.name"}</span>
) : (
    <span>{`${contact.firstName} ${contact.lastName}`}</span>
)}
            </div>
        </div>
    ))}
</div>
    );
};

export default ContactList;