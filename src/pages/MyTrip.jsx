// ✅ MyTrip.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/MyTrip.css';
import '../styles/Typography.css';
import { useTripStore } from '../store/useTripStore';
import { findTripById } from '../utils/findTripById';
import { removeTripFromUser } from '../utils/tripUtils';

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

  const [editingTripId, setEditingTripId] = useState(null);
  const [editingPeople, setEditingPeople] = useState({});

  useEffect(() => {
  const updateFromSession = () => {
    const stored = JSON.parse(sessionStorage.getItem('userTrips')) || [];
    setPendingTrips(stored);
  };

  updateFromSession();

  const handleConfirmedTripsChanged = () => {
    updateFromSession();
  };

  window.addEventListener('confirmedTripsChanged', handleConfirmedTripsChanged);

  return () => {
    window.removeEventListener('confirmedTripsChanged', handleConfirmedTripsChanged);
  };
}, [setPendingTrips]);


  useEffect(() => {
    calculateTotal();
    recalculateEndDate(startDate, pendingTrips);

    // ✅ pendingTrips一有變化，就存到sessionStorage
    sessionStorage.setItem('userTrips', JSON.stringify(pendingTrips));
  }, [pendingTrips, startDate]);

  const calculateTotal = () => {
    let total = 0;
    pendingTrips.forEach((trip) => {
      const tripDetail = findTripById(trip.tripId);
      if (tripDetail) {
        const people = trip.peopleCount;
        const validPeople = (!people || isNaN(people)) ? 0 : parseInt(people, 10);
        total += tripDetail.price * validPeople;
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
      const tripDetail = findTripById(trip.tripId);
      if (tripDetail) {
        const match = tripDetail.days?.match(/(\d+)\s*天/);
        const days = match ? parseInt(match[1], 10) : 0;
        totalDays += days;
      }
    });
    const newEnd = new Date(currentStartDate);
    newEnd.setDate(newEnd.getDate() + totalDays - 1);
    setEndDate(newEnd);
  };

  const handlePeopleChange = (tripId, value) => {
    if (value === 'custom') {
      const updatedTrips = pendingTrips.map(trip => {
        if (trip.tripId === tripId) {
          return { ...trip, peopleCount: 11 };
        }
        return trip;
      });
      setPendingTrips(updatedTrips);
      setEditingTripId(tripId);
    } else {
      const updatedTrips = pendingTrips.map(trip => {
        if (trip.tripId === tripId) {
          return { ...trip, peopleCount: parseInt(value, 10) };
        }
        return trip;
      });
      setPendingTrips(updatedTrips);
      setEditingTripId(null);
    }
    calculateTotal();
  };

  const handleCustomPeopleChange = (tripId, value) => {
    setEditingPeople(prev => ({
      ...prev,
      [tripId]: value,
    }));
  };

  const handleCustomBlur = (tripId, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      if (num <= 10) {
        // <=10 的話，直接更新 peopleCount，同時清空 editingPeople
        const updatedTrips = pendingTrips.map(trip => {
          if (trip.tripId === tripId) {
            return { ...trip, peopleCount: num };
          }
          return trip;
        });
        setPendingTrips(updatedTrips);
        setEditingPeople(prev => {
          const newEditing = { ...prev };
          delete newEditing[tripId];
          return newEditing;
        });
      } else {
        // >10，正常更新到 peopleCount，保留 input
        const updatedTrips = pendingTrips.map(trip => {
          if (trip.tripId === tripId) {
            return { ...trip, peopleCount: num };
          }
          return trip;
        });
        setPendingTrips(updatedTrips);
      }
      calculateTotal();
    }
  };





  const handleRemoveTrip = (tripId) => {
    const updatedTrips = pendingTrips.filter(trip => trip.tripId !== tripId);
    setPendingTrips(updatedTrips);
    removeTripFromUser(tripId);
    window.dispatchEvent(new Event("tripCountChanged"));
    calculateTotal();
    recalculateEndDate(startDate, updatedTrips);
  };

  const handleDateChange = (date) => {
    if (Array.isArray(date)) date = date[0];
    setStartDate(date);
    recalculateEndDate(date, pendingTrips);
  };

  const handleNext = () => {
    if (!canProceed()) return;

    // 🔥跳頁前，把 pendingTrips 存到 sessionStorage
    sessionStorage.setItem('confirmedTrips', JSON.stringify(pendingTrips));
    sessionStorage.setItem('confirmedStartDate', startDate);
    sessionStorage.setItem('confirmedEndDate', endDate);
    sessionStorage.setItem('confirmedTotalPeople', pendingTrips.reduce((sum, trip) => sum + (parseInt(trip.peopleCount) || 0), 0));
    sessionStorage.setItem('confirmedTotalPrice', totalPrice);

    navigate('/trip-customization');
  };

  const canProceed = () => {
    if (!startDate || !endDate) return false;
    if (pendingTrips.length === 0) return false;
    return pendingTrips.every(trip => {
      const count = trip.peopleCount;
      if (!count || isNaN(count) || parseInt(count, 10) <= 0) return false;
      return true;
    });
  };

  if (pendingTrips.length === 0) {
    return (
      <div className="mytrip-page-wrapper fade-in">
        <div className="mytrip-empty-container">
          <h2 className="zh-title-36">您的專屬旅程</h2>
          <p className="zh-text-20">旅程的篇章尚未開始書寫，<br />現在，就是您與北歐邂逅的最佳時刻。</p>
          <button className="mytrip-start-trip-btn zh-text-18" onClick={() => navigate('/explore')}>
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
                        value={editingPeople[trip.tripId] !== undefined
                          ? (parseInt(editingPeople[trip.tripId], 10) > 10 ? 'custom' : editingPeople[trip.tripId])
                          : (parseInt(trip.peopleCount, 10) > 10 ? 'custom' : trip.peopleCount || '')}
                        onChange={(e) => handlePeopleChange(trip.tripId, e.target.value)}
                      >

                        <option value="">請選擇</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} 位</option>
                        ))}
                        <option value="custom">10位以上</option>
                      </select>
                      {(editingPeople[trip.tripId] !== undefined || parseInt(trip.peopleCount, 10) > 10) && (
                        <input
                          type="number"
                          min="11"
                          value={editingPeople[trip.tripId] !== undefined
                            ? editingPeople[trip.tripId]
                            : trip.peopleCount?.toString() || ''}
                          onChange={(e) => handleCustomPeopleChange(trip.tripId, e.target.value)}
                          onBlur={(e) => handleCustomBlur(trip.tripId, e.target.value)}
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

          <div className="mytrip-add-trip-wrapper">
            <button className="mytrip-add-btn" onClick={() => navigate('/explore')}>
              ＋
            </button>
          </div>

          <div className="mytrip-summary">
            <p>日期：{startDate ? formatDateToZh(startDate) : '請選擇'} — {endDate ? formatDateToZh(endDate) : '待計算'}</p>
            <p>價格：<strong>NT${isNaN(totalPrice) ? 0 : totalPrice.toLocaleString()}</strong></p>
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








































