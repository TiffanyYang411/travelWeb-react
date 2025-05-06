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
                <img src={trip.banner} alt={trip.title} className="trip-thumb" />
                <div className="trip-info">
                  <span className="trip-title">{trip.title}</span>
                  <span className="trip-days">{trip.days}</span>
                  <span className="trip-price">NT${trip.price.toLocaleString()}</span>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(trip.id)}
                >
                  −
                </button>
              </div>
            ))}
          </div>
          <button className="cart-start-trip-btn" onClick={handleStartTrip}>
            開始行程
          </button>
        </>
      )}
    </div>
  );
}

export default CartDropdown;
