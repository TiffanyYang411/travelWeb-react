// TripDetailSection.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';
import { addTripToUser } from '../utils/tripUtils';
import '../styles/TripDetailVertical.css';

function TripDetailSection({ trip }) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showAddMessage, setShowAddMessage] = useState(false); // ✅ 新增這行
  const daySelectionRef = useRef(null);
  const navigate = useNavigate();

  const parsedDays = Array.isArray(trip?.itinerary)
    ? trip.itinerary
      .filter(day => day?.desc && typeof day.desc === 'string')
      .map(parseDayDetailSafe)
    : [];

  const currentDay = parsedDays[currentDayIndex] || {};

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 30 && currentDayIndex < parsedDays.length - 1) {
        setCurrentDayIndex((i) => i + 1);
      } else if (e.deltaY < -30 && currentDayIndex > 0) {
        setCurrentDayIndex((i) => i - 1);
      }
    };
    const ref = daySelectionRef.current;
    if (ref) {
      ref.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (ref) ref.removeEventListener('wheel', handleWheel);
    };
  }, [currentDayIndex, parsedDays.length]);

  const handleAddTrip = () => {
    console.log('📌 點擊加入行程按鈕');
    if (!isLoggedIn()) {
      console.log('🔒 尚未登入，導向登入頁');
      sessionStorage.setItem("returnTo", window.location.pathname);
      navigate("/login");
    } else {
      console.log('✅ 已登入，加入行程');
      addTripToUser(trip);

      window.dispatchEvent(new CustomEvent("tripCountChanged"));
      window.dispatchEvent(new CustomEvent("tripAdded"));

      // ✅ 顯示提示字，1.5秒後自動消失
      setShowAddMessage(true);
      setTimeout(() => {
        setShowAddMessage(false);
      }, 1500);
    }
  };

  return (
    <div className="trip-detail-vertical">
      <div className="trip-header">
        <h2 className="trip-vertical-title zh-title-36">{trip.title}・{trip.days}</h2>
        <p className="trip-price zh-title-28">NT${trip.price?.toLocaleString()}／人</p>
        <p className="trip-highlight zh-text-20">
          行程亮點：{trip.highlights?.filter(Boolean).join('、')}
        </p>
      </div>

      <div className="trip-detail-main-layout">
        <div className="trip-layout-image">
          <div className="trip-image-box">
            <img src={currentDay.image} alt={`Image for ${currentDay.day}`} />
            <button className="add-trip-btn-vertical" onClick={handleAddTrip}>加入行程</button>
          </div>
        </div>

        <div className="trip-layout-switch">
          <div className="day-nav">
            {parsedDays.map((d, i) => (
              <button
                key={i}
                className={i === currentDayIndex ? 'day-btn active' : 'day-btn'}
                onClick={() => setCurrentDayIndex(i)}
              >
                <span className="star">✦</span>{`第${convertToChineseNumber(i + 1)}天`}
              </button>
            ))}
          </div>
        </div>

        <div className="trip-layout-content">
          <div className="trip-day-selection-box" ref={daySelectionRef}>
            <div className="trip-day-content">
              <div className="day-title zh-title-24">{currentDay.title}</div>
              {currentDay.sections?.map((section, idx) => (
                <div key={idx} className="time-section">
                  <h4>{section.time}</h4>
                  <ul>
                    {section.content.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 提示文字，跟著TripDetailSection畫面走 */}
      {showAddMessage && (
        <div className="add-message">已加入行程！</div>
      )}
    </div>
  );
}

function parseDayDetailSafe(rawDay) {
  if (!rawDay || typeof rawDay.desc !== 'string') {
    return {
      day: rawDay?.day || '未知',
      title: '',
      sections: [],
      image: rawDay?.image || ''
    };
  }

  const lines = rawDay.desc.split('\n').map(l => l.trim()).filter(Boolean);
  const titleLine = lines[0];
  const day = rawDay.day;
  const image = rawDay.image;

  const sections = [];
  let currentTime = '';
  let currentContent = [];

  for (let i = 1; i < lines.length; i++) {
    if (["上午", "下午", "晚上", "清晨", "中午"].includes(lines[i])) {
      if (currentTime) {
        sections.push({ time: currentTime, content: currentContent });
      }
      currentTime = lines[i];
      currentContent = [];
    } else {
      currentContent.push(lines[i]);
    }
  }

  if (currentTime) {
    sections.push({ time: currentTime, content: currentContent });
  }

  return {
    day,
    title: titleLine?.replace(/^第.+?：/, '') || '',
    sections,
    image
  };
}

function convertToChineseNumber(num) {
  const chineseNums = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (num <= 10) return chineseNums[num - 1];
  if (num <= 19) return '十' + chineseNums[num - 11];
  if (num === 20) return '二十';
  return num;
}

export default TripDetailSection;









