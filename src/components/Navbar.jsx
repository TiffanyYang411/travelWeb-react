// src/components/Navbar.jsx

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import '../styles/Navbar.css';
import '../styles/Typography.css';
import cartIcon from '../images/cart-icon-logout.svg';
import userIcon from '../images/user-icon.svg';
import logoutIcon from '../images/Logout-icon.svg';
import logo from '../images/logo.svg';
import { isLoggedIn, getUserName, logout } from '../utils/auth';
import { getTripCount } from '../utils/tripUtils';
import CartDropdown from './CartDropdown';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartRef = useRef(null);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [tripCount, setTripCount] = useState(0);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [cartPinned, setCartPinned] = useState(false);

  useEffect(() => {
    const loginStatus = isLoggedIn();
    setLoggedIn(loginStatus);
    if (loginStatus) {
      setUserName(getUserName());
      setTripCount(getTripCount());
    }
  }, [location]);

  useEffect(() => {
    const updateTripCount = () => {
      if (isLoggedIn()) {
        setTripCount(getTripCount());
      }
    };
    window.addEventListener("tripCountChanged", updateTripCount);
    return () => window.removeEventListener("tripCountChanged", updateTripCount);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartPinned(false);
        setShowCartDropdown(false);
      }
    };
    if (cartPinned) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cartPinned]);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        setCartPinned(false);
        setShowCartDropdown(false);
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  const handleCartClick = () => {
    const nextPinned = !cartPinned;
    setCartPinned(nextPinned);
    setShowCartDropdown(nextPinned);
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    window.location.href = import.meta.env.BASE_URL;
  };

  const navLinks = [
    { name: '探索旅遊風格', path: '/explore' },
    { name: '我的行程', path: '/my-trip' },
    ...(loggedIn ? [
      { name: '即將出發', path: '/upcoming-trips' },
      { name: '歷史行程', path: '/past-trips' },
    ] : []),
    { name: '關於我們', path: '/about' },
    { name: '常見問題', path: '/faq' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Élan Journeys Logo" className="logo-img" />
      </Link>

      <div className={`navbar-center ${loggedIn ? 'shift-right' : ''}`}>
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.path} className={location.pathname === link.path ? 'active' : ''}>
              <Link to={link.path} className="zh-text-16">{link.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-icons">
        <div
          className="cart-container"
          style={{ position: 'relative' }}
          ref={cartRef}
          onMouseEnter={() => !cartPinned && setShowCartDropdown(true)}
          onMouseLeave={() => !cartPinned && setShowCartDropdown(false)}
        >
          <div className="icon-link" title="購物車" onClick={handleCartClick} style={{ cursor: 'pointer' }}>
            <img src={cartIcon} alt="Cart Icon" className="nav-icon" />
            {loggedIn && tripCount > 0 && (
              <span className="cart-dot">{tripCount}</span>
            )}
          </div>
          {loggedIn && showCartDropdown && (
            <div className="cart-dropdown-wrapper">
              <CartDropdown />
            </div>
          )}
        </div>

        {!loggedIn ? (
          <div
            className="icon-link"
            title="會員登入"
            onClick={() => {
              sessionStorage.setItem("returnTo", location.pathname + location.search);
              navigate("/login");
            }}
            style={{ cursor: 'pointer' }}
          >
            <img src={userIcon} alt="User Icon" className="nav-icon" />
          </div>
        ) : (
          <div className="user-info zh-text-16">
            <img src={userIcon} alt="User Icon" className="nav-icon" />
            <span style={{ color: '#F6FBFC', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block' }} title={userName}>
              {userName}
            </span>
            <button onClick={handleLogout} className="logout-btn" title="登出">
              <img src={logoutIcon} alt="Logout Icon" className="nav-icon" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;












