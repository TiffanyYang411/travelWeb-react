import { useNavigate } from 'react-router-dom';
import '../styles/TripCustomization.css'; // ✅ 你現在用 TripCustomization.css

function TripSummaryBar({ trips, startDate, endDate, totalPeople, totalPrice }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/my-trip');
  };

  return (
    <div className="tripcustom-summary-bar">
      <div className="tripcustom-summary-trips">
        {trips.map((trip, index) => (
          <div key={index} className="tripcustom-summary-item">
            <img src={trip.bannerImage || trip.banner} alt={trip.title} />
            <div className="tripcustom-summary-texts">
              <div className="tripcustom-summary-days">{trip.days || ''}</div>
              <div className="tripcustom-summary-title">{trip.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="tripcustom-summary-info">
        <div className="tripcustom-info-column">
          <div className="tripcustom-info-label">日期</div>
          <div className="tripcustom-info-value">{startDate} - {endDate}</div>
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




