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

function Home() {
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteInTimer = setTimeout(() => setReady(true), 200);
    const expandTimer = setTimeout(() => {
      setExpanded(true);
      setCurrentQuote(1);
    }, 4000);

    return () => {
      clearTimeout(quoteInTimer);
      clearTimeout(expandTimer);
    };
  }, []);

  return (
    <div className="home-page">
      {/* ✅ Hero Banner 區塊 */}
      <section className={`hero-section ${ready ? 'ready' : ''} ${expanded ? 'expanded' : ''}`}>
        <div className="hero-scene">
          <img
            src="/travelWeb-react/images/slide1.jpg"
            alt="風景圖"
            className="fullscreen-img"
          />

          <div className="hero-window-frame" />

          <img
            src={quoteSvgs[currentQuote]}
            alt="語錄"
            className={`hero-quote ${expanded ? 'quote-expanded' : ''}`}
          />
        </div>
      </section>

      {/* 可選：其餘區塊不變 */}
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







