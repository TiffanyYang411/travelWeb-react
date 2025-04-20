// src/pages/Login.jsx
import '../styles/Login.css';

function Login() {
  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="logo">ÉLAN JOURNEYS</h1>
        <h2 className="login-title">會員登入</h2>
        <form className="login-form">
          <label htmlFor="username">帳號</label>
          <input type="text" id="username" name="username" placeholder="請輸入帳號" />

          <label htmlFor="password">密碼</label>
          <input type="password" id="password" name="password" placeholder="請輸入密碼" />

          <button type="submit" className="login-btn">登入</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
