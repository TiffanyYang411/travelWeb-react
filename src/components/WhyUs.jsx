// src/components/WhyUs.jsx

// ✅ WhyUs.jsx 更新版（先排版，無動畫）

// ===== 正確版 WhyUs.jsx =====

// WhyUs.jsx
import '../styles/WhyUs.css';
import '../styles/Typography.css';
import { useEffect, useState } from 'react';
import { whyUsItems } from '../data/whyUs';
import { testimonials } from '../data/testimonials';

function WhyUs() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.2 });

    const fadeItems = document.querySelectorAll('.fade-in');
    fadeItems.forEach(item => observer.observe(item));

    return () => {
      fadeItems.forEach(item => observer.unobserve(item));
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const getPrevIndex = () => (currentIndex - 1 + testimonials.length) % testimonials.length;
  const getNextIndex = () => (currentIndex + 1) % testimonials.length;

  return (
    <section
      className="whyus-section"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/whyus-bg.jpg)` }}
    >
      <div className="whyus-container">

        {/* 最上方標題 */}
        <div className="whyus-header fade-in delay-0">
          <h2 className="en-title-32">What Sets Us Apart</h2>
          <h2 className="zh-title-32">為什麼選擇我們?</h2>
        </div>

        <div className="whyus-content">

          {/* 專屬策劃師 */}
          <div className="whyus-item">
            <img src={whyUsItems[0].image} alt={whyUsItems[0].title} className="whyus-large-img fade-in delay-0" />
            <div className="whyus-text fade-in delay-1">
              <h3 className="zh-text-24">{whyUsItems[0].title}</h3>
              <p className="zh-text-20" dangerouslySetInnerHTML={{ __html: whyUsItems[0].description }} />
            </div>
          </div>

          {/* 高端客製化 */}
          <div className="whyus-item custom-layout">
            <div className="whyus-text fade-in delay-0">
              <h3 className="zh-text-24">{whyUsItems[1].title}</h3>
              <p className="zh-text-20" dangerouslySetInnerHTML={{ __html: whyUsItems[1].description }} />
            </div>
            <div className="overlap-images">
              <img src={whyUsItems[1].image1} alt="高端客製化1" className="whyus-small-img top-img fade-in delay-1" />
              <img src={whyUsItems[1].image2} alt="高端客製化2" className="whyus-small-img bottom-img fade-in delay-2" />
            </div>
          </div>

          {/* 專業服務 */}
          <div className="whyus-item service-text-adjust">
            <img src={whyUsItems[2].image} alt={whyUsItems[2].title} className="whyus-large-img fade-in delay-0" />
            <div className="whyus-text fade-in delay-1">
              <h3 className="zh-text-24">{whyUsItems[2].title}</h3>
              <p className="zh-text-20 one-line">{whyUsItems[2].description}</p>
            </div>
          </div>

          {/* 客戶評價標題（獨立出來） */}
          <div className="testimonial-title fade-in delay-1">
            <h2 className="en-title-32">What Our Clients Say</h2>
            <h2 className="zh-title-32">客戶評價</h2>
          </div>

          {/* 客戶評價輪播 */}
          <div className="testimonial-slider-container">
            <div className="testimonial-slider">
              <div className="testimonial-track">
                <div className="testimonial-card above">
                  <img
                    src={`${import.meta.env.BASE_URL}${testimonials[getPrevIndex()].image}`}
                    alt="Previous Person"
                    className="testimonial-avatar"
                  />
                  <p className="testimonial-comment">{testimonials[getPrevIndex()].comment}</p>
                </div>
                <div className="testimonial-card center">
                  <img
                    src={`${import.meta.env.BASE_URL}${testimonials[currentIndex].image}`}
                    alt="Current Person"
                    className="testimonial-avatar"
                  />
                  <p className="testimonial-comment">{testimonials[currentIndex].comment}</p>
                </div>
                <div className="testimonial-card below">
                  <img
                    src={`${import.meta.env.BASE_URL}${testimonials[getNextIndex()].image}`}
                    alt="Next Person"
                    className="testimonial-avatar"
                  />
                  <p className="testimonial-comment">{testimonials[getNextIndex()].comment}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default WhyUs;































