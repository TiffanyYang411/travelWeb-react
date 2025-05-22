import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSerialNumber } from '../utils/serialNumber';
import '../styles/TripSummary.css';
import { clearCart } from '../utils/tripUtils';
import { tripData } from '../data/tripData';

function TripSummary() {
  const navigate = useNavigate();
  const [serialNumber, setSerialNumber] = useState('');
  const [trips, setTrips] = useState([]);
  const [customization, setCustomization] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [dayIndexes, setDayIndexes] = useState({});

  useEffect(() => {
    sessionStorage.setItem('tripSummary', JSON.stringify({
      trips: [{ tripId: 101, peopleCount: 2 }],
      formData: {
        name: '測試用',
        email: 'test@example.com',
        phone: '123456789'
      },
      options: {
        '1': 'yes',
        '2': 'no',
        '3': 'no',
        '4': 'no'
      },
      foodNote: '無',
      specialRequest: '無',
      startDate: '2025-06-01',
      endDate: '2025-06-05',
      totalPeople: 2,
      totalPrice: 152400
    }));

    const summaryData = JSON.parse(sessionStorage.getItem('tripSummary')) || {};
    setSerialNumber(generateSerialNumber());

    const allTrips = tripData.flatMap(style => style.trips);
    const transformedTrips = (summaryData.trips || []).map(({ tripId, peopleCount }) => {
      const trip = allTrips.find(t => Number(t.id) === Number(tripId));
      if (!trip) return null;

      const daySchedules = (trip.itinerary || []).map((dayObj, index) => {
        const lines = dayObj.desc.split('\n').map(l => l.trim()).filter(Boolean);
        let current = '';
        let morning = '', afternoon = '', evening = '';

        lines.forEach((line) => {
          if (/^清晨|上午/.test(line)) current = 'morning';
          else if (/^中午|下午/.test(line)) current = 'afternoon';
          else if (/^傍晚|晚上/.test(line)) current = 'evening';
          else if (current) {
            if (current === 'morning') morning += line + ' ';
            if (current === 'afternoon') afternoon += line + ' ';
            if (current === 'evening') evening += line + ' ';
          }
        });

        return {
          day: index + 1,
          morning: morning.trim(),
          afternoon: afternoon.trim(),
          evening: evening.trim(),
          image: dayObj.image
        };
      });

      return {
        ...trip,
        peopleCount,
        daySchedules
      };
    }).filter(Boolean);

    setTrips(transformedTrips);
    const defaultIndexes = {};
    transformedTrips.forEach(t => {
      defaultIndexes[t.id] = 0;
    });
    setDayIndexes(defaultIndexes);
    setCustomization({
      ...summaryData.formData,
      ...summaryData.options,
      foodNote: summaryData.foodNote,
      specialRequest: summaryData.specialRequest,
      startDate: summaryData.startDate,
      endDate: summaryData.endDate,
      totalPeople: summaryData.totalPeople,
      totalPrice: summaryData.totalPrice,
    });
  }, []);

  const handleDayChange = (tripId, direction, max) => {
    setDayIndexes(prev => {
      const current = prev[tripId] || 0;
      let next = direction === 'next' ? current + 1 : current - 1;
      next = Math.max(0, Math.min(max - 1, next));
      return { ...prev, [tripId]: next };
    });
  };

  const handleConfirm = () => {
    const upcomingTrips = JSON.parse(sessionStorage.getItem('upcomingTrips')) || [];
    const newTripRecord = {
      serialNumber,
      trips,
      customization,
    };

    sessionStorage.setItem('upcomingTrips', JSON.stringify([...upcomingTrips, newTripRecord]));
    sessionStorage.removeItem('tripSummary');
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
          <p>您的行程已確認！<br />策劃師將於24小時聯繫<br />請前往「即將出發」頁面查看相關訊息</p>
        </div>
      )}

      {!showPopup && (
        <div className="trip-summary-wrapper">
          <div className="trip-summary-title-block">
            <h2 className="trip-summary-title-code">{serialNumber}</h2>
            <p className="trip-summary-title-date">
              日期：{customization.startDate} ～ {customization.endDate}
            </p>
          </div>

          <section className="trip-summary-section">
            <h3 className="trip-summary-subtitle">我的行程</h3>
            {trips.map((trip, index) => {
              const currentIndex = dayIndexes[trip.id] || 0;
              const currentDay = trip.daySchedules[currentIndex];

              return (
                <div key={trip.id} className="trip-summary-tripbox">
                  <div className="trip-summary-left">
                    <p className="trip-summary-index">第一個行程</p>
                    <img
                      src={`${import.meta.env.BASE_URL}${currentDay.image.replace('./', '')}`}
                      alt={`Day ${currentDay.day}`}
                      className="trip-summary-img"
                    />
                    <div className="trip-summary-info-block">
                      <p className="trip-summary-tripdays">{trip.days}</p>
                      <h4 className="trip-summary-tripname">{trip.title}</h4>
                      <p className="trip-summary-highlight-title">行程亮點：</p>
                      <p className="trip-summary-highlight-list">
                        {trip.highlights?.filter(Boolean).join('，')}
                      </p>
                    </div>
                  </div>
                  <div className="trip-summary-right">
                    <div className="day-switcher">
                      <button onClick={() => handleDayChange(trip.id, 'prev', trip.daySchedules.length)}>←</button>
                      <span>第 {currentDay.day} 天</span>
                      <button onClick={() => handleDayChange(trip.id, 'next', trip.daySchedules.length)}>→</button>
                    </div>

                    <div className="trip-summary-schedule-block">
                      <p><strong>上午：</strong>{currentDay.morning || '無行程'}</p>
                      <p><strong>下午：</strong>{currentDay.afternoon || '無行程'}</p>
                      <p><strong>晚上：</strong>{currentDay.evening || '無行程'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="trip-summary-section">
            <h3 className="trip-summary-subtitle">客製化</h3>
            <ul className="trip-summary-custom-list">
              <li>人數：{customization.totalPeople} 人</li>
              <li>費用：NT$ {Number(customization.totalPrice).toLocaleString()}</li>
              {filteredCustomization.map(([key, value], index) => (
                <li key={index}><strong>{key}：</strong>{String(value)}</li>
              ))}
            </ul>
          </section>

          <button className="trip-summary-confirm" onClick={handleConfirm}>確認送出 ➔</button>
        </div>
      )}
    </div>
  );
}

export default TripSummary;



