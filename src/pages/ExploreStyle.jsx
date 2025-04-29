// src/pages/ExploreStyle.jsx
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { travelStyles } from '../data/travelStyles';
import { tripData } from '../data/tripData';
import '../styles/ExploreStyle.css';
import '../styles/Typography.css';
import ExploreTripCard from '../components/ExploreTripCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

function ExploreStyle() {
  const [searchParams] = useSearchParams();
  const styleParam = parseInt(searchParams.get('style'));
  const initialIndex = travelStyles.findIndex(style => style.id === styleParam);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const selectedStyle = travelStyles[selectedStyleIndex];

  const filteredStyleTrips = tripData.find(item => item.styleId === selectedStyle.id);
  const filteredTrips = filteredStyleTrips ? filteredStyleTrips.trips : [];

  const [activeTripIndex, setActiveTripIndex] = useState(null);
  const activeTrip = filteredTrips[activeTripIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedStyleIndex]);

  return (
    <section className="explore-style">
      {/* 上方風格切換 Swiper 區塊 */}
      <div className="explore-swiper-wrapper">
        <Swiper
          slidesPerView="auto"
          spaceBetween={40}
          grabCursor={true}
          loop={true}
          freeMode={true}
          modules={[FreeMode]}
          speed={800}
        >
          {travelStyles.map((style, index) => (
            <SwiperSlide key={style.id}>
              <div
                className={`explore-style-card ${selectedStyleIndex === index ? 'active' : ''}`}
                onClick={() => {
                  setSelectedStyleIndex(index);
                  setActiveTripIndex(null);
                }}
              >
                <img src={style.thumbnail} alt={style.title} />
                <p>{style.title}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 往上滑提示圖示 */}
      <div className="scroll-up-indicator">
        <img src="./images/mouse-up-icon.svg" alt="Scroll Up" />
      </div>

      {/* 卡片橫向滑動清單 */}
      <div className="explore-trip-card-container">
        {filteredTrips.map((trip, index) => (
          <ExploreTripCard
            key={trip.id}
            trip={trip}
            onClick={() => setActiveTripIndex(index)}
            isActive={index === activeTripIndex}
            className="explore-trip-card"
          />
        ))}
      </div>

      {/* 展開旅程詳細區塊 */}
      {activeTrip && (
        <div className="trip-detail">
          <h2>{activeTrip.title}・{activeTrip.days}</h2>
          <p className="price">NT${activeTrip.price.toLocaleString()}／人</p>
          <p className="highlight">行程亮點：{activeTrip.highlights.join('、')}</p>
          <img className="trip-main-img" src={activeTrip.banner} alt="旅程圖片" />

          <div className="itinerary-wrapper">
            {activeTrip.itinerary.map((day, idx) => (
              <div key={idx} className="itinerary-day">
                <div className="itinerary-day-label">{day.day}</div>
                <div className="itinerary-text">
                  <p>{day.desc}</p>
                  <img src={day.image} alt={`Day ${day.day}`} />
                </div>
              </div>
            ))}
          </div>

          <button className="add-btn">加入行程</button>
        </div>
      )}
    </section>
  );
}

export default ExploreStyle;





  