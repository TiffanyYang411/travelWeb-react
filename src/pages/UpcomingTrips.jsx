import { useEffect, useState } from 'react';
import '../styles/UpcomingTrips.css';
import { getUserName } from '../utils/auth';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function UpcomingTrips() {
  usePageTitle('即將出發');
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [dayIndexes, setDayIndexes] = useState({});

  const fetchUpcomingTrips = () => {
    const username = getUserName();
    if (!username) return setUpcomingTrips([]);
    const stored = JSON.parse(localStorage.getItem(`upcomingTrips_${username}`)) || [];
    stored.sort((a, b) => new Date(a.customization.startDate) - new Date(b.customization.startDate));
    setUpcomingTrips(stored);

    const defaultIndexes = {};
    stored.forEach((record) => {
      record.trips.forEach((trip) => {
        defaultIndexes[trip.id] = 0;
      });
    });
    setDayIndexes(defaultIndexes);
  };

  useEffect(() => {
    fetchUpcomingTrips();
    window.addEventListener('tripListChanged', fetchUpcomingTrips);
    return () => window.removeEventListener('tripListChanged', fetchUpcomingTrips);
  }, []);

  const handleDayChange = (tripId, direction, max) => {
    setDayIndexes((prev) => {
      const current = prev[tripId] ?? 0;
      let next = direction === 'next' ? current + 1 : current - 1;
      if (next < 0) next = 0;
      if (next >= max) next = max - 1;
      return { ...prev, [tripId]: next };
    });
  };

  return (
    <div className="upcoming-page">
      <h2 className="zh-title-32 upcoming-page-title">即將出發</h2>
      {upcomingTrips.length === 0 ? (
        <p className="zh-text-20 upcoming-empty-message">
          目前尚未安排任何行程，<br />請至「探索旅遊風格」頁面挑選您的理想行程！
        </p>
      ) : (
        <div className="upcoming-record-wrapper">
          {upcomingTrips.map((record, index) => {
            let start = new Date(record.customization.startDate);
            return (
              <div key={index} className="upcoming-record">
                <div className="upcoming-serial-bar">
                  <div className="upcoming-serial-tag">{record.serialNumber}</div>
                </div>

                <div className="upcoming-record-card">
                  <div className="upcoming-trip-thumbnails">
                    {record.trips.map((trip, i) => (
                      <div key={i} className="upcoming-thumb-item">
                        <img src={trip.bannerImage} alt={trip.title} />
                        <div className="upcoming-thumb-overlay">
                          <div className="upcoming-thumb-text">
                            <div className="upcoming-thumb-days">{trip.days}</div>
                            <div className="upcoming-thumb-title">{trip.title}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="upcoming-info-columns">
                    <div className="tripcustom-info-column">
                      <div className="tripcustom-info-label">日期</div>
                      <div className="tripcustom-info-value">
                        {formatDate(record.customization.startDate)} - {formatDate(record.customization.endDate)}
                      </div>
                    </div>
                    <div className="tripcustom-info-column">
                      <div className="tripcustom-info-label">人數</div>
                      <div className="tripcustom-info-value">{record.customization.totalPeople} 位</div>
                    </div>
                    <div className="tripcustom-info-column">
                      <div className="tripcustom-info-label">價格</div>
                      <div className="tripcustom-info-value">
                        NT$ {Number(record.customization.totalPrice).toLocaleString()}
                      </div>
                    </div>
                    <button
  className="upcoming-expand-btn"
  onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
>
  {expandedIndex === index ? (
    <>
      收起 <FiChevronUp className="expand-icon" />
    </>
  ) : (
    <>
      展開 <FiChevronDown className="expand-icon" />
    </>
  )}
</button>

                  </div>
                </div>

                {expandedIndex === index && (
                  <div className="upcoming-expanded-wrapper">
                    <h3 className="upcoming-subtitle">我的行程</h3>
                    {record.trips.map((trip, idx) => {
                      const match = trip.days?.match(/(\d+)/);
                      const tripDays = match ? parseInt(match[1], 10) : 0;
                      const tripStart = new Date(start);
                      const tripEnd = new Date(start);
                      tripEnd.setDate(tripEnd.getDate() + tripDays - 1);

                      const hasWeekend = Array.from({ length: tripDays }).some((_, d) => {
                        const day = new Date(tripStart);
                        day.setDate(day.getDate() + d);
                        const dow = day.getDay();
                        return dow === 0 || dow === 6;
                      });

                      const price = hasWeekend ? Math.round(trip.price * 1.2) : trip.price;
                      const originalPrice = trip.price;

                      const schedules = (trip.itinerary || [])
                        .filter(d => d.desc || d.image) // ✅ 過濾空日
                        .map((dayObj, i) => {
                          const lines = String(dayObj.desc ?? '').split('\n').map(l => l.trim()).filter(Boolean);
                          let current = '';
                          let morning = '', afternoon = '', evening = '';

                          lines.forEach((line) => {
                            if (/^清晨|上午/.test(line)) current = 'morning';
                            else if (/^中午|下午/.test(line)) current = 'afternoon';
                            else if (/^傍晚|晚上/.test(line)) current = 'evening';
                            else if (current) {
                              if (current === 'morning') morning += line + ' ';
                              if (current === 'afternoon') afternoon += line + ' ';
                              if (current === 'evening') evening += line + ' ';
                            }
                          });

                          return {
                            day: i + 1,
                            morning: morning.trim(),
                            afternoon: afternoon.trim(),
                            evening: evening.trim(),
                            image: dayObj.image
                          };
                        });


                      const dayIndex = dayIndexes[trip.id] ?? 0;
                      const safe = Math.min(dayIndex, schedules.length - 1);
                      const sch = schedules[safe] || {}; // fallback 保險

                      start.setDate(start.getDate() + tripDays);

                      return (
                        <div key={trip.id} className="upcoming-trip-detail">
                          <div className="trip-summary-index-wrapper">
                            <h3 className="upcoming-trip-index-label">第{['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][idx]}個行程</h3>
                          </div>
                          <img src={`${import.meta.env.BASE_URL}${sch.image?.replace('./', '')}`} alt="day" className="upcoming-trip-img" />
                          <div className="upcoming-trip-content">
                            <div className="upcoming-detail-days">{trip.days}</div>
                            <div className="upcoming-detail-title">{trip.title}</div>
                            <div className="upcoming-highlight-label">行程亮點：</div>
                            <div className="upcoming-highlight-list">{trip.highlights?.filter(Boolean).join('、')}</div>
                            <div className="upcoming-trip-dates">{formatDate(tripStart)} ～ {formatDate(tripEnd)}</div>
                            <div className="upcoming-price-wrapper">
                              {hasWeekend && (
                                <span className="upcoming-price-original">NT$ {originalPrice.toLocaleString()}</span>
                              )}
                              <span className="upcoming-price-current">NT$ {price.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="upcoming-schedule">
                            <div className="upcoming-schedule-header">
                              <button disabled={safe <= 0} onClick={() => handleDayChange(trip.id, 'prev', schedules.length)}>
                                <img src={`${import.meta.env.BASE_URL}images/tripSummary-arrow-left.svg`} className="upcoming-arrow-left" />
                              </button>
                              <div className="upcoming-day-label">第 {safe + 1} 天</div>
                              <button disabled={safe >= schedules.length - 1} onClick={() => handleDayChange(trip.id, 'next', schedules.length)}>
                                <img src={`${import.meta.env.BASE_URL}images/tripSummary-arrow-right.svg`} className="upcoming-arrow-right" />
                              </button>
                            </div>
                            <div className="upcoming-schedule-detail">
                              {sch.morning && <div className="upcoming-schedule-item"><div className="upcoming-schedule-time">上午</div><div className="upcoming-schedule-desc">{sch.morning}</div></div>}
                              {sch.afternoon && <div className="upcoming-schedule-item"><div className="upcoming-schedule-time">下午</div><div className="upcoming-schedule-desc">{sch.afternoon}</div></div>}
                              {sch.evening && <div className="upcoming-schedule-item"><div className="upcoming-schedule-time">晚上</div><div className="upcoming-schedule-desc">{sch.evening}</div></div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <section className="upcoming-customization">
                      <h3 className="upcoming-custom-title">客製化</h3>
                      <ul className="upcoming-custom-list">
                        {[
                          { label: '人數', key: 'totalPeople', value: record.customization.totalPeople + ' 人' },
                          { label: '費用', key: 'totalPrice', value: 'NT$ ' + Number(record.customization.totalPrice).toLocaleString() },
                          { label: '專屬導遊 / 私人導覽', key: '1' },
                          { label: '豪華專車接送', key: '2' },
                          { label: '升級住宿', key: '3' },
                          { label: '飲食需求', key: '4', value: record.customization.foodNote },
                          { label: '姓名', key: 'name' },
                          { label: 'Email', key: 'email' },
                          { label: '聯絡電話', key: 'phone' },
                          { label: '其他特別需求', key: 'specialRequest' },
                        ]
                          .map(({ label, key, value }) => {
                            const selected = record.customization[key];

                            if (['1', '2', '3', '4'].includes(key)) {
                              if (selected === 'yes' && value) {
                                return (
                                  <li key={key}>
                                    <strong>{label}：</strong>
                                    <div>是，{value}</div>
                                  </li>
                                );
                              }
                              if (selected === 'yes') {
                                return (
                                  <li key={key}>
                                    <strong>{label}：</strong>
                                    <div>是</div>
                                  </li>
                                );
                              }
                              return null;
                            }

                            // 其他欄位顯示非空值
                            if (!selected || selected === 'no') return null;

                            return (
                              <li key={key}>
                                <strong>{label}：</strong>
                                <div>{value || selected}</div>
                              </li>
                            );
                          })}
                      </ul>
                    </section>


                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UpcomingTrips;








