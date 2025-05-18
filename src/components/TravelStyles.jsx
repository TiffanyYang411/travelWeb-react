// src/components/TravelStyles.jsx

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { travelStyles } from '../data/travelStyles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';
import '../styles/TravelStyles.css';
import '../styles/Typography.css';

function TravelStyles() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const handleExploreClick = () => {
    const styleId = travelStyles[selectedIndex].id;
    if (styleId) {
      navigate(`/explore?style=${styleId}`);
    }
  };

  const handleSlideChange = (swiper) => {
    const index = swiper.realIndex;
    setSelectedIndex(index);

    if (index === 0) {
      const event = new CustomEvent('forceSlideChange');
      window.dispatchEvent(event);
    }
  };

  return (
    <section
      className="travel-style-section"
      style={{ backgroundImage: `url(${travelStyles[selectedIndex].background})` }}
    >
      <div className="overlay" />

      <div className="travel-style-content">
        {/* 左側文字區塊 */}
        <div className="travel-style-text">
          <h2 className="zh-title-48">{travelStyles[selectedIndex].title}</h2>
          <p className="zh-text-20">{travelStyles[selectedIndex].description}</p>
          <button className="explore-btn zh-text-16" onClick={handleExploreClick}>
            探索您的理想旅程
          </button>
        </div>

        {/* 右側滑動卡片區塊（Swiper版） */}
        <div className="travel-style-slider" style={{ maxWidth: '1000px', padding: '0 20px' }}>
          <Swiper
            ref={swiperRef}
            spaceBetween={50}
            grabCursor={true}
            loop={true}
            autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
            speed={6000}
            freeMode={true}
            modules={[Autoplay, FreeMode]}
            onSlideChange={handleSlideChange}
            breakpoints={{
              1024: { slidesPerView: 3, spaceBetween: 40 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              0: { slidesPerView: 1.2, spaceBetween: 20 },
            }}
          >
            {travelStyles.map((item, index) => (
              <SwiperSlide
                key={item.id}
                style={{
                  width: '250px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'transparent',
                  boxShadow: 'none'
                }}
              >
                <div
                  className={`style-card-wrapper ${selectedIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className="style-card-image-wrapper">
                    <img src={item.thumbnail} alt={item.title} className="style-card-img" />
                    <h3 className="style-card-title zh-text-16">{item.title}</h3>
                    {selectedIndex === index && <div className="gradient-overlay" />}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default TravelStyles;














