// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css'; // 引入 CSS 樣式檔案

function Navbar() {
  const location = useLocation(); // 取得目前路徑

  const navLinks = [
    { name: '首頁', path: '/' },
    { name: '探索旅遊風格', path: '/explore' },
    { name: '我的行程', path: '/my-trip' },
    { name: '關於我們', path: '/about' },
    { name: '常見問題', path: '/faq' },
    { name: '登入', path: '/login' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">Élan Journeys</div>
      <ul className="navbar-links">
        {navLinks.map((link) => (
          <li key={link.path} className={location.pathname === link.path ? 'active' : ''}>
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;

