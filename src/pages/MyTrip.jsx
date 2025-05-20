// ✅ MyTrip.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/MyTrip.css';
import '../styles/Typography.css';
import { useTripStore } from '../store/useTripStore';
import { findTripById } from '../utils/findTripById';
import { getUserTrips, removeTripFromUser } from '../utils/tripUtils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


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
  const [hasSurcharge, setHasSurcharge] = useState(false); // ✅ 顯示是否週末加價
  const [surchargeDates, setSurchargeDates] = useState([]);      // ✅ 新增

  // ✅ 拖曳完成時更新順序
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(pendingTrips);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setPendingTrips(reordered);
  };

  useEffect(() => {
    const updateFromSession = () => {
      const stored = getUserTrips() || [];
      setPendingTrips(
        stored.map(trip => ({
          tripId: trip.id, // 🔥 把 id 轉成 tripId，符合 MyTrip 用的資料結構
          peopleCount: trip.peopleCount || 0,
        }))
      );
    };

    updateFromSession();

    const handleTripChange = () => {
      updateFromSession();
    };

    window.addEventListener('confirmedTripsChanged', handleTripChange);
    window.addEventListener('tripCountChanged', handleTripChange);

    return () => {
      window.removeEventListener('confirmedTripsChanged', handleTripChange);
      window.removeEventListener('tripCountChanged', handleTripChange);
    };
  }, [setPendingTrips]);

  useEffect(() => {
    calculateTotal();
    recalculateEndDate(startDate, pendingTrips);

    // ✅ pendingTrips一有變化，就存到sessionStorage
    sessionStorage.setItem('userTrips', JSON.stringify(pendingTrips));
  }, [pendingTrips, startDate]);

  const calculateTotal = (inputStartDate = startDate, inputTrips = pendingTrips) => {
    let total = 0;
    let foundSurcharge = false;
    const weekendDates = []; // ✅ 收集週末日期

    if (!startDate) {
      setTotalPrice(0);
      setHasSurcharge(false);
      setSurchargeDates([]);
      return;
    }

    let currentDate = new Date(inputStartDate); // 🔁 每次重算從 startDate 開始

pendingTrips.forEach((trip) => {
  const tripDetail = findTripById(trip.tripId);
  if (!tripDetail) return;

  const people = parseInt(trip.peopleCount, 10);
  if (!people || isNaN(people)) return;

  const match = tripDetail.days?.match(/(\d+)\s*天/);
  const days = match ? parseInt(match[1], 10) : 0;
  let hasWeekend = false;

  // 🔁 檢查該行程的實際落點範圍是否有週末
  for (let i = 0; i < days; i++) {
    const curDate = new Date(currentDate);
    curDate.setDate(currentDate.getDate() + i);
    const day = curDate.getDay();
    if (day === 0 || day === 6) {
      hasWeekend = true;
      foundSurcharge = true;
      weekendDates.push(`${curDate.getMonth() + 1}/${curDate.getDate()}`);
    }
  }

  // 💰 該行程要不要加價
  const pricePerPerson = hasWeekend ? tripDetail.price * 1.2 : tripDetail.price;
  total += pricePerPerson * people;

  // 🧭 將 currentDate 往後推動
  currentDate.setDate(currentDate.getDate() + days);
});


    // ✅ 先排序週末日期，避免順序亂跳
    weekendDates.sort((a, b) => {
      const [aM, aD] = a.split('/').map(Number);
      const [bM, bD] = b.split('/').map(Number);
      return new Date(2025, aM - 1, aD) - new Date(2025, bM - 1, bD);
    });

    setHasSurcharge(foundSurcharge);
    setSurchargeDates(weekendDates); // ✅ 存週末日期文字
    setTotalPrice(Math.round(total));
  };

  // ✅ 額外邏輯：只根據日期與天數判斷是否包含週末（不考慮人數）
  const hasWeekendInRange = (() => {
    if (!startDate || pendingTrips.length === 0) return false;

    let totalDays = 0;
    pendingTrips.forEach(trip => {
      const detail = findTripById(trip.tripId);
      if (!detail) return;
      const match = detail.days?.match(/(\d+)\s*天/);
      const days = match ? parseInt(match[1], 10) : 0;
      totalDays += days;
    });

    const end = new Date(startDate);
    end.setDate(end.getDate() + totalDays - 1);

    const cur = new Date(startDate);
    while (cur <= end) {
      const day = cur.getDay();
      if (day === 0 || day === 6) {
        return true; // 有包含週末
      }
      cur.setDate(cur.getDate() + 1);
    }
    return false;
  })();


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
    if (isTodayDisabled(date)) {
      alert('當天不可預定行程，請選擇其他日期');
      return;
    }
    if (isPastDate(date)) return; // 不可選今天以前
    if (!isRangeValid(date, pendingTrips)) return; // 若包含額滿日，跳錯誤
    setStartDate(date);
    recalculateEndDate(date, pendingTrips);
    calculateTotal(date, pendingTrips); // ✅ 加這行，確保週末加價會重新計算
  };

  // 👉 今天以前的日期不可選
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // ✅ 新增：判斷是否為今天（今天也不能預訂）
  const isTodayDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compare = new Date(date);
    compare.setHours(0, 0, 0, 0);
    return compare.getTime() === today.getTime();
  };

  // 👉 設定額滿的日子
  // 建立從今天到 2025-12 的隨機額滿日期（例如每月第 10、20、28 號）
  const fullyBookedDates = [];

  for (let month = 4; month <= 11; month++) {
    const year = 2025;
    ['10', '29'].forEach(day => {
      const date = new Date(year, month, parseInt(day));
      fullyBookedDates.push(date.toISOString().split('T')[0]);
    });
  }


  const isFullyBooked = (date) => {
    const yyyyMMdd = date.toISOString().split('T')[0];
    return fullyBookedDates.includes(yyyyMMdd);
  };

  // 👉 判斷整個日期區間是否包含額滿
  const isRangeValid = (start, trips) => {
    let totalDays = 0;
    trips.forEach(trip => {
      const detail = findTripById(trip.tripId);
      if (detail) {
        const match = detail.days?.match(/(\d+)\s*天/);
        totalDays += match ? parseInt(match[1], 10) : 0;
      }
    });
    const end = new Date(start);
    end.setDate(end.getDate() + totalDays - 1);
    let cur = new Date(start);
    while (cur <= end) {
      if (isFullyBooked(cur)) {
        alert(`${cur.getMonth() + 1}月${cur.getDate()}日人數已額滿，請另外選擇日期`);
        return false;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return true;
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
      <div className="mytrip-page-wrapper fade-in-safe">
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
console.log('🧪 pendingTrips:', pendingTrips);

  return (
    <div className="mytrip-page-wrapper fade-in-safe">
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
              formatMonthYear={(locale, date) =>
                `${date.getFullYear()}年${date.getMonth() + 1}月`
              }
              formatShortWeekday={(locale, date) => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()]}
              tileDisabled={({ date, view }) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (view === 'decade') {
                  // 禁用今天以前的年份
                  return date.getFullYear() < today.getFullYear();
                }

                if (view === 'year') {
                  // 禁用今天以前的月份
                  const year = date.getFullYear();
                  const month = date.getMonth();
                  return (
                    year < today.getFullYear() ||
                    (year === today.getFullYear() && month < today.getMonth())
                  );
                }

                if (view === 'month') {
                  // 月曆視圖下：只禁用額滿日（你原本邏輯保留）
                  return isFullyBooked(date);
                }

                return false;
              }}


              tileClassName={({ date, view }) => {
                const classes = [];

                const yyyyMMdd = date.toISOString().split('T')[0];
                const isFull = fullyBookedDates.includes(yyyyMMdd);

                if (view === 'month') {
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                  const selectedStart = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
                  const selectedEnd = endDate ? new Date(endDate.setHours(0, 0, 0, 0)) : null;
                  const currentDate = new Date(date.setHours(0, 0, 0, 0));

                  const isSelected = selectedStart && selectedEnd &&
                    currentDate.getTime() >= selectedStart.getTime() &&
                    currentDate.getTime() <= selectedEnd.getTime();

                  if (isPastDate(date)) classes.push('past-date');
                  if (isTodayDisabled(date)) classes.push('today-disabled');
                  if (isFull) classes.push('fully-booked-day');

                  if (isWeekend) {
                    if (isSelected) {
                      classes.push('weekend-selected');
                    } else {
                      classes.push('weekend-possible');
                    }
                  }

                  if (selectedStart && currentDate.getTime() === selectedStart.getTime()) {
                    classes.push('react-calendar__tile--rangeStart');
                    if (isWeekend) classes.push('weekend-range-start');
                  }

                  if (selectedEnd && currentDate.getTime() === selectedEnd.getTime()) {
                    if (isWeekend) classes.push('weekend-range-end');
                  }
                }

                return classes;
              }}





              tileLabel={({ date }) => {
                const yyyyMMdd = date.toISOString().split('T')[0];
                const isFull = fullyBookedDates.includes(yyyyMMdd);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const title = isFull
                  ? '當日已預訂額滿，請另擇日期'
                  : isWeekend
                    ? '週末加價 20%'
                    : null;
                return title ? (
                  <abbr title={title}>{date.getDate()}</abbr>
                ) : (
                  <abbr>{date.getDate()}</abbr>
                );
              }}

              formatMonth={(locale, date) =>
                date.toLocaleString('en-US', { month: 'short' })
              }
            />

            {hasWeekendInRange &&
              pendingTrips.every(trip => !trip.peopleCount || parseInt(trip.peopleCount, 10) <= 0) && (
                <p className="calendar-warning-text zh-text-12">
                  ※ 您所選的日期涵蓋假日，行程費用將加收 20% 假日加價費用
                </p>
              )}


            {hasSurcharge && (
              <p className="calendar-surcharge-text zh-text-12">
                ⚠️ 您的行程包含週末（{surchargeDates.join('、')}），每人需加價 20%
              </p>
            )}

          </div>
        </div>

        <div className="mytrip-info-container slide-up-appear">
          <div className="mytrip-header-row">
            <div>行程</div>
            <div>天數</div>
            <div>行程費用/人</div>
            <div>人數</div>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tripList">
              {(provided) => (
                <div
                  className="mytrip-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {pendingTrips.map((trip, index) => {
                    const tripDetail = findTripById(trip.tripId);
                    if (!tripDetail) return null;
                    const priceMatch = tripDetail.days?.match(/(\d+)\s*天/);
const days = priceMatch ? parseInt(priceMatch[1], 10) : 0;

let tripStartDate = new Date(startDate);
for (let i = 0; i < index; i++) {
  const prevDetail = findTripById(pendingTrips[i].tripId);
  const prevMatch = prevDetail.days?.match(/(\d+)\s*天/);
  const prevDays = prevMatch ? parseInt(prevMatch[1], 10) : 0;
  tripStartDate.setDate(tripStartDate.getDate() + prevDays);
}

// 檢查該行程實際天數範圍是否有週末
let tripHasWeekend = false;
for (let i = 0; i < days; i++) {
  const d = new Date(tripStartDate);
  d.setDate(d.getDate() + i);
  const dow = d.getDay();
  if (dow === 0 || dow === 6) {
    tripHasWeekend = true;
    break;
  }
}

const finalPrice = tripHasWeekend
  ? Math.round(tripDetail.price * 1.2)
  : tripDetail.price;

                    return (
                      <Draggable
                        key={`trip-${trip.tripId}`}  // ✅ 保證唯一且穩定
                        draggableId={trip.tripId.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="mytrip-item drag-handle"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps} // ✅ 可以整塊都可拖曳，或改放到圖左再微調
                            style={{
                              ...provided.draggableProps.style,
                              userSelect: 'none', // ✅ 避免拖曳時選取文字
                              width: '100%', // ✅ 確保對齊一致
                            }}
                          >
                            {/* 行程（圖片＋標題＋亮點） */}
                            <div className="mytrip-card-cell mytrip-card-left">
                              <img
                                src={tripDetail.bannerImage || tripDetail.banner}
                                alt={tripDetail.title}
                                className="mytrip-thumb"
                              />
                              <div className="mytrip-left-text">
                                <h3 className="zh-title-24">{tripDetail.title}</h3>
                                <p className="zh-text-18">
                                  {tripDetail.highlights?.filter(Boolean).join('、') || ''}
                                </p>
                              </div>
                            </div>

                            {/* 天數 */}
                            <div className="mytrip-card-cell">{tripDetail.days}</div>

                            {/* 費用 */}
                            <div className="mytrip-card-cell trip-price-cell">
 {tripHasWeekend ? (
    <>
      <span className="original-price">
        NT$ {tripDetail.price.toLocaleString()}
      </span>
      <span
        className="surcharge-price"
        title="此行程包含週末，已加價 20%"
      >
        NT$ {finalPrice.toLocaleString()}
      </span>
    </>
  ) : (
    <>NT$ {finalPrice.toLocaleString()}</>
  )}
</div>


                            {/* 人數選擇 */}
                            <div className="mytrip-card-cell people-select">
                              <select
                                value={
                                  editingPeople[trip.tripId] !== undefined
                                    ? parseInt(editingPeople[trip.tripId], 10) > 10
                                      ? 'custom'
                                      : editingPeople[trip.tripId]
                                    : parseInt(trip.peopleCount, 10) > 10
                                      ? 'custom'
                                      : trip.peopleCount || ''
                                }
                                onChange={(e) => handlePeopleChange(trip.tripId, e.target.value)}
                              >
                                <option value="">請選擇</option>
                                {[...Array(10)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1} 位
                                  </option>
                                ))}
                                <option value="custom">10位以上</option>
                              </select>

                              {(editingPeople[trip.tripId] !== undefined ||
                                parseInt(trip.peopleCount, 10) > 10) && (
                                  <input
                                    type="number"
                                    min="11"
                                    value={
                                      editingPeople[trip.tripId] !== undefined
                                        ? editingPeople[trip.tripId]
                                        : trip.peopleCount?.toString() || ''
                                    }
                                    onChange={(e) => handleCustomPeopleChange(trip.tripId, e.target.value)}
                                    onBlur={(e) => handleCustomBlur(trip.tripId, e.target.value)}
                                    className="custom-people-input"
                                  />
                                )}
                            </div>

                            {/* 刪除按鈕 */}
                            <div className="mytrip-card-cell">
                              <button
                                className="circle-btn delete-btn"
                                onClick={() => handleRemoveTrip(trip.tripId)}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>

                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="mytrip-add-trip-wrapper">
            <button className="circle-btn add-btn" onClick={() => navigate('/explore')}>
              ＋
            </button>

          </div>

          <div className="mytrip-summary">
            <p>日期：{startDate ? formatDateToZh(startDate) : '請選擇'} — {endDate ? formatDateToZh(endDate) : '待計算'}</p>
            <p className="trip-price-text">
              價格：
              <strong>NT$ {isNaN(totalPrice) ? 0 : totalPrice.toLocaleString()}</strong>
              {hasSurcharge && (
                <span
                  className="surcharge-badge"
                  title={`週末加價日：${surchargeDates.join('、')}`}
                >
                  含週末加價 🛈
                </span>
              )}

            </p>


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








































