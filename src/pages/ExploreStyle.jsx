import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { travelStyles } from '../data/travelStyles';
import { tripData } from '../data/tripData';
import '../styles/ExploreStyle.css';
import '../styles/Typography.css';
import '../styles/TripDetailVertical.css';
import ExploreTripCard from '../components/ExploreTripCard';
import TripDetailSection from '../components/TripDetailSection';
import { Swiper, SwiperSlide } from 'swiper/react'; // ✅ 要從 'swiper/react' 匯入元件
import { Navigation, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css';
import logo from '../images/Logo.svg';
import { useTripStore } from '../store/useTripStore';
import { useHorizontalDragScroll } from '../hooks/useHorizontalDragScroll';
import { useLayoutEffect } from 'react';
import useForceScrollToTop from '../hooks/useForceScrollToTop';

function ExploreStyle() {

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const styleParam = parseInt(searchParams.get('style'));

  const initialIndex = travelStyles.findIndex(style => style.id === styleParam);
  const { setStartDate, setEndDate, setTotalPrice } = useTripStore();
  const [selectedStyleId, setSelectedStyleId] = useState(
    initialIndex !== -1 ? travelStyles[initialIndex].id : travelStyles[0].id
  );

  const selectedTrips = tripData.find(item => item.styleId === selectedStyleId)?.trips || [];

  const [activeTripIndex, setActiveTripIndex] = useState(null);
  const activeTrip = selectedTrips[activeTripIndex];
  const isTripValid = activeTrip && Array.isArray(activeTrip.itinerary) && activeTrip.itinerary.length > 0;

  const [showTripCards, setShowTripCards] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hideOverlay, setHideOverlay] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

  const tripCardRef = useRef(null);
  const swiperRef = useRef(null);
  const swiperInstanceRef = useRef(null);
  const tripDetailRef = useRef(null);
  const tripCardContainerRef = useRef(null);
  useHorizontalDragScroll(tripCardContainerRef);

  const isScrollingToDetail = useRef(false);

  useEffect(() => {
    const forceTop = sessionStorage.getItem('forceScrollToTop') === 'true';

    if (forceTop) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1000);
    } else {
      // fallback：首次進入 Explore 頁時自動置頂
      const isFirstVisit = sessionStorage.getItem('hasVisitedExplore') !== 'true';
      if (isFirstVisit) {
        window.scrollTo({ top: 0});
        sessionStorage.setItem('hasVisitedExplore', 'true');
      }
    }

    const timeout = setTimeout(() => {
      const overlay = document.querySelector('.loading-overlay');
      if (overlay) overlay.classList.add('fade-out');

      setTimeout(() => {
        setHideOverlay(true);
        setIsLoading(false);
        sessionStorage.removeItem('forceScrollToTop');
      }, 800);
    }, 1400);
  }, [location.pathname, location.search]);




  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const styleParam = parseInt(searchParams.get('style'));
    const matchedStyle = travelStyles.find(style => style.id === styleParam);
    if (matchedStyle) {
      setSelectedStyleId(matchedStyle.id);
      setActiveTripIndex(null);
      setShowTripCards(true);
    }
  }, [location.pathname, searchParams]);

  useEffect(() => {
    if (showTripCards && tripCardRef.current) {
      setTimeout(() => {
        tripCardRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 30);
    }
  }, [showTripCards]);

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
      // ✅ 先清空日期與金額狀態（避免殘留週末日期導致誤判加價）
      setStartDate(null);
      setEndDate(null);
      setTotalPrice(0);

      // ✅ 加入前強制清掉先前的日期與金額記憶
      sessionStorage.removeItem('confirmedStartDate');
      sessionStorage.removeItem('confirmedEndDate');
      sessionStorage.removeItem('confirmedTotalPrice');
      sessionStorage.removeItem('userTrips'); // 若你有這個 key 儲存暫存行程的話

      addTripToCart(tripId);
      window.dispatchEvent(new Event('openCartDropdown'));
    }

     useEffect(() => {
    sessionStorage.removeItem('hasVisitedExplore');
  }, []);
  };

  return (
    <>
      {!hideOverlay && (
        <div className="loading-overlay elegant">
          <div className="starfield"></div>
          <div className="spinner elegant" style={{ borderTopColor: 'var(--secondary-color-xlight)' }}></div>
          <img
            className="loading-logo bounce"
            src={logo}
            alt="ÉLAN Journeys Logo"
          />
        </div>
      )}

      <section className="explore-style explore-page-style">
        <div ref={swiperRef} className="explore-swiper-wrapper">
          <div className="explore-swiper-prev swiper-arrow">
            <img src={`${import.meta.env.BASE_URL}images/arrow-left.svg`} alt="Previous" />
          </div>

          <div className="explore-swiper-next swiper-arrow">
            <img src={`${import.meta.env.BASE_URL}images/arrow-right.svg`} alt="Next" />
          </div>


          <Swiper
            modules={[Navigation, EffectFade, Autoplay]} // ✅ 加入 fade 效果與 autoplay
            effect="fade"
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }} // ✅ 每 4 秒切換、滑鼠懸停會暫停
            loop={true}
            speed={1200}
            navigation={{
              nextEl: '.explore-swiper-next',
              prevEl: '.explore-swiper-prev',
            }}
            watchSlidesProgress={true}
            observer={true}
            observeParents={true}
            onSwiper={(swiper) => {
              swiperInstanceRef.current = swiper;
              setTimeout(() => {
                swiper.navigation.init();
                swiper.navigation.update();
              }, 100);
            }}
            initialSlide={initialIndex !== -1 ? initialIndex : 0} // ✅ 加上這行
          >



            {travelStyles.map((style) => (
              <SwiperSlide key={style.id}>
                <div className="explore-slide-inner">
                  <div className="explore-style-card">
                    <div className="image-container">
                      <div
                        className="image-background"
                        style={{ backgroundImage: `url(${style.exploreImage})` }}
                      />
                      <div className="image-overlay" />
                      <img
                        src={style.exploreImage}
                        alt=""
                        style={{
                          width: 1,
                          height: 1,
                          visibility: 'hidden',
                          position: 'absolute',
                        }}
                        onLoad={() =>
                          setLoadedImages((prev) => ({
                            ...prev,
                            [style.id]: true,
                          }))
                        }
                      />
                    </div>

                    {loadedImages[style.id] && (
                      <div className="explore-style-overlay-fade">
                        <h2 className="zh-title-48">{style.title}</h2>
                        <p className="zh-text-24">{style.description}</p>
                      </div>
                    )}


                    {loadedImages[style.id] && (
                      <div
                        className="scroll-up-indicator-fade scroll-click-target"
                        onClick={() => {
                          const target = document.querySelector('.trip-style-tabs');
                          if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        <div className="scroll-icon-group">
                          <div className="scroll-text-line">
                            <svg className="scroll-star top-left" width="12" height="12" viewBox="0 0 24 24">
                              <path d="M12 2 L15 12 L24 12 L15 15 L12 24 L9 15 L0 12 L9 12 Z" fill="white" />
                            </svg>
                            <span className="scroll-label-new twinkle-text" style={{ lineHeight: '150%', letterSpacing: '5%' }}>查看更多</span>
                            <svg className="scroll-star bottom-right" width="12" height="12" viewBox="0 0 24 24">
                              <path d="M12 2 L15 12 L24 12 L15 15 L12 24 L9 15 L0 12 L9 12 Z" fill="white" />
                            </svg>
                          </div>

                          <div className="chevrons">
                            <div className="chevron"></div>
                            <div className="chevron"></div>
                            <div className="chevron"></div>
                          </div>
                        </div>
                      </div>
                    )}


                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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

                // ✅ 等畫面更新後再滾動到卡片區塊
                setTimeout(() => {
                  tripCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
              }}
            >
              {style.title}
            </button>
          ))}
        </div>


        <div ref={tripCardRef} className={`explore-trip-card-wrapper ${showTripCards ? 'visible' : 'hidden'}`}>
          <div className="scroll-hint">← 左右滑動探索行程 →</div>
          <div ref={tripCardContainerRef} className="explore-trip-card-container">
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







