import { useEffect, useState } from 'react';
import '../styles/UpcomingTrips.css';
import { getUserName } from '../utils/auth';
import usePageTitle from '../hooks/usePageTitle';

function PastTrips() {
  usePageTitle('歷史行程');
  const [pastTrips, setPastTrips] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(0); // ✅ 預設展開第一筆

  const fetchPastTrips = () => {
    const username = getUserName();
    if (!username) {
      setPastTrips([]);
      return;
    }
    const storedTrips = JSON.parse(localStorage.getItem(`pastTrips_${username}`)) || [];

    // ✅ 根據 startDate 排序（升冪）
    storedTrips.sort((a, b) => {
      const dateA = new Date(a.customization.startDate);
      const dateB = new Date(b.customization.startDate);
      return dateA - dateB;
    });

    setPastTrips(storedTrips);
  };

  useEffect(() => {
    fetchPastTrips();
    window.addEventListener('tripListChanged', fetchPastTrips);
    return () => window.removeEventListener('tripListChanged', fetchPastTrips);
  }, []);

  return (
    <div className="upcoming-page">
      <h2 className="zh-title-32 upcoming-page-title">歷史行程</h2>
      {pastTrips.length === 0 ? (
        <p className="zh-text-20 upcoming-empty-message">
          尚無歷史行程紀錄
        </p>
      ) : (
        <div className="upcoming-record-wrapper">
          {pastTrips.map((tripRecord, index) => (
            <div key={index} className="upcoming-record">
              <div className="upcoming-summary-bar">
                <span className="upcoming-serial-tag">{tripRecord.serialNumber}</span>
                <div className="upcoming-summary-trips">
                  {tripRecord.trips.map((trip, i) => (
                    <div key={i} className="upcoming-trip-thumb">
                      <div className="upcoming-thumb-image-wrapper">
                        <img src={trip.banner} alt={trip.title} />
                        <div className="upcoming-thumb-overlay">
                          <div className="upcoming-thumb-text">
                            <div className="upcoming-days">{trip.days}</div>
                            <div className="upcoming-title">{trip.title}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="upcoming-summary-info">
                  <div className="upcoming-info-column">
                    <div className="upcoming-info-label">日期</div>
                    <div className="upcoming-info-value">{tripRecord.customization.startDate} ~ {tripRecord.customization.endDate}</div>
                  </div>
                  <div className="upcoming-info-column">
                    <div className="upcoming-info-label">人數</div>
                    <div className="upcoming-info-value">{tripRecord.customization.totalPeople} 位</div>
                  </div>
                  <div className="upcoming-info-column">
                    <div className="upcoming-info-label">價格</div>
                    <div className="upcoming-info-value">NT$ {Number(tripRecord.customization.totalPrice).toLocaleString()}</div>
                  </div>
                </div>
                <button className="upcoming-expand-btn" onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}>
                  {expandedIndex === index ? '收起 ▲' : '展開 ▼'}
                </button>
              </div>

              {expandedIndex === index && (
                <>
                  <section className="upcoming-expanded-list">
                    {tripRecord.trips.map((trip, idx) => (
                      <div key={idx} className="upcoming-trip-detail">
                        <img src={trip.banner} alt={trip.title} />
                        <div>
                          <h3>{trip.title}</h3>
                          <p>{trip.days}</p>
                          <ul>
                            {trip.highlights && trip.highlights.filter(Boolean).map((highlight, i) => (
                              <li key={i}>{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </section>

                  <section className="upcoming-custom-section">
                    <h3>客製化需求</h3>
                    <ul>
                      {Object.entries(tripRecord.customization).filter(([key, value]) => {
                        if (typeof value === 'string') {
                          return value.trim() !== '' && value !== '否';
                        }
                        return value === true;
                      }).map(([key, value], idx) => (
                        <li key={idx}><strong>{key}：</strong>{String(value)}</li>
                      ))}
                    </ul>
                  </section>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PastTrips;
