import { useEffect, useState } from 'react'; // ✅ 正確import
import { useNavigate } from 'react-router-dom';
import { getUserTrips } from '../utils/tripUtils';
import '../styles/TripCustomization.css';
import TripSummaryBar from '../components/TripSummaryBar'; // ✅ 叫的是正確的新版

function TripCustomization() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPeople, setTotalPeople] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const storedTrips = JSON.parse(sessionStorage.getItem('confirmedTrips')) || [];
    const storedStartDate = sessionStorage.getItem('confirmedStartDate') || '';
    const storedEndDate = sessionStorage.getItem('confirmedEndDate') || '';
    const storedTotalPeople = parseInt(sessionStorage.getItem('confirmedTotalPeople'), 10) || 0;
    const storedTotalPrice = parseInt(sessionStorage.getItem('confirmedTotalPrice'), 10) || 0;

    setTrips(storedTrips);
    setStartDate(storedStartDate);
    setEndDate(storedEndDate);
    setTotalPeople(storedTotalPeople);
    setTotalPrice(storedTotalPrice);
  }, []);

  const handleNextStep = () => {
    navigate('/trip-customization/question1');
  };

  return (
    <div className="trip-customization-page">
      <TripSummaryBar
        trips={trips}
        startDate={startDate}
        endDate={endDate}
        totalPeople={totalPeople}
        totalPrice={totalPrice}
      />

      <div className="tripcustom-intro">
        <h2 className="zh-title-36 tripcustom-highlight">即將為您客製化需求</h2>
        <p className="zh-text-20">
          不只是行程規劃，更是專屬您的北歐生活提案。<br />
          我們將根據您的喜好與節奏，量身打造每一站、每一景，讓您感受真正屬於您的北歐之旅。
        </p>
        <button className="tripcustom-next-step-btn zh-text-18" onClick={handleNextStep}>
          下一步 ➔
        </button>
      </div>
    </div>
  );
}

export default TripCustomization;



