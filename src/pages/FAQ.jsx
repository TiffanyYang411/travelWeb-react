// src/pages/FAQ.jsx
import '../styles/FAQ.css';
import { useState } from 'react';

function FAQ() {
  const faqData = [
    {
      category: '關於行程與客製化',
      questions: [
        {
          q: '這些行程是固定的嗎？可以客製化嗎？',
          a: '我們提供的行程為精選高端旅遊方案，但仍可根據您的需求進行調整。您可以選擇不同風格的行程，並在「我的行程」頁面填寫需求，我們的專屬策劃師會與您聯絡進行微調。',
        },
        {
          q: '我可以同時選擇不同風格的行程嗎？',
          a: '可以！您可以在風格篩選頁面挑選多個行程，並將其加入「我的行程」，之後填寫表單提交給策劃師，以確保行程符合您的需求。',
        },
        {
          q: '我可以自己決定旅遊天數嗎？',
          a: '我們的行程均為精選套餐，天數已經設計完成。如果您有特殊需求，可以在「我的行程」頁面填寫表單，我們的策劃師會提供建議並為您調整方案。',
        },
      ],
    },
    {
      category: '預算與付款',
      questions: [
        {
          q: '網站上的價格是否為最終價格？',
          a: '我們的網站價格僅供參考。由於行程提供客製化服務，實際費用將由策劃師依需求評估後另行報價，敬請見諒。',
        },
        {
          q: '付款方式有哪些？',
          a: '我們接受信用卡、銀行轉帳等方式，具體支付細節會在行程確認後由策劃師提供。',
        },
      ],
    },
    {
      category: '訂購與行程確認',
      questions: [
        {
          q: '如何確認我的行程？',
          a: '在提交表單後，我們的策劃師會與您聯繫，提供完整的行程建議與報價。確認後，您將收到正式的行程確認書與付款資訊。',
        },
        {
          q: '提交表單後多久會收到回覆？',
          a: '一般來說，我們的策劃師會在24 至 48 小時內與您聯繫。',
        },
        {
          q: '我可以取消或更改行程嗎？',
          a: '由於行程涉及高端訂製服務，取消與變更規則會根據供應商（飯店、交通、活動）規定而有所不同。請聯繫策劃師了解具體退改政策。',
        },
      ],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  let questionCounter = 0;

  return (
    <div className="faq-page">
      <h1 className="faq-title">常見問題 FAQ</h1>
      {faqData.map((section, sectionIndex) => (
        <div key={sectionIndex} className="faq-section">
          <h2 className="faq-category">{section.category}</h2>
          {section.questions.map((item, qIndex) => {
            const index = questionCounter++;
            const isOpen = index === activeIndex;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? 'active' : ''}`}
                onClick={() => toggleQuestion(index)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && <div className="faq-answer">{item.a}</div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default FAQ;
