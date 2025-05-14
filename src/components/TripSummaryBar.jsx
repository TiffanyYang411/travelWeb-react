import { useNavigate } from 'react-router-dom';
import { findTripById } from '../utils/findTripById';
import '../styles/TripCustomization.css';

// ✅ 這裡新增一個 formatDate 函式
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

function TripSummaryBar({ trips, startDate, endDate, totalPeople, totalPrice }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/my-trip');
  };

  // 用 findTripById 把 confirmedTrips 裡的 tripId 轉成完整 trip資料
  const enrichedTrips = trips.map(trip => {
    const detail = findTripById(trip.tripId);
    return detail ? { ...detail } : null;
  }).filter(Boolean); // 過濾掉找不到的

  return (
    <div className="tripcustom-summary-bar">
      <div className="tripcustom-summary-trips">
        {enrichedTrips.map((trip, index) => (
          <div key={index} className="tripcustom-summary-item">
            <div className="tripcustom-summary-image-wrapper">
              <img src={trip.bannerImage || trip.banner} alt={trip.title} />
              <div className="tripcustom-summary-overlay">
                <div className="tripcustom-summary-text">
                  <div className="tripcustom-summary-days">{trip.days || ''}</div> {/* 幾天幾夜放上面 */}
                  <div className="tripcustom-summary-title">{trip.title}</div>   {/* 標題放下面 */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="tripcustom-summary-info">
        <div className="tripcustom-info-column">
          <div className="tripcustom-info-label">日期</div>
          <div className="tripcustom-info-value">
            {formatDate(startDate)} - {formatDate(endDate)}
          </div>
        </div>
        <div className="tripcustom-info-column">
          <div className="tripcustom-info-label">人數</div>
          <div className="tripcustom-info-value">{totalPeople} 位</div>
        </div>
        <div className="tripcustom-info-column">
          <div className="tripcustom-info-label">價格</div>
          <div className="tripcustom-info-value">NT$ {totalPrice.toLocaleString()}</div>
        </div>
        <button className="tripcustom-edit-trip-btn" onClick={handleEdit}>
          修改 ➔
        </button>
      </div>
    </div>
  );
}

export default TripSummaryBar;










