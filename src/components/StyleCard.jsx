// src/components/StyleCard.jsx
import '../styles/TravelStyles.css';

function StyleCard({ title, image }) {
  return (
    <div className="style-card">
      <img src={image} alt={title} className="style-card-img" />
      <h3 className="style-card-title zh-text">{title}</h3>
    </div>
  );
}

export default StyleCard;
