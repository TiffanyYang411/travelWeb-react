// src/components/Footer.jsx

import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Footer.css';
import '../styles/Typography.css';
import footerLogo from '../images/Logo-footer.svg';
import { isLoggedIn, logout } from '../utils/auth'; // ✅ 登入判斷與登出

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAboutPage = location.pathname === "/about";
  const loggedIn = isLoggedIn();

  return (
    <footer className={`footer ${isAboutPage ? "footer-about-bg" : ""}`}>
      {/* 上層 深藍區 */}
      <div className="footer-top">
        <div className="footer-left">
          <div className="footer-logo">
            <img src={footerLogo} alt="ÉLAN Journeys Logo" className="footer-logo-img" />
          </div>
          <p className="zh-text-14">地址：台北市信義松仁路100號</p>
          <p className="zh-text-14">電話號碼：123-456-7890　信箱：example@gmail.com</p>
        </div>

        <div className="footer-right">
          <div className="footer-links-grid">
            {/* 第一列 */}
            <div className="footer-link-item" style={{ gridColumn: '1', gridRow: '1' }}>
              <Link to="/" className="zh-text-14">首頁</Link>
            </div>
            <div className="footer-link-item" style={{ gridColumn: '2', gridRow: '1' }}>
              <Link to="/my-trip" className="zh-text-14">我的行程</Link>
            </div>
            <div className="footer-link-item" style={{ gridColumn: '3', gridRow: '1' }}>
              <span
                className="zh-text-14"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigate('/explore?style=1');
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
              >
                探索旅遊風格
              </span>
            </div>

            <div className="footer-link-item" style={{ gridColumn: '4', gridRow: '1' }}>
              <Link to="/about" className="zh-text-14">關於我們</Link>
            </div>
            <div className="footer-link-item" style={{ gridColumn: '5', gridRow: '1' }}>
              <Link to="/faq" className="zh-text-14">常見問題</Link>
            </div>

            {/* 第二列 */}
            <div className="footer-link-item" style={{ gridColumn: '1', gridRow: '2' }}>
              {loggedIn ? (
                <span
                  className="zh-text-14"
                  style={{ cursor: 'pointer', color: 'white' }}
                  onClick={() => {
                    logout();
                    navigate(`${import.meta.env.BASE_URL}`); // ✅ 改成正確 base path
                    window.location.href = import.meta.env.BASE_URL;
                  }}
                >
                  會員登出
                </span>
              ) : (
                <Link to="/login" className="zh-text-14">會員登入</Link>
              )}
            </div>

            {loggedIn && (
              <>
                <div className="footer-link-item" style={{ gridColumn: '2', gridRow: '2' }}>
                  <Link to="/past-trips" className="zh-text-14">歷史行程</Link>
                </div>
                <div className="footer-link-item" style={{ gridColumn: '2', gridRow: '3' }}>
                  <Link to="/upcoming-trips" className="zh-text-14">即將出發</Link>
                </div>
              </>
            )}

            {/* 探索風格列（固定） */}
            <div className="footer-link-item" style={{ gridColumn: '3', gridRow: '2' }}>
              <Link to="/explore?style=1" className="zh-text-14">極致戶外探險</Link>
            </div>
            <div className="footer-link-item" style={{ gridColumn: '3', gridRow: '3' }}>
              <Link to="/explore?style=2" className="zh-text-14">米其林美食巡禮</Link>
            </div>
            <div className="footer-link-item" style={{ gridColumn: '3', gridRow: '4' }}>
              <Link to="/explore?style=3" className="zh-text-14">頂級奢華度假</Link>
            </div>
            <div className="footer-link-item" style={{ gridColumn: '3', gridRow: '5' }}>
              <Link to="/explore?style=4" className="zh-text-14">深度文化之旅</Link>
            </div>
            <div className="footer-link-item" style={{ gridColumn: '3', gridRow: '6' }}>
              <Link to="/explore?style=5" className="zh-text-14">北歐療癒假期</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 最下層 淺藍版權區 */}
      <div className="footer-bottom">
        <p className="en-title-16">© 2025 by VIP Global (Taiwan). All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;














