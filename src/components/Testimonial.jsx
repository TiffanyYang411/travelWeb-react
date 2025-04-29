// src/components/Testimonial.jsx

import { testimonials } from '../data/testimonials';
import '../styles/Testimonial.css';

function Testimonial() {
  return (
    <section className="testimonial-section">
      <div className="testimonial-overlay"></div>  {/* ✅ 黑色半透明層 */}
      <div className="testimonial-header">
        <h2 className="en-title-32">What Our Clients Say</h2>
        <h2 className="zh-title-32">客戶評價</h2>
      </div>

      <div className="testimonial-slider-outer">
        {testimonials.map((item, index) => (
          <div className="testimonial-item-slide" key={index}>
            <img src={item.image} alt={`client-${index}`} className="testimonial-avatar" />
            <p className="zh-text-14">{item.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonial;









