// CartDropdown.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTrips, removeTripFromUser } from '../utils/tripUtils';
import '../styles/CartDropdown.css';

let externalOpenCart = null;
let externalToggleCart = null;

export function setExternalCartControl(openFn, toggleFn) {
  externalOpenCart = openFn;
  externalToggleCart = toggleFn;
}

export function openCartByTripAdd() {
  if (externalOpenCart) {
    externalOpenCart();
  }
}

function CartDropdown() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [autoClosePending, setAutoClosePending] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    loadTrips();
    window.addEventListener('tripCountChanged', loadTrips);
    return () => window.removeEventListener('tripCountChanged', loadTrips);
  }, []);

  function loadTrips() {
    const stored = getUserTrips();
    setTrips(stored);
  }

  useEffect(() => {
    if (isOpen && autoClosePending && !pinned) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!hovering && !pinned) {
          setIsOpen(false);
          setAutoClosePending(false);
        }
      }, 1500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, autoClosePending, hovering, pinned]);

  useEffect(() => {
    setExternalCartControl(
      () => {
        setIsOpen(true);
        setAutoClosePending(true);
      },
      () => {
        setPinned(prev => !prev);
        setIsOpen(prev => !prev);
        setAutoClosePending(false);
      }
    );
  }, []);

  function handleHoverEnter() {
    setHovering(true);
    if (!pinned) {
      setIsOpen(true);
    }
  }

  function handleHoverLeave() {
    setHovering(false);
    if (!pinned && !autoClosePending) {
      setIsOpen(false);
    }
    if (!pinned && autoClosePending) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!hovering && !pinned) {
          setIsOpen(false);
          setAutoClosePending(false);
        }
      }, 1500);
    }
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
    <div
      className="cart-container"
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
      style={{ position: 'relative' }}
    >
      <div className={`cart-dropdown-wrapper ${isOpen ? 'fade-in' : 'fade-out'}`}>
        <div className="cart-dropdown">
          {/* ✅ 新增小三角形用 div，不用::before */}
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




