// src/components/Testimonial.jsx

import '../styles/Testimonial.css'; // 如果有 CSS

function Testimonial() {
  return (
    <section className="testimonial">
      <h2>貴賓評價</h2>
      <blockquote>
        “這趟旅程完全符合我的品味與需求，每個細節都顯示出公司的專業與細心。”
      </blockquote>
      <p className="user-name">— Sabrina・品牌總監</p>
    </section>
  );
}

export default Testimonial; // ✅ 最重要的一行
