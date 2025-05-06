// MyTrip.jsx
import { useNavigate } from 'react-router-dom';
import '../styles/MyTrip.css';
import '../styles/Typography.css';

function MyTrip() {
  const navigate = useNavigate();

  const handleStartTrip = () => {
    // ✅ 不檢查登入狀態，直接導向探索旅遊風格頁（讓 TripDetail 決定是否登入）
    navigate('/explore?style=1');
  };

  return (
    <div className="mytrip-page-wrapper">
      <div className="mytrip-empty-container">
        <h2 className="zh-title-36">您的專屬旅程</h2>
        <p className="zh-text-20">
          旅程的篇章尚未開始書寫，<br />
          現在，就是您與北歐邂逅的最佳時刻。
        </p>
        <button className="mytrip-start-trip-btn zh-text-18" onClick={handleStartTrip}>
          立即開啟您的專屬行程 ➔
        </button>
      </div>
    </div>
  );
}

export default MyTrip;







  