// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import { travelStyles } from '../data/travelStyles';
import { testimonials } from '../data/testimonials';
import { whyUsItems } from '../data/whyUs';

const quoteSvgs = [
  `${import.meta.env.BASE_URL}images/banner-quote-1.svg`,
  `${import.meta.env.BASE_URL}images/banner-quote-2.svg`,
];

const slideImages = [
  `${import.meta.env.BASE_URL}images/slide1.jpg`,
  `${import.meta.env.BASE_URL}images/slide2.jpg`,
  `${import.meta.env.BASE_URL}images/slide3.jpg`,
  `${import.meta.env.BASE_URL}images/slide4.jpg`,
  `${import.meta.env.BASE_URL}images/slide5.jpg`,
];

function Home() {
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const quoteInTimer = setTimeout(() => setReady(true), 50);
    const expandTimer = setTimeout(() => setExpanded(true), 3000);

    const slideTimer = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slideImages.length);
        setTransitioning(false);
      }, 300); // 快速 slide 切換動畫結束後才切換圖片
    }, 6000); // 每張圖停留 6 秒

    return () => {
      clearTimeout(quoteInTimer);
      clearTimeout(expandTimer);
      clearInterval(slideTimer);
    };
  }, []);

  return (
    <div className="home-page">
      {/* ✅ Hero Banner 區塊 */}
      <section className={`hero-section ${ready ? 'ready' : ''} ${expanded ? 'expanded' : ''}`}>
        <div className="hero-scene">
          {slideImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`slide${index + 1}`}
              className={`fullscreen-img ${index === 0 ? 'slide-one' : ''} ${index === currentSlide ? 'active' : 'inactive'}`}
            />
          ))}

          <div className="hero-window-frame" />

          {/* quote1 - 初始語錄 */}
          <img
            src={quoteSvgs[0]}
            alt="語錄1"
            className={`hero-quote ${ready && !expanded ? 'visible' : ''}`}
          />

          {/* quote2 - 放大後出現 */}
          <img
            src={quoteSvgs[1]}
            alt="語錄2"
            className={`hero-quote quote-expanded ${expanded ? 'visible' : ''}`}
          />
        </div>
      </section>

      {/* 其餘區塊 */}
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
    </div>
  );
}

export default Home;







