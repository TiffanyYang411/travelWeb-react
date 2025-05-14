// CartDropdown.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTrips, removeTripFromUser } from '../utils/tripUtils';
import { useTripStore } from '../store/useTripStore'; // ✅ 加這行
import { findTripById } from '../utils/findTripById'; // ✅ 要確定有引入這行
import '../styles/CartDropdown.css';

function CartDropdown({ isOpen }) {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const { pendingTrips, setPendingTrips } = useTripStore(); // ✅ 加這行

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

  const updatedTrips = pendingTrips.filter((trip) => trip.tripId !== tripId);
  setPendingTrips(updatedTrips);

  sessionStorage.setItem('confirmedTrips', JSON.stringify(updatedTrips));

  if (updatedTrips.length > 0) {
    let totalDays = 0;
    let totalPeople = 0;
    let totalPrice = 0;

    updatedTrips.forEach(trip => {
      const detail = findTripById(trip.tripId); // ← 🔥 改成找完整資料
      if (detail) {
        const match = detail.days?.match(/(\d+)\s*天/);
        const days = match ? parseInt(match[1], 10) : 0;
        const people = trip.peopleCount ? parseInt(trip.peopleCount, 10) : 0;
        const price = detail.price ? parseInt(detail.price, 10) : 0;

        totalDays += days;
        totalPeople += people;
        totalPrice += price * people;
      }
    });

    const storedStartDate = sessionStorage.getItem('confirmedStartDate');
    if (storedStartDate) {
      const start = new Date(storedStartDate);
      const end = new Date(start);
      end.setDate(start.getDate() + totalDays - 1);

      const formattedEndDate = `${end.getFullYear()}/${(end.getMonth() + 1).toString().padStart(2, '0')}/${end.getDate().toString().padStart(2, '0')}`;

      sessionStorage.setItem('confirmedEndDate', formattedEndDate);
    }

    sessionStorage.setItem('confirmedTotalPeople', totalPeople.toString());
    sessionStorage.setItem('confirmedTotalPrice', totalPrice.toString());
  } else {
    sessionStorage.removeItem('confirmedStartDate');
    sessionStorage.removeItem('confirmedEndDate');
    sessionStorage.removeItem('confirmedTotalPeople');
    sessionStorage.removeItem('confirmedTotalPrice');
  }

  window.dispatchEvent(new Event('tripCountChanged'));
  window.dispatchEvent(new Event('confirmedTripsChanged'));
}



  function handleStartTrip() {
    navigate('/my-trip');
  }

  return (
    <div className="cart-container" style={{ position: 'relative' }}>
      <div
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







