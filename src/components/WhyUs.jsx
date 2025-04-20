// src/components/WhyUs.jsx
import '../styles/WhyUs.css';

function WhyUs() {
  const features = [
    {
      title: '專屬旅遊策劃師',
      description: '每位貴賓皆配有專屬策劃師，提供一對一深度溝通與建議。',
    },
    {
      title: '高端客製化體驗',
      description: '從航班、住宿到活動，全程量身打造，滿足個人風格與品味。',
    },
    {
      title: '頂級專業服務團隊',
      description: '嚴選北歐在地專家與全球頂尖合作夥伴，確保旅程高品質與安全。',
    },
  ];

  return (
    <section className="why-us-section">
      <h2>為什麼選擇我們？</h2>
      <div className="why-us-cards">
        {features.map((feature, index) => (
          <div className="why-us-card" key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyUs;

