// === 完整修正版 MyTrip.jsx (含動畫版) ===
// === 完整修正版 MyTrip.jsx (含動畫、正確 handleNext) ===
// === 新版 MyTrip.jsx ===
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTrips, removeTripFromUser, subscribeTripChanges, unsubscribeTripChanges } from '../utils/tripUtils';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/MyTrip.css';
import '../styles/Typography.css';

function extractDays(text) {
  if (!text) return 0;
  const match = text.replace(/\s+/g, '').match(/(\d+)天/);
  return match ? parseInt(match[1], 10) : 0;
}

function formatDateToZh(date) {
  if (!(date instanceof Date) || isNaN(date)) return '';
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const weekday = days[date.getDay()];
  return `${year}/${month}/${day}（${weekday}）`;
}

function MyTrip() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [peopleCounts, setPeopleCounts] = useState({});
  const [customPeopleCounts, setCustomPeopleCounts] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showNextStepMessage, setShowNextStepMessage] = useState(false);

  useEffect(() => {
    const savedPeopleCounts = JSON.parse(sessionStorage.getItem('savedPeopleCounts'));
    const savedCustomPeopleCounts = JSON.parse(sessionStorage.getItem('savedCustomPeopleCounts'));
    const savedStartDate = sessionStorage.getItem('savedStartDate');
    const savedEndDate = sessionStorage.getItem('savedEndDate');

    const tripList = getUserTrips();
    setTrips(tripList);

    if (savedPeopleCounts && savedCustomPeopleCounts && savedStartDate) {
      setPeopleCounts(savedPeopleCounts);
      setCustomPeopleCounts(savedCustomPeopleCounts);
      setStartDate(new Date(savedStartDate));
      if (savedEndDate) {
        setEndDate(new Date(savedEndDate));
      }
    } else {
      const defaultCounts = {};
      tripList.forEach(trip => {
        defaultCounts[trip.id] = '';
      });
      setPeopleCounts(defaultCounts);
      setCustomPeopleCounts({});
      setTotalPrice(0);
    }

    const handleTripChange = () => {
      loadTrips();
    };
    subscribeTripChanges(handleTripChange);
    return () => unsubscribeTripChanges(handleTripChange);
  }, []);

  const loadTrips = () => {
    const tripList = getUserTrips();
    setTrips(tripList);

    const defaultCounts = {};
    tripList.forEach(trip => {
      defaultCounts[trip.id] = '';
    });
    setPeopleCounts(defaultCounts);
    setCustomPeopleCounts({});
    setTotalPrice(0);
  };

  const calculateTotal = (counts, customs) => {
    let total = 0;
    trips.forEach(trip => {
      let count = counts[trip.id];
      if (count === 'custom') {
        count = parseInt(customs[trip.id], 10) || 0;
      } else {
        count = parseInt(count, 10) || 0;
      }
      total += trip.price * count;
    });
    setTotalPrice(total);
  };

  const handlePeopleChange = (tripId, value) => {
    const newCounts = { ...peopleCounts, [tripId]: value };
    setPeopleCounts(newCounts);
    calculateTotal(newCounts, customPeopleCounts);
  };

  const handleCustomPeopleChange = (tripId, value) => {
    const newCustoms = { ...customPeopleCounts, [tripId]: value };
    setCustomPeopleCounts(newCustoms);
    calculateTotal(peopleCounts, newCustoms);
  };

  const handleRemoveTrip = (tripId) => {
    removeTripFromUser(tripId);
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    if (trips.length > 0) {
      let totalDays = 0;
      trips.forEach(trip => {
        if (trip && trip.days) {
          totalDays += extractDays(trip.days);
        }
      });
      const end = new Date(date);
      end.setDate(end.getDate() + totalDays - 1);
      setEndDate(end);
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;

    // ✅ 先保存目前人數與日期設定
    sessionStorage.setItem('savedPeopleCounts', JSON.stringify(peopleCounts));
    sessionStorage.setItem('savedCustomPeopleCounts', JSON.stringify(customPeopleCounts));
    sessionStorage.setItem('savedStartDate', startDate.toISOString());
    if (endDate) {
      sessionStorage.setItem('savedEndDate', endDate.toISOString());
    } else {
      sessionStorage.removeItem('savedEndDate');
    }

    // ✅ 再存 confirmed 資料
    sessionStorage.setItem('confirmedTrips', JSON.stringify(trips));
    sessionStorage.setItem('confirmedStartDate', startDate.toISOString().split('T')[0]);
    if (endDate) {
      sessionStorage.setItem('confirmedEndDate', endDate.toISOString().split('T')[0]);
    } else {
      sessionStorage.removeItem('confirmedEndDate');
    }
    const totalPeopleCount = Object.values(peopleCounts).reduce((sum, count) => {
      if (count === 'custom') {
        return sum + parseInt(customPeopleCounts[Object.keys(customPeopleCounts).find(key => key in peopleCounts)] || 0, 10);
      }
      return sum + (parseInt(count, 10) || 0);
    }, 0);
    sessionStorage.setItem('confirmedTotalPeople', totalPeopleCount);
    sessionStorage.setItem('confirmedTotalPrice', totalPrice);

    setShowNextStepMessage(true);
    setTimeout(() => {
      navigate('/trip-customization');
    }, 1000);
  };

  const handleAddTrip = () => {
    navigate('/explore?style=1');
  };

  const canProceed = () => {
    if (!startDate || !endDate) return false;
    for (const trip of trips) {
      const count = peopleCounts[trip.id];
      if (!count) return false;
      if (count === 'custom' && (!customPeopleCounts[trip.id] || parseInt(customPeopleCounts[trip.id], 10) < 11)) return false;
    }
    return true;
  };

  if (trips.length === 0) {
    return (
      <div className="mytrip-page-wrapper fade-in">
        <div className="mytrip-empty-container">
          <h2 className="zh-title-36">您的專屬旅程</h2>
          <p className="zh-text-20">旅程的篇章尚未開始書寫，{"\n"}現在，就是您與北歐邂逅的最佳時刻。</p>
          <button className="mytrip-start-trip-btn zh-text-18" onClick={handleAddTrip}>
            立即開啟您的專屬行程 ➔
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mytrip-page-wrapper fade-in">
      {showNextStepMessage && (
        <div className="next-step-message">
          前往下一步！
        </div>
      )}
      <h2 className="zh-title-36 mytrip-page-title">你的專屬旅程</h2>
      <div className="mytrip-main">
        <div className="mytrip-calendar-wrapper">
          <div className="mytrip-calendar">
            <Calendar
              onChange={handleDateChange}
              value={startDate && endDate ? [startDate, endDate] : startDate}
              selectRange={false}
              next2Label={null}
              prev2Label={null}
              locale="en-US"
              formatMonthYear={(locale, date) => `${date.getFullYear()}年${date.getMonth() + 1}月`}
              formatShortWeekday={(locale, date) => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()]}
            />
          </div>
        </div>

        <div className="mytrip-info-container slide-up">
          <div className="mytrip-header-row">
            <div>行程</div>
            <div>天數</div>
            <div>行程費用/人</div>
            <div>人數</div>
          </div>

          <div className="mytrip-list">
            {trips.map((trip) => (
              <div key={trip.id} className="mytrip-item">
                <div className="mytrip-card-left">
                  <img src={trip.bannerImage || trip.banner} alt={trip.title} className="mytrip-thumb" />
                  <div className="mytrip-left-text">
                    <h3 className="zh-title-24">{trip.title}</h3>
                    <p className="zh-text-18">
                      {trip.highlights ? trip.highlights.filter(Boolean).join('、') : ''}
                    </p>
                  </div>
                </div>
                <div className="mytrip-card-right">
                  <div>{trip.days}</div>
                  <div>NT$ {trip.price.toLocaleString()}</div>
                  <div className="people-select">
                    <select
                      value={peopleCounts[trip.id] || ''}
                      onChange={(e) => handlePeopleChange(trip.id, e.target.value)}
                    >
                      <option value="">請選擇</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} 位</option>
                      ))}
                      <option value="custom">10 位以上</option>
                    </select>
                    {peopleCounts[trip.id] === 'custom' && (
                      <input
                        type="number"
                        min="11"
                        placeholder="請輸入人數"
                        value={customPeopleCounts[trip.id] || ''}
                        onChange={(e) => handleCustomPeopleChange(trip.id, e.target.value)}
                        className="custom-people-input"
                      />
                    )}
                  </div>
                  <button className="remove-btn" onClick={() => handleRemoveTrip(trip.id)}>❌</button>
                </div>
              </div>
            ))}
          </div>

          <div className="add-mytrip-btn" onClick={handleAddTrip}>➕</div>

          <div className="mytrip-summary">
            <p>日期：{startDate ? formatDateToZh(startDate) : '請選擇'}—{' '}{endDate ? formatDateToZh(endDate) : '待計算'}</p>
            <p>價格：<strong>NT${totalPrice.toLocaleString()}</strong></p>
            <button
              className={`next-step-btn zh-text-18 ${canProceed() ? '' : 'disabled'}`}
              onClick={handleNext}
              disabled={!canProceed()}
            >
              下一步 ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTrip;


























