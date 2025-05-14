// === 完整修正版 MyTrip.jsx (含動畫版) ===
// === 完整修正版 MyTrip.jsx (含動畫、正確 handleNext) ===
// === 新版 MyTrip.jsx ===
// MyTrip.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/MyTrip.css';
import '../styles/Typography.css';
import { useTripStore } from '../store/useTripStore';
import { findTripById } from '../utils/findTripById';

function formatDateToZh(date) {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const weekday = days[date.getDay()];
  return `${year}/${month}/${day}（${weekday}）`;
}

function MyTrip() {
  const navigate = useNavigate();
  const {
    pendingTrips,
    setPendingTrips,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    totalPrice,
    setTotalPrice,
  } = useTripStore();

  const [customPeopleCounts, setCustomPeopleCounts] = useState({});

  useEffect(() => {
    calculateTotal();
    recalculateEndDate(startDate, pendingTrips);
  }, [pendingTrips, startDate, customPeopleCounts]);

  const calculateTotal = () => {
    let total = 0;
    pendingTrips.forEach((trip) => {
      const tripDetail = findTripById(trip.tripId);
      if (tripDetail) {
        const people = trip.peopleCount === 'custom'
          ? parseInt(customPeopleCounts[trip.tripId], 10) || 0
          : trip.peopleCount || 0;
        total += tripDetail.price * people;
      }
    });
    setTotalPrice(total);
  };

  const recalculateEndDate = (currentStartDate, tripArray) => {
    if (!currentStartDate || tripArray.length === 0) {
      setEndDate(null);
      return;
    }
    let totalDays = 0;
    tripArray.forEach(trip => {
      const people = trip.peopleCount === 'custom'
        ? parseInt(customPeopleCounts[trip.tripId], 10)
        : trip.peopleCount;

      if (people && people > 0) {
        const tripDetail = findTripById(trip.tripId);
        if (tripDetail) {
          const match = tripDetail.days.match(/(\d+)天/);
          const days = match ? parseInt(match[1], 10) : 0;
          totalDays += days;
        }
      }
    });
    if (totalDays > 0) {
      const newEnd = new Date(currentStartDate);
      newEnd.setDate(newEnd.getDate() + totalDays - 1);
      setEndDate(newEnd);
    } else {
      setEndDate(null);
    }
  };

  const handlePeopleChange = (tripId, value) => {
    const updatedTrips = pendingTrips.map(trip => {
      if (trip.tripId === tripId) {
        return { ...trip, peopleCount: value === 'custom' ? 'custom' : parseInt(value, 10) || 0 };
      }
      return trip;
    });
    setPendingTrips(updatedTrips);
    recalculateEndDate(startDate, updatedTrips); // 🔥 選完人數馬上重新算！
  };

  const handleCustomPeopleChange = (tripId, value) => {
    setCustomPeopleCounts(prev => ({
      ...prev,
      [tripId]: value
    }));
    recalculateEndDate(startDate, pendingTrips); // 🔥 自訂輸入人數後也重新算！
  };

  const handleRemoveTrip = (tripId) => {
    const updatedTrips = pendingTrips.filter(trip => trip.tripId !== tripId);
    const updatedCustomPeopleCounts = { ...customPeopleCounts };
    delete updatedCustomPeopleCounts[tripId];
    setPendingTrips(updatedTrips);
    setCustomPeopleCounts(updatedCustomPeopleCounts);
    recalculateEndDate(startDate, updatedTrips); // 🔥 移除行程後也重新算！
  };

  const handleDateChange = (date) => {
    if (Array.isArray(date)) {
      date = date[0];
    }
    setStartDate(date);
    recalculateEndDate(date, pendingTrips); // 🔥 起日一選馬上算
  };

  const handleAddTrip = () => {
    navigate('/explore');
  };

  const handleNext = () => {
    if (!canProceed()) return;
    navigate('/trip-customization');
  };

  const canProceed = () => {
    if (!startDate || !endDate) return false;
    if (pendingTrips.length === 0) return false;
    return pendingTrips.every(trip => {
      const people = trip.peopleCount === 'custom'
        ? parseInt(customPeopleCounts[trip.tripId], 10)
        : trip.peopleCount;
      return people && people > 0;
    });
  };

  if (pendingTrips.length === 0) {
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
            {pendingTrips.map((trip) => {
              const tripDetail = findTripById(trip.tripId);
              if (!tripDetail) return null;
              return (
                <div key={trip.tripId} className="mytrip-item">
                  <div className="mytrip-card-left">
                    <img src={tripDetail.bannerImage || tripDetail.banner} alt={tripDetail.title} className="mytrip-thumb" />
                    <div className="mytrip-left-text">
                      <h3 className="zh-title-24">{tripDetail.title}</h3>
                      <p className="zh-text-18">
                        {tripDetail.highlights ? tripDetail.highlights.filter(Boolean).join('、') : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mytrip-card-right">
                    <div>{tripDetail.days}</div>
                    <div>NT$ {tripDetail.price.toLocaleString()}</div>
                    <div className="people-select">
                      <select
                        value={trip.peopleCount || ''}
                        onChange={(e) => handlePeopleChange(trip.tripId, e.target.value)}
                      >
                        <option value="">請選擇</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} 位</option>
                        ))}
                        <option value="custom">10位以上</option>
                      </select>

                      {trip.peopleCount === 'custom' && (
                        <input
                          type="number"
                          min="11"
                          placeholder="請輸入人數"
                          value={customPeopleCounts[trip.tripId] || ''}
                          onChange={(e) => handleCustomPeopleChange(trip.tripId, e.target.value)}
                          className="custom-people-input"
                        />
                      )}
                    </div>
                    <button className="remove-btn" onClick={() => handleRemoveTrip(trip.tripId)}>❌</button>
                  </div>
                </div>
              );
            })}
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

































