// src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import '../styles/Typography.css';
import logo from '../images/Logo-login.svg';
import { login } from '../utils/auth';

function Login() {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ 執行假登入（任意帳密都可）
    const userName = login(usernameInput); // 隨機產生 USERXXX 名稱

    // ✅ 取得預設回跳頁面
    const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
    sessionStorage.removeItem('redirectAfterLogin'); // 用完即清

    navigate(redirectPath);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <img src={logo} alt="ÉLAN Journeys Logo" className="logo-img" />
        <h2 className="zh-title-36">會員登入</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username" className="zh-text-24">帳號</label>
            <input
              type="text"
              id="username"
              name="username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="請輸入帳號"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="zh-text-24">密碼</label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="請輸入密碼"
              required
            />
          </div>

          <button type="submit" className="login-btn zh-text-20">登入</button>
        </form>
      </div>
    </div>
  );
}

export default Login;




