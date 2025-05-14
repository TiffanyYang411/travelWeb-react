import { useEffect, useState } from 'react';
import '../styles/UpcomingTrips.css';

function UpcomingTrips() {
  const [upcomingTrips, setUpcomingTrips] = useState([]);

  useEffect(() => {
    const storedTrips = JSON.parse(sessionStorage.getItem('upcomingTrips')) || [];
    setUpcomingTrips(storedTrips);
  }, []);

  return (
    <div className="upcoming-trips-page">
      {upcomingTrips.length === 0 ? (
        <div className="upcoming-trips-empty-message">
          尚未安排任何行程，期待為您策劃專屬旅程！
        </div>
      ) : (
        <div className="upcoming-trips-wrapper">
          {upcomingTrips.map((tripRecord, index) => (
            <div key={index} className="upcoming-trips-record">
              <h2 className="upcoming-trips-serial">{tripRecord.serialNumber}</h2>

              <section className="upcoming-trips-list">
                {tripRecord.trips.map((trip, idx) => (
                  <div key={idx} className="upcoming-trips-card">
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

              <section className="upcoming-trips-customization-section">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpcomingTrips;

