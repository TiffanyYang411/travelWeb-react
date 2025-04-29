// src/components/TravelStyles.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { travelStyles } from '../data/travelStyles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import '../styles/TravelStyles.css';
import '../styles/Typography.css';

function TravelStyles() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const selectedStyle = travelStyles[selectedIndex];

  const handleExploreClick = () => {
    const styleId = selectedStyle.id;
    if (styleId) {
      navigate(`/explore?style=${styleId}`);
    }
  };

  return (
    <section
      className="travel-style-section"
      style={{ backgroundImage: `url(${selectedStyle.background})` }}
    >
      <div className="overlay" />

      <div className="travel-style-content">
        {/* 左側文字區塊 */}
        <div className="travel-style-text">
          <h2 className="zh-title-48">{selectedStyle.title}</h2>
          <p className="zh-text-20">{selectedStyle.description}</p>
          <button className="explore-btn zh-text-16" onClick={handleExploreClick}>
            探索您的理想旅程
          </button>
        </div>

        {/* 右側滑動卡片區塊 */}
        <div className="travel-style-slider">
          <Swiper
            slidesPerView="auto"
            spaceBetween={40}
            grabCursor={true}
            loop={true}
            freeMode={true}
            modules={[FreeMode]}
            speed={800}
          >
            {travelStyles.map((item, index) => (
              <SwiperSlide key={item.id} style={{ width: '250px' }}>
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












