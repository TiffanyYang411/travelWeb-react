// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import { travelStyles } from '../data/travelStyles';
import { testimonials } from '../data/testimonials';
import { whyUsItems } from '../data/whyUs';
import '../styles/Typography.css';

const bannerImages = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
];

const quoteSvgs = [
  `${import.meta.env.BASE_URL}images/banner-quote-1.svg`,
  `${import.meta.env.BASE_URL}images/banner-quote-2.svg`,
];

function Home() {
  const [expanded, setExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const expandTimer = setTimeout(() => {
      setExpanded(true);
      setCurrentQuote(1);
    }, 4000);

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 6000);

    return () => {
      clearTimeout(expandTimer);
      clearInterval(slideTimer);
    };
  }, []);

  return (
    <div className="home-page">
      {/* ✅ 改寫 Banner 區塊 */}
      <section className={`hero-section ${expanded ? 'expanded' : ''}`}>
        <div
          className="hero-background"
          style={{ backgroundImage: `url(${bannerImages[currentSlide]})` }}
        />

        {/* ✅ 測試這一段路徑是否正確顯示 quote SVG */}
        <img
          src={`${import.meta.env.BASE_URL}images/banner-quote-1.svg`}
          alt="測試直接引入 quote1"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '300px',
            zIndex: 5,
          }}
        />

        {/* 原本的動態語錄圖片 */}
        <img
          src={quoteSvgs[currentQuote]}
          alt="語錄"
          className={`hero-quote ${expanded ? 'quote-expanded' : ''}`}
        />

        <img
          src="/images/window-frame-large.png"
          alt="窗戶邊框"
          className="window-frame-top"
        />
      </section>

      {/* TravelStyles 區塊 */}
      <section className="section style-section">
        <h2>探索你的旅行風格</h2>
        <div className="style-grid">
          {travelStyles.map((style, index) => (
            <div className="style-card" key={index}>
              <img src={style.image} alt={style.title} />
              <h3>{style.title}</h3>
              <p>{style.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ExploreCall 區塊 */}
      <section className="section explore-section">
        <div className="explore-call">
          <h2>還不知道適合你的旅程？</h2>
          <p>透過風格探索問答，找出你的命定旅程</p>
          <button className="explore-btn">開始探索</button>
        </div>
      </section>

      {/* Testimonial 區塊 */}
      <section className="section testimonial-section">
        <h2>旅人回饋</h2>
        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <div className="testimonial-card" key={index}>
              <p>"{item.comment}"</p>
              <span>— {item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WhyUs 區塊 */}
      <section className="section whyus-section">
        <h2>為什麼選擇 Élan Journeys？</h2>
        <div className="whyus-grid">
          {whyUsItems.map((item, index) => (
            <div className="whyus-card" key={index}>
              <img src={item.icon} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ 用來測試畫面撐高，確保 footer-bottom 顯示 */}
      <div style={{ height: '1200px', background: '#f0f0f0' }}></div>
    </div>
  );
}

export default Home;


