// src/components/Banner.jsx

import '../styles/Banner.css';
import '../styles/Typography.css'; // ✅ 引入字型設定

function Banner() {
  return (
    <div className="banner">
      <div className="banner-content">
        <h1 className="zh-title-48">極致北歐奢旅</h1> {/* ✅ 中文標題 Bold 48pt */}
        <p className="zh-text-20">精緻規劃・專屬體驗</p> {/* ✅ 中文內文 Bold 20pt */}
        <button className="banner-button zh-text-16">立即探索旅程</button> {/* ✅ 中文內文 Bold 16pt */}
      </div>
    </div>
  );
}

export default Banner;

