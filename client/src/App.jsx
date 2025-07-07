import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './pages/auth';  // Halaman autentikasi
import Chat from './pages/chat';  // Halaman chat
import Profile from './pages/profile';  // Halaman profil
import { useAppStore } from './store';  // Hook untuk mengakses state aplikasi
import { apiClient } from './lib/api-client';  // Klien API untuk melakukan permintaan ke server
import { GET_USER_INFO } from './utils/constants';  // URL untuk mengambil informasi pengguna

// Komponen untuk rute pribadi
const PrivateRoute = ({ children }) => {
    const { userInfo } = useAppStore();  // Mengakses informasi pengguna dari store
    const isAuthenticated = !!userInfo;  // Menentukan apakah pengguna terautentikasi
    return isAuthenticated ? children : <Navigate to="/auth" />;  // Jika tidak terautentikasi, arahkan ke halaman autentikasi
};

// Komponen untuk rute autentikasi
const AuthRoute = ({ children }) => {
    const { userInfo } = useAppStore();  // Mengakses informasi pengguna dari store
    const isAuthenticated = !!userInfo;  // Menentukan apakah pengguna terautentikasi
    return isAuthenticated ? <Navigate to="/profile" /> : children;  // Jika terautentikasi, arahkan ke halaman profil
};

// Komponen utama aplikasi
const App = () => {
    const { userInfo, setUserInfo } = useAppStore();  // Mengakses state dan setter untuk informasi pengguna
    const [loading, setLoading] = React.useState(true);  // Status loading untuk pengambilan data pengguna

    useEffect(() => {
        const getUserData = async () => {
            try {
                // Mengambil informasi pengguna dari API
                const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
                console.log('User data response:', response.data);  // Log untuk debugging
                if (response.status === 200 && response.data.id) {
                    setUserInfo(response.data);  // Set informasi pengguna di store
                } else {
                    console.warn("User ID is undefined or response status not 200");  // Log peringatan
                    setUserInfo(undefined);  // Set informasi pengguna menjadi undefined jika tidak valid
                }
            } catch (error) {
                console.error("Error fetching user data:", error);  // Log jika terjadi error
                setUserInfo(undefined);  // Set informasi pengguna menjadi undefined jika terjadi error
            } finally {
                setLoading(false);  // Set loading ke false setelah pengambilan data selesai
            }
        };

        getUserData();  // Panggil fungsi untuk mengambil data pengguna saat komponen dimuat
    }, [setUserInfo]);  // Efek ini akan dijalankan hanya ketika setUserInfo berubah

    // Jika masih loading, tampilkan indikator loading
    if (loading) {
        return <div>Loading....</div>;
    }

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/auth" element={
                        <AuthRoute>
                            <Auth />  // Halaman autentikasi
                        </AuthRoute>
                    } />
                    <Route path="/chat" element={
                        <PrivateRoute>
                            <Chat />  
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />  // Halaman profil
                        </PrivateRoute>
                    } />
                    <Route path="*" element={<Navigate to="/auth" />} />  // Arahkan rute yang tidak cocok ke halaman autentikasi
                </Routes>
            </div>
        </Router>
    );
};

export default App;