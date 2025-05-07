import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTrips, removeTripFromUser } from '../utils/tripUtils';
import '../styles/CartDropdown.css';

function CartDropdown() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTrips = getUserTrips();
    setTrips(storedTrips);
  }, []);

  const handleRemove = (tripId) => {
    removeTripFromUser(tripId);
    const updated = getUserTrips();
    setTrips(updated);
  };

  const handleStartTrip = () => {
    navigate('/my-trip');
  };

  return (
    <div className="cart-dropdown">
      {trips.length === 0 ? (
        <div className="cart-empty">尚未加入任何行程</div>
      ) : (
        <>
          <div className="cart-items">
            {trips.map((trip) => (
              <div className="cart-item" key={trip.id}>
                <img src={trip.bannerImage} alt={trip.title} />
                <div className="cart-item-overlay">
                  <p className="cart-trip-title">{trip.title}</p>
                  <p className="cart-trip-days">{trip.days}</p>
                </div>
                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemove(trip.id)}
                >
                  <span className="minus-icon"></span>
                </button>
              </div>
            ))}
          </div>
          {/* ✅ 這裡是新增的外層容器 */}
          <div className="cart-start-trip-container">
            <button className="cart-start-trip-btn" onClick={handleStartTrip}>
              開始行程
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartDropdown;

