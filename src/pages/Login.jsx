// src/pages/Login.jsx
// src/pages/Login.jsx

import '../styles/Login.css';
import '../styles/Typography.css';
import logo from '../images/Logo-login.svg'; // ✅ 確保圖片路徑正確

function Login() {
  return (
    <div className="login-page">
      <div className="login-box">
        {/* Logo */}
        <img src={logo} alt="ÉLAN Journeys Logo" className="logo-img" />

        {/* 標題 */}
        <h2 className="zh-title-36">會員登入</h2>

        {/* 登入表單 */}
        <form className="login-form">
          {/* 帳號 */}
          <div className="form-group">
            <label htmlFor="username" className="zh-text-24">帳號</label>
            <input type="text" id="username" name="username" placeholder="請輸入帳號" />
          </div>

          {/* 密碼 */}
          <div className="form-group">
            <label htmlFor="password" className="zh-text-24">密碼</label>
            <input type="password" id="password" name="password" placeholder="請輸入密碼" />
          </div>

          {/* 登入按鈕 */}
          <button type="submit" className="login-btn zh-text-20">登入</button>
        </form>

      </div>
    </div>
  );
}

export default Login;



