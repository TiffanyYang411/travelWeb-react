// === 新增 utils/serialNumber.js ===
export function generateSerialNumber() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    let currentSerial = parseInt(localStorage.getItem('serialNumber') || '0', 10);
    currentSerial += 1;
    localStorage.setItem('serialNumber', currentSerial);

    const serial = String(currentSerial).padStart(4, '0');

    return `AWELLA${yyyy}${mm}${dd}${serial}`;
}

// === TripSummary.jsx ===
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSerialNumber } from '../utils/serialNumber';
import '../styles/TripSummary.css';
import { clearCart } from '../utils/tripUtils'; // ✅ 你之前有tripUtils可以放這個清空功能

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
                <div className="popup">
                    <p>您的行程已確認！<br />策劃師將於24小時聯繫<br />請前往「即將出發」頁面查看相關訊息</p>
                </div>
            )}

            {!showPopup && (
                <div className="trip-summary-wrapper">
                    <h2>{serialNumber}</h2>

                    <section className="trip-list">
                        {trips.map((trip, index) => (
                            <div key={index} className="trip-card">
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

                    <section className="customization-section">
                        <h3>客製化需求</h3>
                        <ul>
                            {filteredCustomization.map(([key, value], index) => (
                                <li key={index}><strong>{key}：</strong>{String(value)}</li>
                            ))}
                        </ul>
                    </section>

                    <button className="confirm-button" onClick={handleConfirm}>確認送出</button>
                </div>
            )}
        </div>
    );
}

export default TripSummary;
