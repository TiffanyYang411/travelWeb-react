// src/components/TravelStyles.jsx

import { useState, useRef, useEffect } from 'react';
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
  const [isMobileMode, setIsMobileMode] = useState(false);

  useEffect(() => {
    const checkMobileMode = () => {
      const width = window.innerWidth;
      setIsMobileMode(width < 1664); // ✅ 1664px 以下進入「中小螢幕模式」
    };

    checkMobileMode();
    window.addEventListener('resize', checkMobileMode);
    return () => window.removeEventListener('resize', checkMobileMode);
  }, []);

  const [scrollSpeed, setScrollSpeed] = useState(6000);

  useEffect(() => {
    const updateSpeed = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScrollSpeed(10000); // 手機：最慢
      } else if (width < 1024) {
        setScrollSpeed(8000);  // 平板
      } else if (width < 1664) {
        setScrollSpeed(7000);  // ✅ 桌機寬度但動畫過快的區間
      } else {
        setScrollSpeed(6000);  // 寬螢幕桌機
      }
    };

    updateSpeed(); // 初始執行一次
    window.addEventListener('resize', updateSpeed);
    return () => window.removeEventListener('resize', updateSpeed);
  }, []);

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
            modules={[Autoplay, FreeMode]}
            loop={true}
            freeMode={true}
            slidesPerView={3}
            spaceBetween={40}
            speed={scrollSpeed}
            autoplay={{
              delay: 0, // ✅ 立即開始
              disableOnInteraction: false,
              pauseOnMouseEnter: true, // ✅ 滑鼠移入暫停
            }}
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
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