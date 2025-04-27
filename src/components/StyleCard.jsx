// src/components/StyleCard.jsx

import '../styles/TravelStyles.css';
import '../styles/Typography.css';

function StyleCard({ title, image }) {
  return (
    <div className="style-card">
      <div className="style-card-image-wrapper">
        <img src={image} alt={title} className="style-card-img" />
        <h3 className="style-card-title zh-text-16">{title}</h3> {/* ✅ 移到圖片內部 */}
      </div>
    </div>
  );
}

export default StyleCard;


