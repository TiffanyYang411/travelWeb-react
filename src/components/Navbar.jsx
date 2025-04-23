// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css'; // 引入 CSS 樣式檔案
import cartIcon from '../images/cart-icon-logout.svg';
import userIcon from '../images/user-icon.svg';
import '../styles/Typography.css'; // 引入字體樣式檔案
import logo from '../images/logo.svg';

function Navbar() {
  const location = useLocation(); // 取得目前路徑

  const navLinks = [
    { name: '探索旅遊風格', path: '/explore' },
    { name: '我的行程', path: '/my-trip' },
    { name: '關於我們', path: '/about' },
    { name: '常見問題', path: '/faq' },
  ];

  return (
    <nav className="navbar">
      {/* 使用圖片作為 Logo */}
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Élan Journeys Logo" className="logo-img" />
      </Link>

      <div className="navbar-center">
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li
              key={link.path}
              className={location.pathname === link.path ? 'active' : ''}
            >
              <Link to={link.path} className="text-zh-bold-16">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-icons">
        <Link to="/cart" className="icon-link" title="購物車">
          <img src={cartIcon} alt="Cart Icon" className="nav-icon" />
        </Link>
        <Link to="/login" className="icon-link" title="會員登入">
          <img src={userIcon} alt="User Icon" className="nav-icon" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;



