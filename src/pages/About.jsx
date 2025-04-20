// src/pages/About.jsx
import '../styles/About.css';

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>關於 Élan Journeys</h1>
        <p>極致體驗，從理解旅人靈魂開始。</p>
      </section>

      <section className="about-story">
        <h2>我們的理念</h2>
        <p>
          Élan Journeys 誕生於一群熱愛北歐生活風格的創辦人之間，
          我們相信旅程不只是移動，而是一種生活的延伸。
          每一次的規劃，都是一場為靈魂量身打造的設計。
        </p>
        <p>
          從極地光影到森林靜謐，從米其林餐桌到傳統文化深度探索，
          我們為每位旅人構築專屬的旅程敘事，打造你專屬的「私人北歐」。
        </p>
      </section>

      <section className="about-values">
        <h2>我們的承諾</h2>
        <ul>
          <li>🎯 量身打造每一段旅程，無模板、不複製</li>
          <li>🧳 提供北歐最獨特的在地資源與接待團隊</li>
          <li>💎 重視細節、講究品味，只為提供最優質的感受</li>
        </ul>
      </section>
    </div>
  );
}

export default About;
