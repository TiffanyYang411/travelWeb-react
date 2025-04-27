// src/components/Testimonial.jsx

import { useState, useEffect } from 'react';
import '../styles/Testimonial.css';
import { testimonials } from '../data/testimonials';

function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // 每5秒切一個

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="testimonial-section">
      <div className="testimonial-header">
        <h2 className="en-title-32">What Our Clients Say</h2>
        <h2 className="zh-title-32">客戶評價</h2>
      </div>
      <div className="testimonial-slider">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className={`testimonial-item ${
              index === activeIndex ? 'active' : index < activeIndex ? 'above' : 'below'
            }`}
          >
            <blockquote>{item.comment}</blockquote>
            <p className="user-name">— {item.name}・{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonial;



