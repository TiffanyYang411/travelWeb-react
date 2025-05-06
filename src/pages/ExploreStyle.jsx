// src/pages/ExploreStyle.jsx
import { useSearchParams } from 'react-router-dom';
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
  const tripDetailRef = useRef(null);
  const lastScrollY = useRef(0);
  const isScrollingToDetail = useRef(false); // 防止動畫打架

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
    const handleScroll = () => {
      if (!hasInteracted) setHasInteracted(true);

      const currentY = window.scrollY;
      const direction = currentY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = currentY;

      const midpoint = window.innerHeight * 0.5;

      if (direction === 'down' && currentY > midpoint) {
        setShowTripCards(true);
      } else if (direction === 'up' && currentY < midpoint) {
        setShowTripCards(false);
        swiperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasInteracted]);

  const handleTripClick = (index) => {
    setActiveTripIndex(index);
    isScrollingToDetail.current = true;
    setTimeout(() => {
      tripDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        isScrollingToDetail.current = false;
      }, 1000);
    }, 50);
  };

  useEffect(() => {
    const handleScrollUpToCards = () => {
      if (isScrollingToDetail.current) return;
      const detailTop = tripDetailRef.current?.getBoundingClientRect().top;
      const cardTop = tripCardRef.current?.getBoundingClientRect().top;

      if (
        detailTop !== undefined &&
        detailTop > window.innerHeight * 0.4 &&
        cardTop < 0
      ) {
        tripCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const handleAddToTrip = (tripId) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      sessionStorage.setItem("pendingTripId", tripId);
      sessionStorage.setItem("returnTo", window.location.pathname + window.location.search);
      navigate("/login");
    } else {
      // 執行加入行程邏輯
      addTripToCart(tripId); // 你自己的函式
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
            navigation={{
              nextEl: '.explore-swiper-next',
              prevEl: '.explore-swiper-prev',
            }}
          >
            {travelStyles.map((style, index) => (
              <SwiperSlide key={style.id} style={{ width: '100vw', height: '100vh' }}>
                <div className={`explore-style-card ${selectedStyleIndex === index ? 'active' : ''}`}>
                  <img src={style.exploreImage} alt={style.title} />
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

export default ExploreStyle;

























