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
import { Navigation, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css';

function ExploreStyle() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const styleParam = parseInt(searchParams.get('style'));
  const initialIndex = travelStyles.findIndex(style => style.id === styleParam);

  const [selectedStyleId, setSelectedStyleId] = useState(
    initialIndex !== -1 ? travelStyles[initialIndex].id : travelStyles[0].id
  );

  const selectedTrips = tripData.find(item => item.styleId === selectedStyleId)?.trips || [];

  const [activeTripIndex, setActiveTripIndex] = useState(null);
  const activeTrip = selectedTrips[activeTripIndex];
  const isTripValid = activeTrip && Array.isArray(activeTrip.itinerary) && activeTrip.itinerary.length > 0;

  const [showTripCards, setShowTripCards] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  const tripCardRef = useRef(null);
  const swiperRef = useRef(null);
  const swiperInstanceRef = useRef(null);
  const tripDetailRef = useRef(null);
  const isScrollingToDetail = useRef(false);

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
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.search]);

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
            modules={[Navigation, EffectFade, Autoplay]}
            effect="fade"
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={true}
            speed={1200}
            navigation={{
              nextEl: '.explore-swiper-next',
              prevEl: '.explore-swiper-prev',
            }}
          >
            {travelStyles.map((style) => (
              <SwiperSlide key={style.id} style={{ width: '100vw', height: '100vh' }}>
                <div className="explore-style-card">
                  <div className="image-container">
                    <div className="image-background" style={{ backgroundImage: `url(${style.exploreImage})` }} />
                    <div className="image-overlay"></div>
                    <img
                      src={style.exploreImage}
                      alt=""
                      style={{ display: 'none' }}
                      onLoad={() =>
                        setLoadedImages((prev) => ({ ...prev, [style.id]: true }))
                      }
                    />
                  </div>

                  {loadedImages[style.id] && (
                    <div className="explore-style-overlay">
                      <h2 className="zh-title-48">{style.title}</h2>
                      <p className="zh-text-24">{style.description}</p>
                    </div>
                  )}

                  {loadedImages[style.id] && (
                    <div className="scroll-up-indicator">
                      <div className="chevron"></div>
                      <div className="chevron"></div>
                      <div className="chevron"></div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="explore-swiper-prev swiper-arrow">‹</div>
          <div className="explore-swiper-next swiper-arrow">›</div>
        </div>

        <div className="trip-style-tabs">
          {travelStyles.map(style => (
            <button
              key={style.id}
              className={`trip-style-tab ${selectedStyleId === style.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedStyleId(style.id);
                setActiveTripIndex(null);
                setShowTripCards(true);
              }}
            >
              {style.title}
            </button>
          ))}
        </div>

        <div ref={tripCardRef} className={`explore-trip-card-wrapper ${showTripCards ? 'visible' : 'hidden'}`}>
          <div className="explore-trip-card-container">
            {selectedTrips.map((trip, index) => (
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































