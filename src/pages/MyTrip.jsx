// MyTrip.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyTrip.css';
import '../styles/Typography.css';
import { isLoggedIn } from '../utils/auth';

function MyTrip() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleStartTrip = () => {
    if (!loggedIn) {
      // ✅ 修正回跳位置，去除 BASE_URL 部分
      const base = import.meta.env.BASE_URL.replace(/\/$/, '');
      const path = window.location.pathname.replace(base, '') + window.location.search;
      sessionStorage.setItem('returnTo', path);
      navigate('/login');
    } else {
      navigate('/explore?style=1'); // 預設導向極致戶外探險
    }
  };

  return (
    <div className="mytrip-page-wrapper">
      <div className="mytrip-empty-container">
        <h2 className="zh-title-36">您的專屬旅程</h2>
        <p className="zh-text-20">
          旅程的篇章尚未開始書寫，<br />
          現在，就是您與北歐邂逅的最佳時刻。
        </p>
        <button className="start-trip-btn zh-text-18" onClick={handleStartTrip}>
          立即開啟您的專屬行程 ➔
        </button>
      </div>
    </div>
  );
}

export default MyTrip;






  