// src/components/Layout.jsx
// src/components/Layout.jsx
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { Outlet } from 'react-router-dom';
import '../styles/Layout.css'; // ✅ 匯入 main-content 樣式

function Layout() {
  return (
    <>
      <ScrollToTop /> {/* 切換路由時自動捲到頂 */}
      <Navbar />
      <main className="main-content">
        <Outlet /> {/* 這裡會被子頁面內容取代 */}
      </main>
      <Footer />
    </>
  );
}

export default Layout;



