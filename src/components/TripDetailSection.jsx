import { useState, useEffect, useRef } from 'react';
import '../styles/TripDetailVertical.css';

function TripDetailSection({ trip }) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const daySelectionRef = useRef(null); // ✅ 專屬區域

  const parsedDays = Array.isArray(trip?.itinerary)
    ? trip.itinerary
        .filter(day => day?.desc && typeof day.desc === 'string')
        .map(parseDayDetailSafe)
    : [];

  const currentDay = parsedDays[currentDayIndex] || {};

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault(); // 避免畫面跟著捲動
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

  return (
    <div className="trip-detail-vertical">
      <div className="trip-header">
        <h2 className="trip-vertical-title zh-title-36">{trip.title}・{trip.days}</h2>
        <p className="trip-price zh-title-28">NT${trip.price?.toLocaleString()}／人</p>
        <p className="trip-highlight zh-text-20">行程亮點：{trip.highlights?.join('、')}</p>
      </div>

      <div className="trip-detail-main-layout">
        <div className="trip-layout-image">
          <div className="trip-image-box">
            <img src={currentDay.image} alt={`Image for ${currentDay.day}`} />
            <button className="add-btn">加入行程</button>
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
          <div className="trip-day-selection-box" ref={daySelectionRef}> {/* ✅ 綁定區域 */}
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
  return num; // fallback
}

export default TripDetailSection;







