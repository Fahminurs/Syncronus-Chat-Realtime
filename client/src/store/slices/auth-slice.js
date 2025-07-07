// client/src/store/slices/auth-slice.js
export const createAuthSlice = (set) => ({
    userInfo: undefined,  // State awal
    setUserInfo: (userInfo) => {
        console.log("Setting User Info:", userInfo); // Log saat melakukan set
        set({ userInfo }); // Mengupdate state userInfo
    },
});