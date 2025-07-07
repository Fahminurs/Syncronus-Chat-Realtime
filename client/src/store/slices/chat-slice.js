export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts:[],
    typingStatus: { typing: false, userId: null },  // Tambahkan state typingStatus

    setSelectedChatType: (type) => set({ selectedChatType: type }),
    setSelectedChatData: (data) => set({ selectedChatData: data }),
    setSelectedChatMessages: (messages) => set({ selectedChatMessages: messages }),
    setDirectMessagesContacts : (directMessagesContacts)=> set({directMessagesContacts}),
    closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: [] }),
    
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;

        set({
            selectedChatMessages: [
                ...selectedChatMessages, {
                    ...message,
                    recipient: selectedChatType === "channel" ? message.recipient : message.recipient._id,
                    sender: selectedChatType === "channel" ? message.sender : message.sender._id,
                }
            ],
        });
    },

    setTypingStatus: (data) => set({ typingStatus: data }),  // Action untuk memperbarui typingStatus
});