import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserTrips } from '../utils/tripUtils';
import '../styles/TripCustomization.css';
import { useTripStore } from '../store/useTripStore'; // ✅ 一定要有！
import TripSummaryBar from '../components/TripSummaryBar';

function TripCustomization() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const location = useLocation();
    const [trips, setTrips] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPeople, setTotalPeople] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const { setPendingTrips } = useTripStore(); // ✅ 加這行！
    const [foodNote, setFoodNote] = useState('');
    const [step, setStep] = useState(0);
    const [options, setOptions] = useState({});
    const [specialRequest, setSpecialRequest] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [phoneCountryCode, setPhoneCountryCode] = useState('+886 台灣');
    const [customCountryCode, setCustomCountryCode] = useState('');
    const [isCustomCountry, setIsCustomCountry] = useState(false);
    const [animatedSteps, setAnimatedSteps] = useState([]);
    const [emailError, setEmailError] = useState('');


    const isStepAnswered = (stepIndex) => {
        if (stepIndex >= 1 && stepIndex <= 4) return !!options[stepIndex];     // 有選是/否
        if (stepIndex === 5) return specialRequest.trim() !== '';              // 有填特殊需求
        if (stepIndex === 6) return step >= 6;                                 // 第六步要實際到達過
        return false;
    };


    const isLineActive = (index) => {
        const next = index + 1;
        return step > next && isStepAnswered(next) && animatedSteps.includes(index);
    };


    useEffect(() => {
        if (step > 1) {
            const prevLineIndex = step - 2;
            setAnimatedSteps((prev) => {
                // 確保不重複
                return prev.includes(prevLineIndex) ? prev : [...prev, prevLineIndex];
            });
        }
    }, [step]);



    const countryCodeMap = {
        '+886': '台灣',
        '+81': '日本',
        '+82': '韓國',
        '+1': '美國',
        '+44': '英國',
        '+852': '香港',
        '+33': '法國'
    };

    // 🔥這裡是改過的useEffect
    useEffect(() => {
        const updateFromSessionStorage = () => {
            const storedTrips = JSON.parse(sessionStorage.getItem('confirmedTrips')) || [];
            const storedStartDate = sessionStorage.getItem('confirmedStartDate') || '';
            const storedEndDate = sessionStorage.getItem('confirmedEndDate') || '';
            const storedTotalPeople = parseInt(sessionStorage.getItem('confirmedTotalPeople'), 10) || 0;
            const storedTotalPrice = parseInt(sessionStorage.getItem('confirmedTotalPrice'), 10) || 0;

            if (storedTrips.length === 0) {
                // ✅ 如果刪光行程：
                setTrips([]);
                setStartDate('');
                setEndDate('');
                setTotalPeople(0);
                setTotalPrice(0);
                setPendingTrips([]); // ✅ ✅ ✅ 同時清掉global pendingTrips
                navigate('/my-trip'); // ✅ 然後跳轉回我的行程頁
            } else {
                // ✅ 正常有資料
                setTrips(storedTrips);
                setStartDate(storedStartDate);
                setEndDate(storedEndDate);
                setTotalPeople(storedTotalPeople);
                setTotalPrice(storedTotalPrice);
            }
        };

        updateFromSessionStorage();

        const handleConfirmedTripsChanged = () => {
            updateFromSessionStorage();
        };

        window.addEventListener('confirmedTripsChanged', handleConfirmedTripsChanged);

        return () => {
            window.removeEventListener('confirmedTripsChanged', handleConfirmedTripsChanged);
        };
    }, [navigate, setPendingTrips]);
    // ✅ 注意：useEffect要加 navigate 依賴，不然React會警告

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleNextStep = () => {
        if (step === 0) {
            setStep(1);
        } else if (step >= 1 && step <= 4) {
            if (!options[step]) {
                alert('請選擇是或否');
                return;
            }
            setStep(prev => prev + 1);
        } else if (step === 5) {
            console.log('[🟠 specialRequest]', specialRequest, '| [🟠 將進入 Step 6]');

            if (!specialRequest.trim()) {
                setSpecialRequest('無');
            }

            // ✅ 先等待 specialRequest 更新，再進入下一步（確保動畫 useEffect 能正確觸發）
            setTimeout(() => {
                setStep(6);
            }, 20); // 20~50ms 即可，確保畫面有 re-render 的機會
        }



        else if (step === 6) {
            // ✅ 檢查 Step 1～4 是否都有填
            const requiredSteps = [1, 2, 3, 4];
            const allOptionsSelected = requiredSteps.every(s => options[s]);

            if (!allOptionsSelected) {
                alert('請完成所有客製化問題（步驟1～4）再送出');
                return;
            }

            // ✅ 檢查表單欄位
            if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
                alert('請完整填寫姓名、Email 和聯絡電話');
                return;
            }

            if (!validateEmail(formData.email)) {
                setEmailError('請輸入正確的 Email 格式');
                return;
            } else {
                setEmailError('');
            }

            // 🔸 如果選了有飲食需求但沒填內容，補上「無特別說明」
            if (options[4] === 'yes' && !foodNote.trim()) {
                setFoodNote('無特別說明');
            }

            // 🧡 模擬送出 summary 表單資料（給總覽頁）
            const summaryData = {
                options,
                specialRequest,
                foodNote,
                formData,
                startDate,
                endDate,
                totalPeople,
                totalPrice,
                trips,
            };
            sessionStorage.setItem('tripSummary', JSON.stringify(summaryData));
            alert('表單送出完成！');
            // 導向 TripSummary 頁面
            navigate('/trip-summary');
        }

    };

    const handleStepperClick = (index) => {
        const stepIndex = index + 1;

        // ✅ 已填過的才可點擊回去修改
        if (
            (stepIndex <= 4 && options[stepIndex]) ||     // 第 1～4 題有填是/否
            stepIndex === 5 ||                            // 特殊需求不用填，永遠允許
            (stepIndex === 6 && step >= 6)                // 第六題（聯絡資訊）已達該步才可回去點
        ) {
            setStep(stepIndex);
        }
    };


    const handleCountryCodeChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setIsCustomCountry(true);
            setPhoneCountryCode('');
        } else {
            setIsCustomCountry(false);
            setPhoneCountryCode(value);
        }
    };

    const handleCustomCountryCodeInput = (e) => {
        const value = e.target.value;
        const country = countryCodeMap[value] || '';

        setCustomCountryCode(value);

        if (country) {
            // ✅ 如果輸入符合已知國碼，回到選單並顯示國家名稱
            setIsCustomCountry(false);
            setPhoneCountryCode(`${value} ${country}`);
        } else if (value === '') {
            // ✅ 清空也回到預設台灣
            setIsCustomCountry(false);
            setPhoneCountryCode('+886 台灣');
        } else {
            // ✅ 不符合時，保持手動輸入
            setPhoneCountryCode(value);
        }
    };



    return (
        <div className="trip-customization-page">
            <TripSummaryBar trips={trips} startDate={startDate} endDate={endDate} totalPeople={totalPeople} totalPrice={totalPrice} />

            {step === 0 ? (
                <div className="tripcustom-intro">
                    <div className="tripcustom-intro-wrapper">
                        <div className="tripcustom-intro-left">
                            <img src={`${import.meta.env.BASE_URL}images/tripcustom-intro-1.jpg`} alt="北歐景1" className="intro-img-main" />
                            <img src={`${import.meta.env.BASE_URL}images/tripcustom-intro-2.jpg`} alt="北歐景2" className="intro-img-sub" />
                        </div>
                        <div className="tripcustom-intro-right">
                            <h2 className="zh-title-36 tripcustom-highlight">即將為您客製化需求</h2>
                            <p className="zh-text-24">不只是行程規劃，更是專屬您的北歐生活提案。我們將根據您的喜好與節奏，量身打造每一站、每一景，讓您感受真正屬於您的北歐之旅。</p>
                            <button className="tripcustom-next-step-btn zh-text-18" onClick={handleNextStep}>下一步 ➔</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="tripcustom-question">
                    <div className="tripcustom-stepper">
                        {['私人導遊', '專車接送', '升級住宿', '飲食需求', '特殊需求', '聯絡資訊'].map((label, index) => {
                            const stepIndex = index + 1;

                            // ✅ 確認該步驟是否已完成填寫
                            const isStepDone =
                                (stepIndex <= 4 && options[stepIndex]) || // 前四題有填
                                (stepIndex === 5 && step >= 5) ||         // ✅ 特殊需求只有 step 到達 5 才能點
                                (stepIndex === 6 && step >= 6);           // 聯絡資訊也一樣


                            return (
                                <div
                                    className={`stepper-item ${isStepDone ? 'clickable' : ''}`}
                                    key={index}
                                    onClick={() => {
                                        if (isStepDone) handleStepperClick(index);
                                    }}
                                >
                                    <div
                                        className={`stepper-circle ${step >= stepIndex ? 'active' : ''} ${step === stepIndex ? 'current' : ''}`}
                                    />
                                    {index < 5 && (
                                        <div
                                            className={`stepper-line ${isLineActive(index) ? 'active' : ''
                                                }`}
                                        />
                                    )}

                                    <div className="stepper-label">{label}</div>
                                </div>
                            );
                        })}

                    </div>

                    <div className="tripcustom-stepper-spacer"></div>

                    <div className="tripcustom-question-card">
                        {step >= 1 && step <= 4 && (
                            <>
                                <h2>
                                    {step === 4
                                        ? '請問您有任何飲食禁忌或素食需求嗎？'
                                        : ['請問您需要專屬導遊 / 私人導覽嗎？', '請問您需要豪華專車接送嗎？', '請問您需要升級住宿嗎？'][step - 1]}
                                </h2>

                                {step === 4 && (
                                    <p className="tripcustom-hint zh-text-14">
                                        例如：不吃牛、豬、海鮮，或因宗教、健康、過敏等原因有特定需求
                                    </p>
                                )}

                                <div className="tripcustom-options">
                                    <div
                                        className={`tripcustom-option-item ${options[step] === 'yes' ? 'active' : ''}`}
                                        onClick={() => setOptions({ ...options, [step]: 'yes' })}
                                    >
                                        <div className="option-circle"></div>
                                        <div className="zh-title-32">是</div>
                                    </div>
                                    <div
                                        className={`tripcustom-option-item ${options[step] === 'no' ? 'active' : ''}`}
                                        onClick={() => setOptions({ ...options, [step]: 'no' })}
                                    >
                                        <div className="option-circle"></div>
                                        <div className="zh-title-32">否</div>
                                    </div>
                                </div>

                                {step === 4 && options[4] === 'yes' && (
                                    <textarea
                                        className="tripcustom-textarea"
                                        placeholder="請簡單描述您的飲食需求，例如不吃牛、海鮮過敏等..."
                                        value={foodNote}
                                        onChange={(e) => setFoodNote(e.target.value)}
                                    />
                                )}
                            </>
                        )}



                        {step === 5 && (
                            <>
                                <h2>特殊需求</h2>
                                <textarea className="tripcustom-textarea" placeholder="請輸入您的特殊需求..." value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} />
                            </>
                        )}

                        {step === 6 && (
                            <>
                                <h2>讓我們為您打造完美旅程</h2>
                                {emailError && (
                                    <div className="tripcustom-error-global">
                                        <span className="tripcustom-error-icon">⚠️</span>
                                        <span className="tripcustom-error-text">請輸入正確的 Email 格式</span>
                                    </div>
                                )}

                                <div className="tripcustom-input-group">
                                    <div className="tripcustom-input-row">
                                        <div className="tripcustom-label-wrapper">
                                            <div className="tripcustom-input-label">姓名</div>
                                            <div className="tripcustom-input-colon">：</div>
                                        </div>
                                        <input className="tripcustom-input" type="text" placeholder="請輸入姓名" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="tripcustom-input-row">
                                        <div className="tripcustom-label-wrapper">
                                            <div className="tripcustom-input-label">Email</div>
                                            <div className="tripcustom-input-colon">：</div>
                                        </div>
                                        <input className="tripcustom-input" type="text" placeholder="請輸入Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                    <div className="tripcustom-input-row">
                                        <div className="tripcustom-label-wrapper">
                                            <div className="tripcustom-input-label">聯絡電話</div>
                                            <div className="tripcustom-input-colon">：</div>
                                        </div>
                                        <div className="tripcustom-phone-outer-wrapper">
                                            <div className="tripcustom-phone-full-wrapper">
                                                {!isCustomCountry ? (
                                                    <select className="tripcustom-phone-select" value={phoneCountryCode} onChange={handleCountryCodeChange}>
                                                        <option value="+886 台灣">+886 台灣</option>
                                                        <option value="+81 日本">+81 日本</option>
                                                        <option value="+82 韓國">+82 韓國</option>
                                                        <option value="+1 美國">+1 美國</option>
                                                        <option value="+44 英國">+44 英國</option>
                                                        <option value="custom">其他</option>
                                                    </select>
                                                ) : (
                                                    <input className="tripcustom-phone-select" type="text" placeholder="輸入國碼" value={customCountryCode} onChange={handleCustomCountryCodeInput} />
                                                )}
                                                <input className="tripcustom-input phone-input" type="text" placeholder="請輸入聯絡電話" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="tripcustom-next-step-btn-wrapper">
                            <button className="tripcustom-next-step-btn zh-text-18" onClick={handleNextStep}>{step === 6 ? '確認 ➔' : '下一步 ➔'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TripCustomization;

