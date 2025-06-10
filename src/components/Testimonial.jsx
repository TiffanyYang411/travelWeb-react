// src/components/Testimonial.jsx

import { testimonials } from '../data/testimonials';
import '../styles/Testimonial.css';

function Testimonial() {
  // 重複一次 testimonials 資料以實現無縫輪播
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="testimonial-section">
      <div className="testimonial-overlay"></div>
      <div className="testimonial-header">
        <h2 className="en-title-32">What Our Clients Say</h2>
        <h2 className="zh-title-32">客戶評價</h2>
      </div>

      <div className="testimonial-slider-outer">
        <div className="testimonial-track">
          {duplicatedTestimonials.map((item, index) => (
            <div className="testimonial-card" key={index}>
              <img src={item.image} alt={`client-${index}`} className="testimonial-avatar" />
              <p className="zh-text-14">{item.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
