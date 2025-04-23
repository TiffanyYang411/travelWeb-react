// src/components/Footer.jsx
import { Link, useLocation } from 'react-router-dom';
import '../styles/Footer.css';
import footerLogo from '../images/Logo-footer.svg';

function Footer() {
  const location = useLocation();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-left">
          <div className="footer-logo">
            <img src={footerLogo} alt="ÉLAN Journeys Logo" className="footer-logo-img" />
          </div>
          <p>地址：台北市信義松仁路100號</p>
          <p>電話號碼：123-456-7890　信箱：example@gmail.com</p>
        </div>

        <div className="footer-right">
          <div className="footer-links-grid">
            {/* 第一列 */}
            <div style={{ gridColumn: '1', gridRow: '1' }}><Link to="/">首頁</Link></div>
            <div style={{ gridColumn: '2', gridRow: '1' }}><Link to="/my-trip">我的行程</Link></div>
            <div style={{ gridColumn: '3', gridRow: '1' }}><Link to="/explore">旅遊風格</Link></div>
            <div style={{ gridColumn: '4', gridRow: '1' }}><Link to="/about">關於我們</Link></div>
            <div style={{ gridColumn: '5', gridRow: '1' }}><Link to="/faq">常見問題</Link></div>

            {/* 第二列 */}
            <div style={{ gridColumn: '1', gridRow: '2' }}><Link to="/login">會員登入</Link></div>
            <div style={{ gridColumn: '2', gridRow: '2' }}><a href="#">歷史行程</a></div>
            <div style={{ gridColumn: '3', gridRow: '2' }}><a href="#">極致戶外探險</a></div>

            {/* 第三列 */}
            <div style={{ gridColumn: '2', gridRow: '3' }}><a href="#">現在出發</a></div>
            <div style={{ gridColumn: '3', gridRow: '3' }}><a href="#">米其林美食巡禮</a></div>

            {/* 第四列 */}
            <div style={{ gridColumn: '3', gridRow: '4' }}><a href="#">頂級奢華度假</a></div>

            {/* 第五列 */}
            <div style={{ gridColumn: '3', gridRow: '5' }}><a href="#">深度文化之旅</a></div>

            {/* 第六列 */}
            <div style={{ gridColumn: '3', gridRow: '6' }}><a href="#">北歐療癒假期</a></div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 by VIP Global (Taiwan). All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;










