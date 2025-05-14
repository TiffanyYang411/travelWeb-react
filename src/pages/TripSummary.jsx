import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSerialNumber } from '../utils/serialNumber';
import '../styles/TripSummary.css';
import { clearCart } from '../utils/tripUtils'; // 這是你之前清購物車用的

function TripSummary() {
  const navigate = useNavigate();
  const [serialNumber, setSerialNumber] = useState('');
  const [trips, setTrips] = useState([]);
  const [customization, setCustomization] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const confirmedTrips = JSON.parse(sessionStorage.getItem('confirmedTrips')) || [];
    const customizationData = JSON.parse(sessionStorage.getItem('customizationData')) || {};

    setSerialNumber(generateSerialNumber());
    setTrips(confirmedTrips);
    setCustomization(customizationData);
  }, []);

  const handleConfirm = () => {
    const upcomingTrips = JSON.parse(sessionStorage.getItem('upcomingTrips')) || [];
    const newTripRecord = {
      serialNumber,
      trips,
      customization,
    };

    sessionStorage.setItem('upcomingTrips', JSON.stringify([...upcomingTrips, newTripRecord]));

    sessionStorage.removeItem('confirmedTrips');
    sessionStorage.removeItem('customizationData');
    clearCart();

    setShowPopup(true);
    setTimeout(() => {
      navigate('/upcoming-trips');
    }, 3000);
  };

  const filteredCustomization = Object.entries(customization).filter(([key, value]) => {
    if (typeof value === 'string') {
      return value.trim() !== '' && value !== '否';
    }
    return value === true;
  });

  return (
    <div className="trip-summary-page">
      {showPopup && (
        <div className="trip-summary-popup">
          <p>您的行程已確認！<br/>策劃師將於24小時聯繫<br/>請前往「即將出發」頁面查看相關訊息</p>
        </div>
      )}

      {!showPopup && (
        <div className="trip-summary-wrapper">
          <h2 className="trip-summary-title">{serialNumber}</h2>

          <section className="trip-summary-list">
            {trips.map((trip, index) => (
              <div key={index} className="trip-summary-card">
                <img src={trip.banner} alt={trip.title} />
                <div>
                  <h3>{trip.title}</h3>
                  <p>{trip.days}</p>
                  <ul>
                    {trip.highlights && trip.highlights.filter(Boolean).map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </section>

          <section className="trip-summary-customization-section">
            <h3>客製化需求</h3>
            <ul>
              {filteredCustomization.map(([key, value], index) => (
                <li key={index}><strong>{key}：</strong>{String(value)}</li>
              ))}
            </ul>
          </section>

          <button className="trip-summary-confirm-button" onClick={handleConfirm}>確認送出</button>
        </div>
      )}
    </div>
  );
}

export default TripSummary;
