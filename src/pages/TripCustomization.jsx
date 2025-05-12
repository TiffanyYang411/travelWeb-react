import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserTrips } from '../utils/tripUtils';
import '../styles/TripCustomization.css';
import TripSummaryBar from '../components/TripSummaryBar';

function TripCustomization() {
    const navigate = useNavigate();
    const location = useLocation();
    const [trips, setTrips] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPeople, setTotalPeople] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const [step, setStep] = useState(0);

    useEffect(() => {
        const storedTrips = JSON.parse(sessionStorage.getItem('confirmedTrips')) || [];
        const storedStartDate = sessionStorage.getItem('confirmedStartDate') || '';
        const storedEndDate = sessionStorage.getItem('confirmedEndDate') || '';
        const storedTotalPeople = parseInt(sessionStorage.getItem('confirmedTotalPeople'), 10) || 0;
        const storedTotalPrice = parseInt(sessionStorage.getItem('confirmedTotalPrice'), 10) || 0;

        setTrips(storedTrips);
        setStartDate(storedStartDate);
        setEndDate(storedEndDate);
        setTotalPeople(storedTotalPeople);
        setTotalPrice(storedTotalPrice);
    }, [location.pathname]);

    const handleNextStep = () => {
        if (step === 0) {
            setStep(1);
        } else if (step < 6) {
            setStep(prev => prev + 1);
        } else {
            alert('表單送出完成！');
            // navigate('/trip-confirmed');
        }
    };

    return (
        <div className="trip-customization-page">
            <TripSummaryBar
                trips={trips}
                startDate={startDate}
                endDate={endDate}
                totalPeople={totalPeople}
                totalPrice={totalPrice}
            />

            {/* ✨ 初始畫面 */}
            {step === 0 ? (
                <div className="tripcustom-intro">
                    <div className="tripcustom-intro-wrapper">
                        <div className="tripcustom-intro-left">
                            <img src={`${import.meta.env.BASE_URL}images/tripcustom-intro-1.jpg`} alt="北歐景1" className="intro-img-main" />
                            <img src={`${import.meta.env.BASE_URL}images/tripcustom-intro-2.jpg`} alt="北歐景2" className="intro-img-sub" />
                        </div>
                        <div className="tripcustom-intro-right">
                            <h2 className="zh-title-36 tripcustom-highlight">即將為您客製化需求</h2>
                            <p className="zh-text-24">
                                不只是行程規劃，更是專屬您的北歐生活提案。我們將根據您的喜好與節奏，量身打造每一站、每一景，讓您感受真正屬於您的北歐之旅。
                            </p>
                            <button className="tripcustom-next-step-btn zh-text-18" onClick={handleNextStep}>
                                下一步 ➔
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="tripcustom-question">
                    {/* 🔥 插入六步驟進度條 (在白色卡片上方) */}
                    <div className="tripcustom-stepper">
                        {[
                            '私人導遊',
                            '專車接送',
                            '升級住宿',
                            '飲食需求',
                            '特殊需求',
                            '聯絡資訊'
                        ].map((label, index) => (
                            <div className="stepper-item" key={index}>
                                <div className={`stepper-circle ${step === index + 1 ? 'active' : ''}`} />
                                {index < 5 && <div className="stepper-line" />}
                                <div className="stepper-label">{label}</div>
                            </div>
                        ))}
                    </div>
                    <div className="tripcustom-stepper-spacer"></div> {/* ✅ 控制間距 */}
                    {/* 🔥 白色問題卡片區 */}
                    <div className="tripcustom-question-card">
                        {step === 1 && (
                            <>
                                <h2>請問您需要專屬導遊 / 私人導覽嗎？</h2>
                                <div className="tripcustom-options">
                                    <button>是</button>
                                    <button>否</button>
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <h2>請問您需要豪華專車接送嗎？</h2>
                                <div className="tripcustom-options">
                                    <button>是</button>
                                    <button>否</button>
                                </div>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <h2>請問您需要升級住宿嗎？</h2>
                                <div className="tripcustom-options">
                                    <button>是</button>
                                    <button>否</button>
                                </div>
                            </>
                        )}
                        {step === 4 && (
                            <>
                                <h2>請問您有素食的需求嗎？</h2>
                                <div className="tripcustom-options">
                                    <button>是</button>
                                    <button>否</button>
                                </div>
                            </>
                        )}
                        {step === 5 && (
                            <>
                                <h2>特殊需求</h2>
                                <textarea className="tripcustom-textarea" placeholder="請輸入您的特殊需求..." />
                            </>
                        )}
                        {step === 6 && (
                            <>
                                <h2>讓我們為您打造成完美旅程</h2>
                                <input className="tripcustom-input" type="text" placeholder="姓名" />
                                <input className="tripcustom-input" type="email" placeholder="Email" />
                                <input className="tripcustom-input" type="text" placeholder="聯絡電話" />
                            </>
                        )}
                    </div>

                    {/* 🔥 下一步按鈕 */}
                    <div className="tripcustom-next-step-btn-wrapper">
                        <button className="tripcustom-next-step-btn zh-text-18" onClick={handleNextStep}>
                            {step === 6 ? '確認' : '下一步 ➔'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TripCustomization;










