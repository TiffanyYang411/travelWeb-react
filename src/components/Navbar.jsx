// Navbar.jsx
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [cartPinned]);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        setCartPinned(false);
        setShowCartDropdown(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  useEffect(() => {
    const handleOpenCart = () => {
      setCartPinned(false);
      setShowCartDropdown(true);
      setTimeout(() => {
        setShowCartDropdown(false);
      }, 1500);
    };
    window.addEventListener('openCartDropdown', handleOpenCart);
    return () => window.removeEventListener('openCartDropdown', handleOpenCart);
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
    { name: '探索旅遊風格', path: '/explore', scrollToTop: true },
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
      <Link to="/" className="navbar-logo" style={{ cursor: 'pointer' }}>
        {/* 桌機版 logo */}
        <img src={logo} alt="Élan Journeys Logo" className="logo-img logo-desktop" />
        {/* 手機版 logo：改為 public 路徑 */}
        <img src={`${import.meta.env.BASE_URL}images/logo-mobile.svg`} alt="mobile logo" className="logo-img logo-mobile" />
      </Link>

      <div className={`navbar-center ${loggedIn ? 'shift-right' : ''}`}>
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li
              key={link.path}
              className={location.pathname === link.path.split('?')[0] ? 'active' : ''}
            >
              {link.scrollToTop ? (
                <Link
                  to={link.path}
                  className="zh-text-16"
                  onClick={() => {
                    sessionStorage.setItem('scrollToTop', 'true');
                    setMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              ) : (
                <Link
                  to={link.path}
                  className="zh-text-16"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-icons">
        <div
          className="cart-container"
          ref={cartRef}
          onMouseEnter={() => !cartPinned && setShowCartDropdown(true)}
          onMouseLeave={() => !cartPinned && setShowCartDropdown(false)}
        >
          <div className="icon-link" title="購物車" onClick={handleCartClick} style={{ cursor: 'pointer' }}>
            <img src={cartIcon} alt="Cart Icon" className="nav-icon" />
            {loggedIn && tripCount > 0 && <span className="cart-dot">{tripCount}</span>}
          </div>
          <CartDropdown isOpen={showCartDropdown} isLoggedIn={loggedIn} />
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
            <span
              style={{ color: '#F6FBFC', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block' }}
              title={userName}
            >
              {userName}
            </span>
            <button onClick={handleLogout} className="logout-btn" title="登出">
              <img src={logoutIcon} alt="Logout Icon" className="nav-icon" />
            </button>
          </div>
        )}

        {/* 📱 漢堡選單 icon */}
        <div className="icon-link mobile-menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className="hamburger-icon">☰</span>
        </div>
      </div>

      {/* 📱 側邊滑出選單 */}
      <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
          ×
        </button>

        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="zh-text-16"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
}

export default Navbar;
















