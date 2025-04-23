// src/pages/Login.jsx
import '../styles/Login.css';
import '../styles/Typography.css';
import logo from '../images/Logo-login.svg'; // ✅ 確保圖片路徑正確

function Login() {
  return (
    <div className="login-page">
      <div className="login-box">
        <img src={logo} alt="ÉLAN Journeys Logo" className="logo-img" />
        <h2 className="login-title title-zh-36">會員登入</h2>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username">帳號</label>
            <input type="text" id="username" name="username" placeholder="請輸入帳號" />
          </div>

          <div className="form-group">
            <label htmlFor="password">密碼</label>
            <input type="password" id="password" name="password" placeholder="請輸入密碼" />
          </div>

          <button type="submit" className="login-btn">登入</button>
        </form>

      </div>
    </div>
  );
}

export default Login;


