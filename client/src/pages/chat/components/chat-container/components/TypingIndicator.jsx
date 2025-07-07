import React, { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useAppStore } from '@/store';

const TypingIndicator = () => {
    const { socket } = useSocket();
    const { users } = useAppStore(); // Ambil data pengguna dari store
    const [typingUser, setTypingUser] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);

    useEffect(() => {
        const handleTyping = (data) => {
            console.log(data);
            // Menampilkan nama pengguna yang sedang mengetik
            setTypingUser(data.name); // Ganti userId dengan name

            // Hapus typing status setelah batas waktu
            if (typingTimeout) clearTimeout(typingTimeout);
            const timeout = setTimeout(() => {
                setTypingUser(null);
            }, 3000);
            setTypingTimeout(timeout);
        };

        if (socket) {
            socket.on("typing", handleTyping);
        }

        return () => {
            if (socket) {
                socket.off("typing", handleTyping);
            }
        };
    }, [socket, typingTimeout]);

    return (
        <div>
            {typingUser && <div>{typingUser} sedang mengetik...</div>} {/* Tampilkan nama pengguna dan pesan */}
        </div>
    );
};

export default TypingIndicator;