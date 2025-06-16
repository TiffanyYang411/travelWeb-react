// src/pages/import '../styles/FAQ.css';
import '../styles/Typography.css';
import '../styles/FAQ.css';
import { useState } from 'react';
import usePageTitle from '../hooks/usePageTitle';

function FAQ() {
   usePageTitle('常見問題');
  const faqData = [
    {
      category: '關於行程與客製化',
      questions: [
        {
          q: 'Q：這些行程是固定的嗎？可以客製化嗎？',
          a: '我們提供的行程為精選高端旅遊方案，但仍可根據您的需求進行調整。您可以選擇不同風格的行程，並在「我的行程」頁面填寫需求，我們的專屬策劃師會與您聯絡進行微調。',
        },
        {
          q: 'Q：我可以同時選擇不同風格的行程嗎？',
          a: '可以！您可以在風格篩選頁面挑選多個行程，並將其加入「我的行程」，之後填寫表單提交給策劃師，以確保行程符合您的需求。',
        },
        {
          q: 'Q：我可以自己決定旅遊天數嗎？',
          a: '我們的行程均為精選套餐，天數已經設計完成。如果您有特殊需求，可以在「我的行程」頁面填寫表單，我們的策劃師會提供建議並為您調整方案。',
        },
      ],
    },
    {
      category: '預算與付款',
      questions: [
        {
          q: 'Q：網站上的價格是否為最終價格？',
          a: '我們的網站價格僅供參考。由於行程提供客製化服務，實際費用將由策劃師依需求評估後另行報價，敬請見諒。',
        },
        {
          q: 'Q：假日的價格會與平日不同嗎？',
          a: '為確保旅程品質，週末（週六與週日）行程每位將加收 20% 假日加價費用，相關費用將於預訂時明確標示，敬請安心。',
        },
        {
          q: 'Q：付款方式有哪些？',
          a: '我們接受信用卡、銀行轉帳等方式，具體支付細節會在行程確認後由策劃師提供。',
        },
      ],
    },
    {
      category: '訂購與行程確認',
      questions: [
        {
          q: 'Q：如何確認我的行程？',
          a: '在提交表單後，我們的策劃師會與您聯繫，提供完整的行程建議與報價。確認後，您將收到正式的行程確認書與付款資訊。',
        },
        {
          q: 'Q：提交表單後多久會收到回覆？',
          a: '一般來說，我們的策劃師會在24 至 48 小時內與您聯繫。',
        },
        {
          q: 'Q：我可以取消或更改行程嗎？',
          a: '由於行程涉及高端訂製服務，取消與變更規則會根據供應商（飯店、交通、活動）規定而有所不同。請聯繫策劃師了解具體退改政策。',
        },
      ],
    },
    {
      category: '其他問題',
      questions: [
        {
          q: 'Q：需要辦理簽證嗎？',
          a: '是否需要簽證會依據您的國籍與目的地國家的規定而異。部分北歐國家屬於申根區域，入境時需持有效護照與符合條件的簽證。我們的策劃師將根據您的出發地與旅遊路線，主動提醒您所需文件與辦理方式，並可協助提供簽證準備相關建議。',
        },
        {
          q: 'Q：這些行程適合親子或長輩嗎？',
          a: '我們提供多種旅遊風格，包含適合親子同遊的溫和自然路線，以及為長輩設計的舒適步調與貼心安排。如有特別需求，歡迎在「我的行程」中填寫表單，我們將根據成員組成進行行程調整，確保每位旅伴都能安心享受旅程。',
        },
        {
          q: 'Q：如果旅途中發生緊急狀況，該怎麼辦？',
          a: '您的安全是我們首要關注。每一趟行程皆備有當地緊急聯絡窗口、中文客服與緊急應變計劃。無論是醫療協助、行程變更或聯繫家人，我們的團隊將於第一時間介入處理，讓您安心應對突發情況。',
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
      {/* Banner 區塊 */}
      <div className="faq-hero">
        <div className="faq-hero-overlay">
          <h1 className="faq-hero-title">常見問題</h1>
          <p className="faq-hero-subtitle">
            了解我們如何打造您的專屬旅程——<br />以下是旅人常見問題精選
          </p>
        </div>
      </div>

      {/* FAQ 區塊 */}
      <div className="faq-container">
        {faqData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="faq-section">
            <h2 className="faq-category zh-text-24">{section.category}</h2>
            {section.questions.map((item, qIndex) => {
              const index = questionCounter++;
              const isOpen = index === activeIndex;
              return (
                <div key={qIndex} className="faq-entry">
                  <div
                    className={`faq-item ${isOpen ? 'active' : ''}`}
                    onClick={() => toggleQuestion(index)}
                  >
                    <div className="faq-question zh-text-16">
                      <span>{item.q}</span>
                      <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
                    </div>
                  </div>

                  <div className={`faq-answer-container ${isOpen ? 'active' : ''}`}>
                    <div className="faq-answer zh-text-16">
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;


