import ProfileInfo from "./components/profile-info";
import NewDm from "./components/new-dm";
import { GET_DM_CONTACTS_ROUTE } from "@/utils/constants";
import { apiClient } from "@/lib/api-client";
import { useEffect } from "react";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";

const ContactsContainer = () => {
    const { setDirectMessagesContacts,directMessagesContacts} = useAppStore();
    useEffect(() =>{
        const getContacts= async () =>{
            const response = await apiClient.get(GET_DM_CONTACTS_ROUTE,{
                withCredentials: true,
            });
            if(response.data.contacts){
              setDirectMessagesContacts(response.data.contacts)
            }

        }
        
        getContacts();
    })
    return (
        <div className="relative md:w-[0vw] lg:w-[25vw] xl:w-[20vw] bg-[#1b1c24] h-full border-r-2 border-[#2f303b] flex flex-col items-start">
            <div className="pt-3">
                <Logo />
            </div>
            {/* Container for Direct Messages and Channels */}
            <div className="my-5 flex flex-col w-full">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Direct Messages" />
                    <NewDm/>
                </div>
                <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden" >
                    <ContactList contacts={directMessagesContacts}  />
                    </div>   
            </div>
             {/* <div className="my-5 flex flex-col w-full">
                <div className="flex items-center justify-between pr-10 mt-3">
                    <Title text="Channels" />
                </div>
                </div> */}
            <ProfileInfo/>
        </div>
    );
};

const Logo = () => {
    return (
        <div className="flex p-5 justify-start items-center gap-2">
            <svg
                id="logo-38"
                width="78"
                height="32"
                viewBox="0 0 78 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
                    className="ccustom"
                    fill="#8338ec"
                ></path>
                <path
                    d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
                    className="ccompli1"
                    fill="#975aed"
                ></path>
                <path
                    d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
                    className="ccompli2"
                    fill="#a16ee8"
                ></path>
            </svg>
            <span className="text-3xl font-semibold ">Syncronus</span>
        </div>
    );
};

const Title = ({ text }) => {
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">{text}</h6>
    );
};

export default ContactsContainer;