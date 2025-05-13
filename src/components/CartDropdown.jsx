// CartDropdown.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTrips, removeTripFromUser } from '../utils/tripUtils';
import '../styles/CartDropdown.css';

function CartDropdown({ isOpen }) {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    loadTrips();
    window.addEventListener('tripCountChanged', loadTrips);
    return () => window.removeEventListener('tripCountChanged', loadTrips);
  }, []);

  function loadTrips() {
    const stored = getUserTrips();
    setTrips(stored);
  }

  function handleRemove(tripId) {
    removeTripFromUser(tripId);
    loadTrips();
    window.dispatchEvent(new Event('tripCountChanged'));
  }

  function handleStartTrip() {
    navigate('/my-trip');
  }

  return (
    <div className="cart-container" style={{ position: 'relative' }}>
      <div
        // className="cart-dropdown-wrapper"
        // style={{ display: isOpen ? 'block' : 'none' }}
        className={`cart-dropdown-wrapper ${isOpen ? 'fade-in' : 'fade-out'}`}
        style={{
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
          visibility: isOpen ? 'visible' : 'hidden'
        }}
      >
        <div className="cart-dropdown">
          <div className="cart-triangle"></div>

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
              <div className="cart-start-trip-container">
                <button className="cart-start-trip-btn" onClick={handleStartTrip}>
                  開始行程
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartDropdown;






