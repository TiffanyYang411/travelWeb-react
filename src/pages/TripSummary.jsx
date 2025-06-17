// TripSummary.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSerialNumber } from '../utils/serialNumber';
import '../styles/TripSummary.css';
import { clearCart } from '../utils/tripUtils';
import { tripData } from '../data/tripData';
import { useTripStore } from '../store/useTripStore';
import { formatDateYMD } from '../utils/formatDate';

function TripSummary() {
  const navigate = useNavigate();
  const [serialNumber, setSerialNumber] = useState('');
  const [trips, setTrips] = useState([]);
  const [customization, setCustomization] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [dayIndexes, setDayIndexes] = useState({});
  const { setPendingTrips, setCartItems } = useTripStore();



  useEffect(() => {
    const summaryData = JSON.parse(sessionStorage.getItem('tripSummary')) || {};
    setSerialNumber(generateSerialNumber());

    const allTrips = tripData.flatMap(style => style.trips);
    const transformedTrips = (summaryData.trips || []).map(({ tripId, peopleCount }) => {
      const trip = allTrips.find(t => Number(t.id) === Number(tripId));
      if (!trip || !trip.id) {

        return null;
      }


      const daySchedules = (trip.itinerary || [])
        .filter(d => d.desc || d.image) // ✅ 過濾掉空資料
        .map((dayObj, index) => {
  const lines = String(dayObj.desc ?? '').split('\n').map(l => l.trim()).filter(Boolean);
  let current = '';
  let morning = '', afternoon = '', evening = '';
  let hasLabel = false; // ✅ 一定要加這行！

  lines.forEach((line) => {
    if (/^清晨|上午/.test(line)) {
      current = 'morning';
      hasLabel = true;
    } else if (/^中午|下午/.test(line)) {
      current = 'afternoon';
      hasLabel = true;
    } else if (/^傍晚|晚上/.test(line)) {
      current = 'evening';
      hasLabel = true;
    } else if (current) {
      if (current === 'morning') morning += line + ' ';
      if (current === 'afternoon') afternoon += line + ' ';
      if (current === 'evening') evening += line + ' ';
    }
  });

  if (!hasLabel && lines.length > 0) {
    morning = lines.join(' ');
  }

          return {
            day: index + 1,
            morning: morning.trim(),
            afternoon: afternoon.trim(),
            evening: evening.trim(),
            image: dayObj.image
          };
        });

      return {
        ...trip,
        peopleCount,
        daySchedules,
        itineraryLength: daySchedules.length  // ✅ 這裡改成用 daySchedules
      };
    }).filter(Boolean);

    setTrips(transformedTrips);
    console.log('✅ 轉換後 trips 資料:', transformedTrips); // ← ✅ 加在這
    const defaultIndexes = {};
    transformedTrips.forEach(t => {
      defaultIndexes[t.id] = 0;
    });
    setDayIndexes(defaultIndexes);
    setCustomization({
      ...summaryData.formData,
      ...summaryData.options,
      specialRequest: summaryData.specialRequest,
      foodNote: summaryData.foodNote,
      startDate: summaryData.startDate,
      endDate: summaryData.endDate,
      totalPeople: summaryData.totalPeople,
      totalPrice: summaryData.totalPrice,
    });
  }, []);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        navigate('/upcoming-trips');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);


  const handleDayChange = (tripId, direction, max) => {
    setDayIndexes(prev => {
      const current = prev[tripId] ?? 0;
      let next = direction === 'next' ? current + 1 : current - 1;
      if (next < 0) next = 0;
      if (next >= max) next = max - 1;
      return { ...prev, [tripId]: next };
    });
  };

  const handleConfirm = () => {
    setShowPopup(true);

    const currentUser = localStorage.getItem('currentUser');
    const upcomingKey = `upcomingTrips_${currentUser}`;
    const existingTrips = JSON.parse(localStorage.getItem(upcomingKey)) || [];

    const newTripRecord = {
      serialNumber,
      trips,
      customization,
      confirmedAt: new Date().toISOString()
    };

    // ✅ 存入 localStorage 的 upcomingTrips
    localStorage.setItem(upcomingKey, JSON.stringify([...existingTrips, newTripRecord]));

    // ✅ 清除 sessionStorage 中的 tripSummary
    sessionStorage.removeItem('tripSummary');

    // ✅ 清除購物車與我的行程（localStorage）
    localStorage.removeItem(`cart_${currentUser}`);
    localStorage.removeItem(`user_${currentUser}_trips`);

    // ✅ 清空 Zustand 狀態
    setPendingTrips([]);

    // ✅ ✅ ✅ ⬇⬇⬇ 關鍵補這兩行，讓畫面同步更新
    window.dispatchEvent(new Event('tripCountChanged'));
    window.dispatchEvent(new Event('tripListChanged'));
    window.dispatchEvent(new Event('clearCartManually'));

    // ✅ 3 秒後跳轉到 upcoming
    setTimeout(() => {
      navigate('/upcoming-trips');
    }, 3000);
  };


  const customizationFields = [
    { label: '人數', key: 'totalPeople', value: customization.totalPeople + ' 人' },
    { label: '費用', key: 'totalPrice', value: 'NT$ ' + Number(customization.totalPrice).toLocaleString() },
    { label: '專屬導遊 / 私人導覽', key: '1' },
    { label: '豪華專車接送', key: '2' },
    { label: '升級住宿', key: '3' },
    { label: '飲食需求', key: '4', value: customization['foodNote'] },
    { label: '姓名', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: '聯絡電話', key: 'phone' },
    { label: '其他特別需求', key: 'specialRequest' }
  ];

  return (
    <div className="trip-summary-page">
      <div className="trip-summary-header-message">
        <h2>感謝預訂，我們將為您開啟一段北歐詩篇</h2>
        <p>旅程即將展開，願這是一場值得一輩子回味的探索</p>
      </div>
      {showPopup && (
        <div className="trip-summary-popup">
          <p>您的行程已確認！<br />策劃師將於24小時聯繫<br />請前往「即將出發」頁面查看相關訊息</p>
        </div>
      )}

      {!showPopup && (
        <div className="trip-summary-wrapper">
          {/* ⬇️ 放這裡，接在 wrapper 開始後 */}

          <div className="trip-summary-header">
            <div className="trip-summary-code">{serialNumber}</div>
          </div>

          <div className="trip-summary-title">
            <div className="trip-summary-dates">{customization.startDate} ～ {customization.endDate}</div>
          </div>

          <div className="trip-summary-section">
            <div className="trip-summary-section-title">我的行程</div>
            {trips.map((trip, index) => {


              const currentIndex = dayIndexes?.[trip.id] ?? 0;

              const safeIndex = Math.max(0, Math.min(currentIndex ?? 0, trip.daySchedules.length - 1));
              const isAtFirstDay = safeIndex <= 0;
              const isAtLastDay = safeIndex >= trip.daySchedules.length - 1;
              if (!trip.daySchedules || trip.daySchedules.length === 0) {
                console.log('📦 trip =', trip);
                console.log('📆 daySchedules =', trip.daySchedules);
                return (
                  <div key={trip.id} className="trip-summary-trip-card">
                    <div className="trip-summary-info">
                      <img
                        src={`${import.meta.env.BASE_URL}${String(trip.image ?? '').replace('./', '')}`}
                        alt={`Trip ${trip.title}`}
                        className="trip-summary-img"
                      />
                    </div>
                    <div className="trip-summary-content">
                      <div className="trip-summary-top">
                        <div className="trip-summary-days">{trip.days}</div>
                        <div className="trip-summary-name">{trip.title}</div>
                      </div>
                      <div className="trip-summary-bottom">
                        <div className="trip-summary-highlight-label">⚠️ 尚無每日行程內容</div>
                        <div className="trip-summary-highlight-content">請重新選擇旅程或刷新頁面。</div>
                      </div>
                    </div>
                  </div>
                );
              }

              // ✅ 👇 這行應該放在 if 條件 return 後面
              const currentDay = trip.daySchedules?.[safeIndex];
              const { morning, afternoon, evening } = currentDay;

              // ⏱ 根據 sessionStorage 中的 startDate 和 trip 天數計算日期範圍
              const startDateStr = sessionStorage.getItem('confirmedStartDate');
              const startDate = startDateStr ? new Date(startDateStr) : null;
              let tripStartDate = startDate ? new Date(startDate) : null;
              for (let i = 0; i < index; i++) {
                const prevTrip = trips[i];
                const prevMatch = prevTrip.days?.match(/(\d+)\s*天/);
                const prevDays = prevMatch ? parseInt(prevMatch[1], 10) : 0;
                if (tripStartDate) tripStartDate.setDate(tripStartDate.getDate() + prevDays);
              }

              const match = trip.days?.match(/(\d+)\s*天/);
              const tripDays = match ? parseInt(match[1], 10) : 0;
              const tripEndDate = tripStartDate ? new Date(tripStartDate) : null;
              if (tripEndDate) tripEndDate.setDate(tripEndDate.getDate() + tripDays - 1);

              // 📅 判斷是否包含週末
              let hasWeekend = false;
              if (tripStartDate && tripDays) {
                for (let d = 0; d < tripDays; d++) {
                  const cur = new Date(tripStartDate);
                  cur.setDate(cur.getDate() + d);
                  const dow = cur.getDay();
                  if (dow === 0 || dow === 6) {
                    hasWeekend = true;
                    break;
                  }
                }
              }

              const originalPrice = trip.price;
              const finalPrice = hasWeekend ? Math.round(originalPrice * 1.2) : originalPrice;
              return (
                <div key={trip.id} className="trip-summary-trip-card" style={{
                  maxWidth: '960px',
    margin: '25px auto'
                }}
                >
                  <div className="trip-summary-info">
                    <div className="trip-summary-index-wrapper">
                      <h3 className="trip-summary-index">{`第${['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][index]}個行程`}</h3>
                    </div>
                    <img
                      src={`${import.meta.env.BASE_URL}${String(currentDay.image ?? '').replace('./', '')}`}
                      alt={`Day ${currentDay.day}`}
                      className="trip-summary-img"
                      style={{ width: '255px', height: '255px', objectFit: 'cover' }}
                    />
                  </div>

                  <div className="trip-summary-content">
                    <div className="trip-summary-top">
                      <div className="trip-summary-days">{trip.days}</div>
                      <div className="trip-summary-name">{trip.title}</div>
                    </div>
                    <div className="trip-summary-bottom">
                      <div className="trip-summary-highlight-label">行程亮點：</div>
                      <div className="trip-summary-highlight-content">
                        {trip.highlights?.filter(Boolean).join('、')}
                      </div>
                      {tripStartDate && tripEndDate && (
                        <div className="trip-summary-trip-dates" style={{ fontFamily: 'LXGW WenKai TC' }}>
                          {formatDateYMD(tripStartDate)} ～ {formatDateYMD(tripEndDate)}
                        </div>
                      )}
                      <div className="trip-summary-price-wrapper">
                        {hasWeekend ? (
                          <>
                            <span className="trip-summary-price-original">
                              NT$ {originalPrice.toLocaleString()}
                            </span>
                            <span className="trip-summary-price-current">
                              NT$ {finalPrice.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="trip-summary-price-current">
                            NT$ {originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="trip-summary-schedule">
                    <div className="trip-summary-schedule-header">
                      <button
                        disabled={isAtFirstDay}
                        onClick={() => handleDayChange(trip.id, 'prev', trip.daySchedules.length)}
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}images/tripSummary-arrow-left.svg`}
                          alt="prev"
                          className="trip-summary-arrow-left"
                          style={{
                            opacity: isAtFirstDay ? 0.3 : 1,
                            cursor: isAtFirstDay ? 'not-allowed' : 'pointer'
                          }}
                        />
                      </button>

                      <div className="trip-summary-day-label">第 {safeIndex + 1} 天</div>
                      <button
                        disabled={isAtLastDay}
                        onClick={() => handleDayChange(trip.id, 'next', trip.daySchedules.length)}
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}images/tripSummary-arrow-right.svg`}
                          alt="next"
                          className="trip-summary-arrow-right"
                          style={{
                            opacity: isAtLastDay ? 0.3 : 1,
                            cursor: isAtLastDay ? 'not-allowed' : 'pointer'
                          }}
                        />
                      </button>


                    </div>
                    <div className="trip-summary-schedule-detail">
                      {morning && (
                        <div className="trip-summary-schedule-item">
                          <div className="trip-summary-schedule-time">上午</div>
                          <div className="trip-summary-schedule-desc">{morning}</div>
                        </div>
                      )}
                      {afternoon && (
                        <div className="trip-summary-schedule-item">
                          <div className="trip-summary-schedule-time">下午</div>
                          <div className="trip-summary-schedule-desc">{afternoon}</div>
                        </div>
                      )}
                      {evening && (
                        <div className="trip-summary-schedule-item">
                          <div className="trip-summary-schedule-time">晚上</div>
                          <div className="trip-summary-schedule-desc">{evening}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );

            })}
          </div>

          <div className="trip-summary-section">
            <div className="trip-summary-section-title">客製化</div>
            <div className="trip-summary-customization">
              {customizationFields.map(({ label, key, value }) => {
                const selected = customization[key];

                // ✅ 英文格式來自 options: { '1': 'yes', ... }
                if (['1', '2', '3', '4'].includes(key)) {
                  if (selected === 'yes' && value) return (
                    <div className="trip-summary-custom-row" key={key}>
                      <div className="trip-summary-custom-label">{label}：</div>
                      <div className="trip-summary-custom-value">是，{value}</div>
                    </div>
                  );
                  if (selected === 'yes') return (
                    <div className="trip-summary-custom-row" key={key}>
                      <div className="trip-summary-custom-label">{label}：</div>
                      <div className="trip-summary-custom-value">是</div>
                    </div>
                  );
                  return null;
                }

                // 其他欄位（姓名、電話、email、特殊需求）照顯示
                if (!selected || selected === 'no') return null;

                return (
                  <div className="trip-summary-custom-row" key={key}>
                    <div className="trip-summary-custom-label">{label}：</div>
                    <div className="trip-summary-custom-value">{value || selected}</div>
                  </div>
                );
              })}

            </div>
          </div>

          <button className="trip-summary-confirm" onClick={handleConfirm}>確認送出 ➔</button>
        </div>
      )}
    </div>
  );
}

export default TripSummary;




