import React, { useEffect, useState, useRef } from 'react'; // ✅ 多加 useRef
import '../styles/Home.css';
import '../styles/Typography.css';
import TravelStyles from '../components/TravelStyles';
import WhyUs from '../components/WhyUs';
import Testimonial from '../components/Testimonial';

const windowFrameImg = `${import.meta.env.BASE_URL}images/window-frame-large.png`;

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
  const travelRef = useRef(null);
  const hasScrolledRef = useRef(false); // 避免重複觸發

  // Step 1：語錄進場 + 窗戶放大
  useEffect(() => {
    const quoteInTimer = setTimeout(() => setReady(true), 50);
    const expandTimer = setTimeout(() => {
      setExpanded(true);
    }, 3000);

    return () => {
      clearTimeout(quoteInTimer);
      clearTimeout(expandTimer);
    };
  }, []);

  // Step 2：窗戶動畫跑完後才開始圖片輪播
  useEffect(() => {
    if (!expanded) return;

    // ✅ 先切到第二張
    const switchToSecond = setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(1); // ✅ 切第二張
        setTransitioning(false);
      }, 300);

      // ✅ 第二張顯示完，延後 6 秒後再開始輪播
      slideTimerRef.current = setInterval(() => {
        setTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % slideImages.length);
          setTransitioning(false);
        }, 300);
      }, 4000); // ✅ 正常輪播（從第三張開始）
    }, 3000); // 動畫結束後切第二張

    // ✅ 為了清理 interval（因為我們不是立即宣告）
    const slideTimerRef = { current: null };

    return () => {
      clearTimeout(switchToSecond);
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [expanded]);

  useEffect(() => {
    const handleWheel = (e) => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      const isInHero = scrollY < viewportHeight * 0.8;

      if (isInHero && !hasScrolledRef.current && e.deltaY > 0) {
        e.preventDefault();
        travelRef.current?.scrollIntoView({ behavior: 'smooth' });
        hasScrolledRef.current = true;

        setTimeout(() => {
          hasScrolledRef.current = false;
        }, 2000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    // ✅ 僅保留這個 return 就好
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);


  return (
    <div className="home-page">
      {/* Hero Banner 區塊 */}
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
          <img
            src={windowFrameImg}
            alt="窗框"
            className="hero-window-frame"
          />

          <img
            src={quoteSvgs[0]}
            alt="語錄1"
            className={`hero-quote ${ready && !expanded ? 'visible' : ''}`}
          />
          <img
            src={quoteSvgs[1]}
            alt="語錄2"
            className={`hero-quote quote-expanded ${expanded ? 'visible' : ''}`}
          />
        </div>
      </section>

      {/* 探索你的旅行風格區塊 */}
      <section className="travel-style-section" ref={travelRef}>
        <TravelStyles />
      </section>

      {/* 為什麼選擇我們區塊 */}
      <section className="why-us-section">
        <WhyUs />
      </section>

      {/* 客戶評價區塊 */}
      <section className="testimonial-wrapper">
        <Testimonial />
      </section>
    </div>
  );
}

export default Home;











