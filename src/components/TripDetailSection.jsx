// TripDetailSection.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';
import { addTripToUser } from '../utils/tripUtils';
import { useTripStore } from '../store/useTripStore'; // ✅ 新增：引入 useTripStore
import '../styles/TripDetailVertical.css';
import { tripData } from '../data/tripData'; // ⬅️ 加在最上面

function TripDetailSection({ trip }) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showAddMessage, setShowAddMessage] = useState(false);
  const [showImageButton, setShowImageButton] = useState(true);
  const [imageFadeKey, setImageFadeKey] = useState(0); // ✅ 新增：獨立圖片動畫控制
  const daySelectionRef = useRef(null);
  const navigate = useNavigate();
  const { pendingTrips, setPendingTrips } = useTripStore();

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
    if (!isLoggedIn()) {
      sessionStorage.setItem("returnTo", window.location.pathname);
      navigate("/login");
    } else {
      const alreadyExists = pendingTrips.some(t => t.tripId === trip.id);
      if (!alreadyExists) {
        setPendingTrips([...pendingTrips, { tripId: trip.id, peopleCount: '' }]);
      }

      // ✅ 補：從 tripData 找出完整 trip
      const fullTrip = tripData.flatMap(style => style.trips).find(t => t.id === trip.id);

      if (!fullTrip) {
      return;
      }

      addTripToUser(fullTrip);
      window.dispatchEvent(new CustomEvent("tripCountChanged"));
      window.dispatchEvent(new CustomEvent("tripAdded"));
      window.dispatchEvent(new Event('openCartDropdown'));

      setShowAddMessage(true);
      setTimeout(() => {
        setShowAddMessage(false);
      }, 1500);
    }
  };

  const handleDayClick = (i) => {
    if (i === currentDayIndex) return;
    setShowImageButton(false);
    setCurrentDayIndex(i);
    setImageFadeKey(prev => prev + 1); // ✅ 更新動畫 key
    setTimeout(() => {
      setShowImageButton(true);
    }, 400);
  };

  return (
    <div className="trip-detail-vertical">
      <div className="trip-header">
        <h2 className="trip-vertical-title zh-title-36">{trip.title}・{trip.days}</h2>
        <p className="trip-price zh-title-28">NT$ {trip.price?.toLocaleString()}／人</p>
        <p className="trip-highlight zh-text-20">
          行程亮點：{trip.highlights?.filter(Boolean).join('、')}
        </p>
      </div>

      <div className="trip-detail-main-layout">
        <div className="trip-layout-image">
          {/* ✅ 圖片獨立動畫區塊 */}
          <div className="trip-image-box">
            <div className="trip-image-wrapper">
              <img
                key={currentDayIndex}
                className="trip-image-fade"
                src={currentDay.image}
                alt={`Image for ${currentDay.day}`}
              />
            </div>
          </div>

          {/* ✅ 獨立的按鈕區塊，不與圖片共享動畫 */}
          <div className="trip-button-wrapper">
            <button className="add-trip-btn-vertical" onClick={handleAddTrip}>
              加入行程
            </button>
          </div>
        </div>


        <div className="trip-layout-switch">
          <div className="day-nav">
            {parsedDays.map((d, i) => (
              <div key={i} className="day-slot">
                <button
                  className={i === currentDayIndex ? 'day-btn active' : 'day-btn'}
                  onClick={() => handleDayClick(i)}
                >
                  <span className="star">✦</span>{`第${convertToChineseNumber(i + 1)}天`}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="trip-layout-content">
          <div className="trip-day-selection-box" ref={daySelectionRef}>
            <div key={currentDayIndex} className="trip-day-content fade-fade">
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

  const lines = String(rawDay.desc ?? '').split('\n').map(l => l.trim()).filter(Boolean);
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
    title: String(titleLine ?? '').replace(/^第.+?：/, ''),
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











