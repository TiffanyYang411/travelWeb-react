// src/components/TravelStyles.jsx
import '../styles/TravelStyles.css';
import StyleCard from './StyleCard';

const styles = [
  { title: '極地冒險', image: '/images/style-adventure.jpg' },
  { title: '米其林美食', image: '/images/style-gourmet.jpg' },
  { title: '頂級度假', image: '/images/style-luxury.jpg' },
  { title: '深度文化之旅', image: '/images/style-culture.jpg' },
  { title: '北歐療癒假期', image: '/images/style-healing.jpg' },
];

function TravelStyles() {
  return (
    <div className="travel-style-container">
      <h2 className="travel-style-title zh-title">探索五大旅遊風格</h2>
      <div className="style-grid">
        {styles.map((item, index) => (
          <StyleCard key={index} title={item.title} image={item.image} />
        ))}
      </div>
    </div>
  );
}

export default TravelStyles;
