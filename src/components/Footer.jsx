// src/components/Footer.jsx
import '../styles/Footer.css';
import footerLogo from '../images/Logo-footer.svg';

function Footer() {
  return (
    <footer className="footer">
      {/* 上層區塊 */}
      <div className="footer-top">
        {/* Logo 與聯絡資訊 */}
        <div className="footer-left">
          <div className="footer-logo">
            <img src={footerLogo} alt="ÉLAN Journeys Logo" className="footer-logo-img" />
          </div>
          <p>地址：台北市信義松仁路100號</p>
          <p>電話號碼：123-456-7890　信箱：example@gmail.com</p>
        </div>

        {/* 導覽連結 */}
        <div className="footer-right">
          <div className="footer-links-grid">
            <div><a href="/">首頁</a></div>
            <div><a href="/my-trip">我的行程</a></div>
            <div><a href="/explore">旅遊風格</a></div>
            <div><a href="/about">關於我們</a></div>
            <div><a href="/faq">常見問題</a></div>

            <div><a href="/login">會員登入</a></div>
            <div><a href="#">歷史行程</a></div>
            <div><a href="#">極致戶外探險</a></div>

            <div></div>
            <div><a href="#">現在出發</a></div>
            <div><a href="#">米其林美食巡禮</a></div>

            <div></div>
            <div></div>
            <div><a href="#">頂級奢華度假</a></div>

            <div></div>
            <div></div>
            <div><a href="#">深度文化之旅</a></div>

            <div></div>
            <div></div>
            <div><a href="#">北歐療癒假期</a></div>
          </div>
        </div>
      </div>

      {/* 下層版權 */}
      <div className="footer-bottom">
        © 2025 by VIP Global (Taiwan). All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
