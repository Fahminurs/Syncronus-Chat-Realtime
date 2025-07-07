// Import necessary dependencies and components
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const NewDm = () => {
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]); // Correctly defined state

    // Destructure the store
    const {
        setSelectedChatType,
        setSelectedChatData
    } = useAppStore(); // Use correct casing

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTE,
                    { searchTerm },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts);
                }
            } else {
                setSearchedContacts([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType("contact"); // Ensure this correctly references the store function
        setSelectedChatData(contact);
        setSearchedContacts([]);
    };

    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus
                        className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300 ease-in-out"
                        onClick={() => setOpenNewContactModal(true)}
                    />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                    Select New contact
                </TooltipContent>
            </Tooltip>

            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search for a contact"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={e => searchContacts(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-[250px]">
                        <div className="flex flex-col gap-5">
                            {searchedContacts.map((contact) => (
                                <div
                                    key={contact._id}
                                    className="flex gap-3 items-center cursor-pointer"
                                    onClick={() => selectNewContact(contact)}
                                >
                                    <div className="w-12 h-12 relative">
                                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                            {contact.image ? (
                                                <AvatarImage
                                                    src={`${HOST}/${contact.image}`} // Changed from process.env.HOST
                                                    alt="profile"
                                                    className="object-cover w-full h-full bg-black"
                                                />
                                            ) : (
                                                <div
                                                    className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}
                                                >
                                                    {contact.firstName
                                                        ? contact.firstName.split("").shift()
                                                        : contact.email.split("").shift()}
                                                </div>
                                            )}
                                        </Avatar>
                                    </div>
                                    <div className="flex flex-col">
                                        <span>
                                            {contact.firstName && contact.lastName
                                                ? `${contact.firstName} ${contact.lastName}`
                                                : contact.email}
                                        </span>
                                        <span className="text-xs">{contact.email}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    {searchedContacts.length === 0 && (
                        <div className="md:flex-1 md:flex md:flex-col mt-5 justify-center items-center">
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={100}
                                width={100}
                                options={animationDefaultOptions}
                            />
                            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-xl text-center">
                                <h3 className="poppins-medium">
                                    Search new 
                                    <span className="text-purple-500"> contact.</span> 
                                </h3>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NewDm;