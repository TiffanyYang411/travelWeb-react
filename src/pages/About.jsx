// src/pages/About.jsx
import "../styles/About.css";
import { useEffect, useState } from "react";

function About() {
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();

    if (window.innerWidth <= 1024) {
      document.querySelector('.about-text-overlay')?.classList.add('show');
    }

    const track = document.querySelector(".about-carousel-track");
    const images = Array.from(document.querySelectorAll(".about-smallphoto"));
    if (!track || images.length === 0) return;

    images.forEach((img) => {
      const clone = img.cloneNode(true);
      track.appendChild(clone);
    });

    let scrollId;
    let isPaused = false;

    const startAutoScroll = () => {
      scrollId = setInterval(() => {
        if (!isPaused) {
          track.scrollLeft += 1;
          if (track.scrollLeft >= track.scrollWidth / 2) {
            track.scrollLeft = 0;
          }
        }
      }, 10);
    };

    const stopAutoScroll = () => clearInterval(scrollId);

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };

    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);

    startAutoScroll();

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });

    setTimeout(() => {
      const animatedElements = document.querySelectorAll(
        ".about-index-title, .about-slogan, .about-text-overlay, .about-inner, .about-card-row.horizontal"
      );
      animatedElements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      stopAutoScroll();
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const teamMembers = [
    {
      img: "about-team1.png",
      title: "創辦人 & <br />首席旅遊策劃師",
      desc: "擁有超過15年高端旅遊規劃經驗,曾為多位企業家與名人設計私人訂製行程。專精於深度文化旅行與隱藏版景點探索,帶您發掘不同於觀光客視角的世界。"
    },
    {
      img: "about-team2.png",
      title: "資深旅遊策劃師",
      desc: "語言專長：中文、英文、法文。專精於歐洲藝術人文主題規劃，從私人美術館導覽到葡萄酒莊園住宿，全程打造專屬品味行程。"
    },
    {
      img: "about-team3.png",
      title: "營運總監",
      desc: "前航空公司營運經理,負責ÉLAN JOURNEYS的全球合作通路與行程落地品質把關,確保每位客人旅程流暢無憂。"
    },
    {
      img: "about-team4.png",
      title: "客戶關係經理",
      desc: "您的專屬旅程管家，負責前期諮詢、旅途中即時協助以及後續旅程回饋追蹤，讓每一位旅人都能安心出發、滿意歸來。"
    }
  ];

  return (
    <div>
      {/* 品牌理念 */}
      <section className="about-index about-bg">
        <div className="about-index-title zh-title-36">品牌理念</div>
      </section>

      {/* 大圖介紹區 */}
      <section className="about-headerphoto about-bg">
        <div className="about-top-heading">
          <h3 className="zh-text-24 about-slogan">為人生，策劃一段只屬於你的旅程</h3>
        </div>

        <div className="about-image-wrapper">
          <img
            src={`${import.meta.env.BASE_URL}images/about/about-banner190.png`}
            alt="ÉLAN JOURNEYS"
            className="about-base-image"
          />
          <div className="about-text-overlay">
            <h2 className="en-title-24">WHY ÉLAN JOURNEYS</h2>
            <h3 className="en-title-20">Because your journey should be as unique as your story.</h3>
            <p className="zh-text-16-regular">
              在 ÉLAN JOURNEYS，我們相信 —— 每段旅程，應如藝術般被構思、如詩般被體驗。不論您身處世界哪個角落，我們追求的，不僅是帶您抵達目的地，更是為您開啟一段內在與外在的探索。
            </p>
            <p className="zh-text-16-regular">
              這是一個為高端旅人而生的品牌，專注於設計真正客製化、全然獨一無二的旅遊體驗。我們深知，每一位旅者都是一個世界，而您值得一段只屬於自己的旅程。
              從靈感發想到細節規劃，ÉLAN JOURNEYS 所提供的，不僅是服務，而是一種無與倫比的生活風格與態度。我們結合來自北歐各地的文化專家、地接策劃人、私人導遊與藝術生活顧問，為您量身打造每一站，
              無論是沉浸於極光之下的靜謐夜晚、漫步於峽灣邊的小鎮街道，
              或是在雪白森林中體驗傳統桑拿與冷泉交替的療癒儀式。真正的奢華，從來不是標榜擁有，而是用時間與空間，去沉澱與回味。
            </p>
            <p className="zh-text-16-regular">我們所策劃的每一次出行，皆是一段無法複製的故事，一次對世界的深度凝視。</p>
          </div>
        </div>
      </section>

      {/* 輪播區 */}
      <section className="about-carousel about-bg">
        <div className="about-carousel-track">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <img
              key={num}
              src={`${import.meta.env.BASE_URL}images/about/about-trip${num}.${num < 6 ? "jpg" : "png"}`}
              alt={`旅圖${num}`}
              className="about-smallphoto"
            />
          ))}
        </div>
      </section>

      {/* 團隊介紹 */}
      <section className="about-content about-bg">
        <div className="about-inner">
          <h2 className="zh-text-24 about-team-title">ÉLAN JOURNEYS 專業團隊</h2>
          <h3 className="zh-text-20">
            我們是一群對探索世界充滿熱情的旅遊專家，專注於設計量身打造的高端旅行體驗，
          </h3>
          <h3 className="zh-text-20">
            從文化深度遊到自然探險，致力於將您的夢想旅程變為現實。
          </h3>
        </div>
      </section>

      <div className="about-photo-group about-bg">
        {windowWidth < 768 ? (
          // ✅ 手機：上下排列
          teamMembers.map((member) => (
            <div className="about-card-row vertical" key={member.title}>
              <img
                src={`${import.meta.env.BASE_URL}images/about/${member.img}`}
                alt={member.title}
                className="about-card-photo"
              />
              <div className="about-card-text">
                {member.title.split("<br />").map((line, index) => (
                  <div
                    key={index}
                    className="zh-text-20 about-card-title"
                    style={{ marginBottom: index === 0 ? "10px" : "0" }}
                  >
                    {line}
                  </div>
                ))}
                <p className="zh-text-16-regular about-card-desc" style={{ marginTop: "30px" }}>
                  {member.desc}
                </p>
              </div>
            </div>
          ))
        ) : windowWidth <= 1024 ? (
          // ✅ 平板：單欄左右排列（tablet className）
          teamMembers.map((member) => (
            <div className="about-card-row tablet" key={member.title}>
              <img
                src={`${import.meta.env.BASE_URL}images/about/${member.img}`}
                alt={member.title}
                className="about-card-photo"
              />
              <div className="about-card-text">
                {member.title.split("<br />").map((line, index) => (
                  <div
                    key={index}
                    className="zh-text-20 about-card-title"
                    style={{ marginBottom: index === 0 ? "10px" : "0" }}
                  >
                    {line}
                  </div>
                ))}
                <p className="zh-text-16-regular about-card-desc" style={{ marginTop: "30px" }}>
                  {member.desc}
                </p>
              </div>
            </div>
          ))
        ) : (
          // ✅ 桌機：兩欄排列（原本邏輯）
          [0, 1].map((row) => (
            <div className="about-row" key={row}>
              {[0, 1].map((col) => {
                const member = teamMembers[row * 2 + col];
                return (
                  <div className="about-card-row horizontal" key={member.title}>
                    <img
                      src={`${import.meta.env.BASE_URL}images/about/${member.img}`}
                      alt={member.title}
                      className="about-card-photo"
                    />
                    <div className="about-card-text">
                      {member.title.split("<br />").map((line, index) => (
                        <div
                          key={index}
                          className="zh-text-20 about-card-title"
                          style={{ marginBottom: index === 0 ? "10px" : "0" }}
                        >
                          {line}
                        </div>
                      ))}
                      <p className="zh-text-16-regular about-card-desc" style={{ marginTop: "30px" }}>
                        {member.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>


      {/* 聯絡我們區塊 */}
      <section
        className="about-contact-section"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/about/about-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "600px",
        }}
      >
        <div className="about-contact-header">
          <h2 className="zh-title-36">聯繫我們</h2>
        </div>

        <div className="about-contact-container">
          <div className="about-contact-form">
            <form>
              <div className="about-form-group">
                <label htmlFor="name" className="zh-text-24">姓名 </label>
                <input type="text" id="name" name="name" placeholder="請輸入您的姓名" required />
              </div>
              <div className="about-form-group">
                <label htmlFor="email" className="zh-text-24">信箱 </label>
                <input type="email" id="email" name="email" placeholder="請輸入您的信箱" required />
              </div>
              <div className="about-form-group">
                <label htmlFor="phone" className="zh-text-24">電話 </label>
                <input type="tel" id="phone" name="phone" placeholder="請輸入您的電話" required />
              </div>
              <div className="about-form-group">
                <label htmlFor="message" className="zh-text-24">留言 </label>
                <textarea id="message" name="message" rows="5" placeholder="請輸入您的留言" required />
              </div>
              <button type="submit" className="about-submit-btn">提交</button>
            </form>
          </div>

          <div className="about-image-container">
            <img
              src={`${import.meta.env.BASE_URL}images/about/about-formside.png`}
              alt="聯繫我們圖"
              className="about-side-image"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;












