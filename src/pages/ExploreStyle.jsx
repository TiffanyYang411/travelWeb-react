// src/pages/ExploreStyle.jsx
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
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
  const swiperInstanceRef = useRef(null);
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
  let triggered = false;

  const handleScroll = () => {
    if (triggered) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const swiperTop = swiperRef.current?.offsetTop || 0;
    const tripCardTop = tripCardRef.current?.offsetTop || 0;
    const triggerPoint = swiperTop + windowHeight * 0.4; // ⬅️ 只到40%，提早很多！

    if (!showTripCards && scrollY > triggerPoint && !isScrollingToDetail.current) {
      triggered = true;
      setShowTripCards(true); // ✅ 馬上出現
      if (Math.abs(scrollY - tripCardTop) > 150) { 
        window.scrollTo({ top: tripCardTop, behavior: 'auto' }); // ✅ 超過200px直接跳
      } else {
        window.scrollTo({ top: tripCardTop, behavior: 'smooth' }); // 不超過就smooth
      }
      setTimeout(() => {
        triggered = false;
      }, 150); // ⬅️ 超短解除封鎖
    }

    if (showTripCards && scrollY < triggerPoint && !isScrollingToDetail.current) {
      triggered = true;
      if (Math.abs(scrollY - swiperTop) > 200) {
        window.scrollTo({ top: swiperTop, behavior: 'auto' });
      } else {
        window.scrollTo({ top: swiperTop, behavior: 'smooth' });
      }
      setTimeout(() => {
        setShowTripCards(false);
        setActiveTripIndex(null);
        triggered = false;
      }, 150);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [hasInteracted, showTripCards]);




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
    if (hasInteracted && showTripCards && tripCardRef.current) {
      tripCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showTripCards, hasInteracted]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.slideToLoop(selectedStyleIndex, 300);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [selectedStyleIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.search]);

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

      sessionStorage.setItem("returnTo", purePath);
      navigate("/login");
    } else {
      addTripToCart(tripId);
      window.dispatchEvent(new Event('openCartDropdown'));
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
              swiperInstanceRef.current = swiper;
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

        {/* 🔥 只在showTripCards時才出現的 向上箭頭 */}
        {showTripCards && (
          <div className="scroll-down-indicator" onClick={() => {
            swiperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}>
            <div className="chevron chevron-up"></div>
            <div className="chevron chevron-up"></div>
            <div className="chevron chevron-up"></div>
          </div>
        )}

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






























