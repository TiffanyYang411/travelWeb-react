import Navbar from './Navbar';
import Footer from './Footer';
// Outlet 是 React Router 提供的組件，代表「這裡會塞入子頁面內容」
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <>
            <Navbar />
            <main style={{ padding: '2rem', minHeight: '80vh' }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default Layout;
