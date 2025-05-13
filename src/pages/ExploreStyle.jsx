// src/pages/ExploreStyle.jsx
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { travelStyles } from '../data/travelStyles';
import { tripData } from '../data/tripData';
import '../styles/ExploreStyle.css';
import '../styles/Typography.css';
import '../styles/TripDetailVertical.css';
import ExploreTripCard from '../components/ExploreTripCard';
import TripDetailSection from '../components/TripDetailSection';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css';

function ExploreStyle() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const styleParam = parseInt(searchParams.get('style'));
  const initialIndex = travelStyles.findIndex(style => style.id === styleParam);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(initialIndex !== -1 ? initialIndex : 0);
  const selectedStyle = travelStyles[selectedStyleIndex];

  const filteredStyleTrips = tripData.find(item => item.styleId === selectedStyle.id);
  const filteredTrips = filteredStyleTrips ? filteredStyleTrips.trips : [];

  const [activeTripIndex, setActiveTripIndex] = useState(null);
  const activeTrip = filteredTrips[activeTripIndex];
  const isTripValid = activeTrip && Array.isArray(activeTrip.itinerary) && activeTrip.itinerary.length > 0;

  const [showTripCards, setShowTripCards] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const tripCardRef = useRef(null);
  const swiperRef = useRef(null);
  const swiperInstanceRef = useRef(null); // ✅ 新增：抓取 Swiper 實例
  const tripDetailRef = useRef(null);
  const lastScrollY = useRef(0);
  const isScrollingToDetail = useRef(false);

  useEffect(() => {
    const newStyleParam = parseInt(searchParams.get('style'));
    const newIndex = travelStyles.findIndex(style => style.id === newStyleParam);
    if (newIndex !== -1 && newIndex !== selectedStyleIndex) {
      setSelectedStyleIndex(newIndex);
      setActiveTripIndex(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      swiperRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 100);

    const release = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => {
      clearTimeout(timeout);
      clearTimeout(release);
    };
  }, []);

  useEffect(() => {
    let throttleTimeout = null;
    const handleScroll = () => {
      if (throttleTimeout) return;

      throttleTimeout = setTimeout(() => {
        if (!hasInteracted) setHasInteracted(true);
        const currentY = window.scrollY;
        const direction = currentY > lastScrollY.current ? 'down' : 'up';
        lastScrollY.current = currentY;
        const midpoint = window.innerHeight * 0.5;

        if (direction === 'down' && currentY > midpoint) {
          setShowTripCards(true);
        } else if (direction === 'up' && currentY < midpoint && !isScrollingToDetail.current) {
          setShowTripCards(false);
          window.scrollTo({
            top: swiperRef.current.offsetTop,
            behavior: 'smooth'
          });
        }

        throttleTimeout = null;
      }, 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasInteracted]);

  const handleTripClick = (index) => {
    setActiveTripIndex(index);
    setShowTripCards(true);
    setTimeout(() => {
      scrollToTripDetail();
    }, 100);
  };

  const scrollToTripDetail = () => {
    isScrollingToDetail.current = true;
    const startY = window.scrollY;
    const endY = tripDetailRef.current.offsetTop;
    const duration = 800;
    const startTime = performance.now();

    const scroll = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuart(progress);
      const currentY = startY + (endY - startY) * ease;
      window.scrollTo(0, currentY);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      } else {
        isScrollingToDetail.current = false;
      }
    };

    requestAnimationFrame(scroll);
  };

  useEffect(() => {
    const handleScrollUpToCards = () => {
      if (isScrollingToDetail.current) return;
      const detailTop = tripDetailRef.current?.getBoundingClientRect().top;
      const cardTop = tripCardRef.current?.getBoundingClientRect().top;
      if (detailTop !== undefined && detailTop > window.innerHeight * 0.4 && cardTop < 0) {
        window.scrollTo({
          top: tripCardRef.current.offsetTop,
          behavior: 'smooth'
        });
      }
    };
    window.addEventListener('scroll', handleScrollUpToCards);
    return () => window.removeEventListener('scroll', handleScrollUpToCards);
  }, []);

  useEffect(() => {
    if (hasInteracted && showTripCards && tripCardRef.current) {
      tripCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showTripCards, hasInteracted]);

  // ✅ 新增：selectedStyleIndex 改變時，主動切換 Swiper slide
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.slideToLoop(selectedStyleIndex, 300);
      }
    }, 100); // 延遲 100ms 等待 Swiper 初始化完成

    return () => clearTimeout(timeout);
  }, [selectedStyleIndex]);


  const handleAddToTrip = (tripId) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      sessionStorage.setItem("pendingTripId", tripId);
      sessionStorage.setItem("justLoggedIn", "true");

      const fullPath = window.location.pathname + window.location.search;
      const base = import.meta.env.BASE_URL.replace(/\/$/, '');
      const purePath = fullPath.startsWith(base)
        ? fullPath.slice(base.length)
        : fullPath;

      console.log('[✅ returnTo 即將設定]', purePath);
      sessionStorage.setItem("returnTo", purePath);
      navigate("/login");
    } else {
      addTripToCart(tripId);
      window.dispatchEvent(new Event('openCartDropdown')); // ✅ 加這行：通知 Navbar 打開購物車
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="mask top-mask" />
          <div className="mask bottom-mask" />
          <img
            className="loading-logo"
            src={`${import.meta.env.BASE_URL}images/logo.svg`}
            alt="ÉLAN Journeys Logo"
          />
          <div className="loading-slogan">Where your Nordic dream begins…</div>
        </div>
      )}

      <section className="explore-style">
        <div ref={swiperRef} className="explore-swiper-wrapper">
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            grabCursor={true}
            loop={true}
            modules={[Navigation]}
            speed={800}
            centeredSlides={true}
            initialSlide={selectedStyleIndex}
            onSlideChange={(swiper) => {
              setSelectedStyleIndex(swiper.realIndex);
              setActiveTripIndex(null);
            }}
            onSwiper={(swiper) => {
              swiperInstanceRef.current = swiper; // ✅ 建立 swiper 實例參照
            }}
            navigation={{
              nextEl: '.explore-swiper-next',
              prevEl: '.explore-swiper-prev',
            }}
          >
            {travelStyles.map((style, index) => (
              <SwiperSlide key={style.id} style={{ width: '100vw', height: '100vh' }}>
                <div
                  className={`explore-style-card ${selectedStyleIndex === index ? 'active' : ''}`}
                  onClick={(e) => {
                    const ripple = document.createElement('span');
                    ripple.className = 'ripple-effect';
                    ripple.style.left = `${e.clientX - e.currentTarget.getBoundingClientRect().left - 50}px`;
                    ripple.style.top = `${e.clientY - e.currentTarget.getBoundingClientRect().top - 50}px`;
                    ripple.style.width = '100px';
                    ripple.style.height = '100px';
                    e.currentTarget.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    e.currentTarget.style.setProperty('--x', `${x}%`);
                    e.currentTarget.style.setProperty('--y', `${y}%`);
                  }}
                >
                  <div className="image-container">
                    <img src={style.exploreImage} alt={style.title} />
                    <div className="image-overlay"></div>
                  </div>

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

          <div className="explore-swiper-prev swiper-arrow">‹</div>
          <div className="explore-swiper-next swiper-arrow">›</div>
        </div>

        <div ref={tripCardRef} className={`explore-trip-card-wrapper ${showTripCards ? 'visible' : 'hidden'}`}>
          <div className="explore-trip-card-container">
            {filteredTrips.map((trip, index) => (
              <ExploreTripCard
                key={trip.id}
                trip={trip}
                onClick={() => handleTripClick(index)}
                isActive={index === activeTripIndex}
                delayIndex={showTripCards ? index : undefined}
              />
            ))}
          </div>
        </div>

        {isTripValid && (
          <div ref={tripDetailRef}>
            <TripDetailSection trip={activeTrip} />
          </div>
        )}
      </section>
    </>
  );
}

function easeInOutQuart(x) {
  return x < 0.5
    ? 8 * x * x * x * x
    : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

export default ExploreStyle;





























