import { useEffect, useState } from 'react';
import '../styles/UpcomingTrips.css';
import { getUserName } from '../utils/auth';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function UpcomingTrips() {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const fetchUpcomingTrips = () => {
    const username = getUserName();
    if (!username) return setUpcomingTrips([]);
    const stored = JSON.parse(localStorage.getItem(`upcomingTrips_${username}`)) || [];
    stored.sort((a, b) => new Date(a.customization.startDate) - new Date(b.customization.startDate));
    setUpcomingTrips(stored);
  };

  useEffect(() => {
    fetchUpcomingTrips();
    window.addEventListener('tripListChanged', fetchUpcomingTrips);
    return () => window.removeEventListener('tripListChanged', fetchUpcomingTrips);
  }, []);

  return (
    <div className="upcoming-page">
      <h2 className="zh-title-36 upcoming-page-title">即將出發</h2>
      {upcomingTrips.length === 0 ? (
        <p className="zh-text-20 upcoming-empty-message">
          目前尚未安排任何行程，請至「探索旅遊風格」頁面挑選您的理想行程！
        </p>
      ) : (
        <div className="upcoming-record-wrapper">
          {upcomingTrips.map((record, index) => (
            <div key={index} className="upcoming-record">
              <div className="upcoming-serial-bar">
                <div className="upcoming-serial-tag">{record.serialNumber}</div>
              </div>

              <div className="upcoming-record-card">
                {/* 左側旅程縮圖 */}
                <div className="upcoming-trip-thumbnails">
                  {record.trips.map((trip, i) => (
                    <div key={i} className="upcoming-thumb-item">
                      <img src={trip.banner} alt={trip.title} />
                      <div className="upcoming-thumb-overlay">
                        <div className="upcoming-thumb-text">
                          <div className="upcoming-thumb-days">{trip.days}</div>
                          <div className="upcoming-thumb-title">{trip.title}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 右側旅程資訊 */}
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
                    {expandedIndex === index ? '收起 ▲' : '展開 ▼'}
                  </button>
                </div>
              </div>

              {/* 展開區塊 */}
              {expandedIndex === index && (
                <div className="upcoming-expanded-wrapper">
                  <section className="upcoming-trip-detail-list">
                    {record.trips.map((trip, idx) => (
                      <div key={idx} className="upcoming-trip-detail">
                        <img src={trip.banner} alt={trip.title} />
                        <div>
                          <h3 className="upcoming-detail-title">{trip.title}</h3>
                          <p className="upcoming-detail-days">{trip.days}</p>
                          <ul className="upcoming-highlight-list">
                            {trip.highlights?.filter(Boolean).map((hl, i) => (
                              <li key={i}>{hl}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </section>

                  <section className="upcoming-customization">
                    <h3 className="upcoming-custom-title">客製化需求</h3>
                    <ul className="upcoming-custom-list">
                      {Object.entries(record.customization)
                        .filter(([k, v]) => (typeof v === 'string' ? v.trim() !== '' && v !== '否' : v === true))
                        .map(([k, v], idx) => (
                          <li key={idx}>
                            <strong>{k}：</strong>
                            {String(v)}
                          </li>
                        ))}
                    </ul>
                  </section>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpcomingTrips;







