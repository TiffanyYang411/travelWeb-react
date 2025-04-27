// src/components/TravelStyles.jsx

import { useState } from 'react';
import '../styles/TravelStyles.css';
import '../styles/Typography.css'; // ✅ 引入字型設定
import { travelStyles } from '../data/travelStyles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

function TravelStyles() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedStyle = travelStyles[selectedIndex];

  return (
    <section
      className="travel-style-section"
      style={{ backgroundImage: `url(${selectedStyle.background})` }}
    >
      <div className="overlay" />

      {/* ✅ 新增內容包裹層，讓背景滿版，內容內縮 */}
      <div className="travel-style-content">
        {/* 左側文字區 */}
        <div className="travel-style-text">
          <h2 className="zh-title-48">{selectedStyle.title}</h2> {/* 大標題 48pt */}
          <p className="zh-text-20">{selectedStyle.description}</p> {/* 內文 20pt */}
          <button className="explore-btn zh-text-16">探索您的理想旅程</button> {/* 按鈕16pt */}
        </div>

        {/* 右側滑動卡片 */}
        <div className="travel-style-slider">
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={40} // ✅ 卡片間距固定40px
            grabCursor={true}
            loop={true}
            freeMode={true}
            modules={[FreeMode]}
            speed={800}
          >
            {travelStyles.map((item, index) => (
              <SwiperSlide key={index} style={{ width: '250px' }}>
                <div
                  className={`style-card-wrapper ${selectedIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className="style-card-image-wrapper">
                    <img src={item.thumbnail} alt={item.title} className="style-card-img" />
                    <h3 className="style-card-title zh-text-16">{item.title}</h3> {/* 卡片小標題 */}
                    {selectedIndex === index && <div className="gradient-overlay"></div>}
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











