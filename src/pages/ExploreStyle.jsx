// src/pages/ExploreStyle.jsx
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { travelStyles } from '../data/travelStyles';
import { tripData } from '../data/tripData';
import '../styles/ExploreStyle.css';
import '../styles/Typography.css';
import ExploreTripCard from '../components/ExploreTripCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css';

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

  const [showTripCards, setShowTripCards] = useState(false);
  const tripCardRef = useRef(null);
  const swiperRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedStyleIndex]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const direction = currentY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = currentY;

      const midpoint = window.innerHeight * 0.5;

      if (direction === 'down' && currentY > midpoint) {
        setShowTripCards(true);
      } else if (direction === 'up' && currentY < midpoint) {
        setShowTripCards(false);
        swiperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showTripCards && tripCardRef.current) {
      tripCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showTripCards]);

  return (
    <section className="explore-style">
      {/* 上方風格切換 Swiper 區塊 */}
      <div ref={swiperRef} className="explore-swiper-wrapper">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          grabCursor={true}
          loop={true}
          modules={[Navigation]}
          speed={800}
          centeredSlides={true}
          onSlideChange={(swiper) => {
            setSelectedStyleIndex(swiper.realIndex);
            setActiveTripIndex(null);
          }}
          navigation={{
            nextEl: '.explore-swiper-next',
            prevEl: '.explore-swiper-prev',
          }}
        >
          {travelStyles.map((style, index) => (
            <SwiperSlide key={style.id} style={{ width: '100vw', height: '100vh' }}>
              <div className={`explore-style-card ${selectedStyleIndex === index ? 'active' : ''}`}>
                <img src={style.exploreImage} alt={style.title} />
                <div className="explore-style-overlay">
                  <h2 className="zh-title-48">{style.title}</h2>
                  <p className="zh-text-24">{style.description}</p>
                </div>
                <div className="scroll-up-indicator">
                  <div className="chevron"></div>
                  <div className="chevron"></div>
                  <div className="chevron"></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 左右箭頭按鈕 */}
        <div className="explore-swiper-prev swiper-arrow">‹</div>
        <div className="explore-swiper-next swiper-arrow">›</div>
      </div>

      {/* 卡片橫向滑動清單 */}
      <div ref={tripCardRef} className={`explore-trip-card-wrapper ${showTripCards ? 'visible' : 'hidden'}`}>
        <div className="explore-trip-card-container">
          {filteredTrips.map((trip, index) => (
            <ExploreTripCard
              key={trip.id}
              trip={trip}
              onClick={() => setActiveTripIndex(index)}
              isActive={index === activeTripIndex}
              className={`explore-trip-card ${showTripCards ? 'show delay-' + index : ''}`}
            />
          ))}
        </div>
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















