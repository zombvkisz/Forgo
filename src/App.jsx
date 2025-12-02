import React, { useState, useEffect, useRef } from 'react';
import { Heart, Star, Calendar, RefreshCcw, Bell, Settings, X, Check, CloudRain, Sun, ChevronLeft, ChevronRight, Sparkles, MessageCircle } from 'lucide-react';

// --- Components ---

// A simple particle system for the "Yay" effect
const CelebrationParticles = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDuration: 1 + Math.random() * 2,
            delay: Math.random() * 0.5,
            src: Math.random() > 0.5
                ? 'https://i.postimg.cc/jj518J30/tiny-heart.png'
                : 'https://i.postimg.cc/2jBsRhzg/tiny-star.png',
            size: 16 + Math.random() * 12,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((p) => (
                <img
                    key={p.id}
                    src={p.src}
                    alt="confetti"
                    className="absolute animate-fall object-contain drop-shadow-sm"
                    style={{
                        left: `${p.left}%`,
                        top: '-10%',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animation: `fall ${p.animationDuration}s linear forwards`,
                        animationDelay: `${p.delay}s`,
                    }}
                />
            ))}
            <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

// Interactive Page Doll Component
const PageDoll = ({ isHappy }) => {
    const [message, setMessage] = useState(null);
    const [isBounce, setIsBounce] = useState(false);
    const [isTouched, setIsTouched] = useState(false); // State for image swap

    const messages = [
        "You're doing great!",
        "Look at that progress!",
        "Keep it up, senpai",
        "So proud of you!",
        "One day at a time!",
        "We got this!",
        "Sending hugs! ʕ •́ ֊ •̀ ʔ"
    ];

    const handleInteract = (e) => {
        setIsBounce(true);
        setIsTouched(true); // Swap image to "touched" state

        // Play Random Sound
        const soundId = Math.floor(Math.random() * 12) + 1;
        const audio = new Audio(`assets/sound${soundId}.wav`);
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play failed (user interaction required):", e));

        // Reset visual state after animation
        setTimeout(() => {
            setIsBounce(false);
            setIsTouched(false); // Swap image back
        }, 300);

        // Pick random message
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setMessage(randomMsg);

        // Hide message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
    };

    // Determine which image to show
    const getDollImage = () => {
        if (isTouched) return "assets/doll touched.png";
        if (isHappy) return "assets/happy.png";
        return "assets/doll.png";
    };

    return (
        <div className="absolute -bottom-48 left-0 right-0 z-30 flex flex-col items-center pointer-events-auto">
            {/* Speech Bubble */}
            {message && (
                <div className="bg-white px-4 py-3 rounded-2xl shadow-md border border-[#EAD2DC] mb-2 text-xs font-bold text-[#6B6D70] animate-fade-in max-w-[160px] text-center relative">
                    {message}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-[#EAD2DC] transform rotate-45"></div>
                </div>
            )}

            {/* The Doll Image */}
            <div
                onClick={handleInteract}
                className={`cursor-pointer transition-transform duration-300 ${isBounce ? '-translate-y-2 scale-105' : 'hover:scale-105'}`}
            >
                <img
                    src={getDollImage()}
                    alt="Page Doll"
                    className="w-56 h-56 object-contain drop-shadow-lg"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-16 h-16 bg-[#EAD2DC] rounded-full flex items-center justify-center text-2xl shadow-sm">🧸</div>';
                    }}
                />
            </div>
        </div>
    );
};

// Cute Sticker Calendar Component
const StickerCalendar = ({ history, onToggleDate, isHappy }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    const changeMonth = (offset) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    const handleDayClick = (day) => {
        const clickedDate = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (clickedDate <= today) {
            onToggleDate(clickedDate.toDateString());
        }
    };

    const renderCalendarDays = () => {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const dateStr = dateObj.toDateString();
            const isChecked = history.includes(dateStr);
            const isToday = dateObj.toDateString() === today.toDateString();
            const isFuture = dateObj > today;

            days.push(
                <div
                    key={d}
                    onClick={() => !isFuture && handleDayClick(d)}
                    className={`relative flex flex-col items-center justify-center w-8 h-9 group transition-all rounded-lg 
            ${isFuture ? 'opacity-50 cursor-default' : 'cursor-pointer hover:bg-[#EAD2DC]'}
          `}
                >
                    <span className={`text-[10px] font-medium ${isToday ? 'text-[#6B6D70] font-bold' : 'text-[#6B6D70]/60'}`}>{d}</span>
                    <div className="w-8 h-8 flex items-center justify-center -mt-0.5">
                        {isChecked ? (
                            <img
                                src="https://i.postimg.cc/QdVVhfVP/heart.png"
                                alt="Heart"
                                className="w-5 h-5 animate-pop hover:scale-125 transition-transform object-contain drop-shadow-sm"
                            />
                        ) : (
                            <div className={`w-1.5 h-1.5 rounded-full transition-all group-hover:bg-[#EAD2DC] ${isToday ? 'bg-[#EAD2DC]' : 'bg-[#6B6D70]/10'}`}></div>
                        )}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="w-full h-full flex flex-col animate-fade-in relative">
            <div className="flex justify-between items-center mb-4 px-2">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-[#EAD2DC] rounded-full text-[#6B6D70] transition">
                    <ChevronLeft size={20} />
                </button>
                <h3 className="font-bold text-[#6B6D70] text-lg">{monthNames[month]} {year}</h3>
                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-[#EAD2DC] rounded-full text-[#6B6D70] transition">
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 place-items-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-[#6B6D70]/50 uppercase">{d}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 gap-x-1 place-items-center relative z-10">
                {renderCalendarDays()}
            </div>

            <div className="mt-4 text-center text-[10px] text-[#6B6D70]/50 italic">
                Tap a day to edit history.
            </div>

            {/* Page Doll receives happy state */}
            <PageDoll isHappy={isHappy} />
        </div>
    );
};

// Comfort Modal
const ComfortModal = ({ onClose, onReset }) => {
    // Play rattle sound on mount
    useEffect(() => {
        const audio = new Audio('assets/rattle.wav');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Sound play failed", e));
    }, []);

    const comfortMessages = [
        "Progress isn't a straight line. You're doing great!",
        "One bad day doesn't erase your progress.",
        "Be gentle with yourself. Tomorrow is a fresh start.",
    ];
    const randomMsg = comfortMessages[Math.floor(Math.random() * comfortMessages.length)];

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#FEFCF5] rounded-3xl p-6 max-w-xs w-full shadow-xl text-center border-4 border-[#EAD2DC]">
                <div className="mx-auto bg-[#EAD2DC]/30 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                    <CloudRain className="w-8 h-8 text-[#6B6D70]" />
                </div>
                <h3 className="text-lg font-bold text-[#6B6D70] mb-2">It's okay.</h3>
                <p className="text-[#6B6D70]/70 mb-4 text-sm">{randomMsg}</p>

                <div className="space-y-2">
                    <button
                        onClick={onReset}
                        className="w-full bg-[#6B6D70] hover:bg-[#555759] text-[#FEFCF5] font-bold py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
                    >
                        <RefreshCcw size={16} />
                        Start Fresh
                    </button>
                    <button onClick={onClose} className="w-full text-[#6B6D70]/50 py-2 text-xs">Cancel</button>
                </div>
            </div>
        </div>
    );
};

// Reward Modal
const RewardModal = ({ streak, onClose }) => {
    // Play rattle sound on mount
    useEffect(() => {
        const audio = new Audio('assets/rattle.wav');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Sound play failed", e));
    }, []);

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-bounce-in">
            <div className="bg-[#FEFCF5] rounded-3xl p-6 max-w-xs w-full shadow-xl text-center border-4 border-[#EAD2DC] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#EAD2DC]"></div>
                <div className="mx-auto bg-[#EAD2DC]/30 w-20 h-20 rounded-full flex items-center justify-center mb-3 animate-pulse">
                    <Star className="w-10 h-10 text-[#6B6D70] fill-current" />
                </div>
                <h3 className="text-xl font-bold text-[#6B6D70] mb-1">Amazing Job!</h3>
                <p className="text-[#6B6D70]/70 mb-4 text-sm">
                    You've kept your streak for <span className="font-bold text-[#6B6D70]">{streak} days!</span>
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-[#6B6D70] hover:bg-[#555759] text-[#FEFCF5] font-bold py-2.5 px-4 rounded-xl shadow-md text-sm"
                >
                    Yay! Thanks!
                </button>
            </div>
        </div>
    );
};

// Main App Component
export default function App() {
    const [activeTab, setActiveTab] = useState('tracker');
    const [goal, setGoal] = useState("Stay Hydrated");
    const [history, setHistory] = useState([]);
    const [streak, setStreak] = useState(0);
    const [lastCheckIn, setLastCheckIn] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [showComfort, setShowComfort] = useState(false);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // Determine if the doll should be happy (Streak >= 7)
    const isHappy = streak >= 7;

    // Global Click Sound
    useEffect(() => {
        const playClick = () => {
            const audio = new Audio('assets/cute.wav');
            audio.volume = 0.4;
            audio.play().catch(e => console.log("Click sound failed", e));
        };

        window.addEventListener('click', playClick);
        return () => window.removeEventListener('click', playClick);
    }, []);

    const calculateStreak = (historyDates) => {
        if (!historyDates || historyDates.length === 0) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const hasToday = historyDates.includes(today.toDateString());
        const hasYesterday = historyDates.includes(yesterday.toDateString());

        if (!hasToday && !hasYesterday) return 0;

        let currentStreak = 0;
        let checkDate = hasToday ? today : yesterday;

        while (true) {
            if (historyDates.includes(checkDate.toDateString())) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else { break; }
        }
        return currentStreak;
    };

    useEffect(() => {
        const savedGoal = localStorage.getItem('kk_goal');
        const savedNotif = localStorage.getItem('kk_notif');
        const savedHistory = localStorage.getItem('kk_history');

        if (savedGoal) setGoal(savedGoal);
        if (savedNotif) setNotificationsEnabled(JSON.parse(savedNotif));

        if (savedHistory) {
            const parsedHistory = JSON.parse(savedHistory);
            setHistory(parsedHistory);
            setStreak(calculateStreak(parsedHistory));
            if (parsedHistory.length > 0) {
                const todayStr = new Date().toDateString();
                if (parsedHistory.includes(todayStr)) setLastCheckIn(todayStr);
                else setLastCheckIn(null);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('kk_goal', goal);
        localStorage.setItem('kk_notif', JSON.stringify(notificationsEnabled));
        localStorage.setItem('kk_history', JSON.stringify(history));
        setStreak(calculateStreak(history));
        const todayStr = new Date().toDateString();
        if (history.includes(todayStr)) setLastCheckIn(todayStr);
        else setLastCheckIn(null);
    }, [goal, history, notificationsEnabled]);

    const isCheckedInToday = () => history.includes(new Date().toDateString());

    const handleToggleDate = (dateStr) => {
        let newHistory;
        if (history.includes(dateStr)) newHistory = history.filter(d => d !== dateStr);
        else newHistory = [...history, dateStr];
        setHistory(newHistory);
    };

    const handleCheckIn = () => {
        const todayStr = new Date().toDateString();
        if (history.includes(todayStr)) return;
        handleToggleDate(todayStr);

        // Play Yay Sound
        const audio = new Audio('assets/yay.wav');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Yay sound failed", e));

        setShowConfetti(true);
        setTimeout(() => { setShowReward(true); setShowConfetti(false); }, 1500);
    };

    const handleResetRequest = () => setShowComfort(true);
    const confirmReset = () => { setHistory([]); setShowComfort(false); };
    const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

    return (
        <div className="min-h-screen bg-[#D4E0E8] text-[#6B6D70] selection:bg-[#EAD2DC] selection:text-[#6B6D70] flex flex-col items-center py-4 px-4 overflow-hidden">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap');
        body, .font-fredoka { font-family: 'Fredoka', sans-serif !important; }
        @keyframes pop { 0% { transform: scale(0.8); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>

            {showConfetti && <CelebrationParticles />}
            {showReward && <RewardModal streak={streak} onClose={() => setShowReward(false)} />}
            {showComfort && <ComfortModal onClose={() => setShowComfort(false)} onReset={confirmReset} />}

            {/* COMPACT Header - Bigger Logos */}
            <div className="w-full max-w-md relative flex items-center justify-center mb-6 mt-4">
                <div className="flex items-center gap-4">
                    <img
                        src="https://i.postimg.cc/MHHsKkRf/logo_logo.png"
                        alt="Forgo Logo"
                        className="w-24 h-24 object-contain drop-shadow-sm p-1"
                    />
                    <img
                        src="https://i.postimg.cc/wTsVWQQr/logo-type.png"
                        alt="Forgo"
                        className="h-16 object-contain drop-shadow-sm opacity-90"
                    />
                </div>
                <button onClick={toggleNotifications} className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full transition ${notificationsEnabled ? 'bg-[#FEFCF5] text-[#6B6D70]' : 'bg-transparent text-[#6B6D70]/60 hover:bg-[#FEFCF5]/50'}`}>
                    <Bell size={24} className={notificationsEnabled ? 'fill-current' : ''} />
                </button>
            </div>

            {/* COMPACT Tabs */}
            <div className="flex bg-[#FEFCF5]/40 p-1 rounded-xl mb-3 shadow-sm border border-[#FEFCF5]/50 backdrop-blur-md w-full max-w-xs">
                <button onClick={() => setActiveTab('tracker')} className={`flex-1 px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-1.5 ${activeTab === 'tracker' ? 'bg-[#FEFCF5] text-[#6B6D70] shadow-sm' : 'text-[#6B6D70]/70'}`}>
                    <Heart size={14} className={activeTab === 'tracker' ? 'fill-current' : ''} /> Today
                </button>
                <button onClick={() => setActiveTab('calendar')} className={`flex-1 px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-1.5 ${activeTab === 'calendar' ? 'bg-[#FEFCF5] text-[#6B6D70] shadow-sm' : 'text-[#6B6D70]/70'}`}>
                    <Calendar size={14} className={activeTab === 'calendar' ? 'fill-current' : ''} /> Journey
                </button>
            </div>

            {/* Main Card - Modified for Doll Overflow */}
            <div className="w-full max-w-md bg-[#FEFCF5] rounded-[2rem] shadow-xl shadow-[#6B6D70]/10 p-5 flex flex-col items-center relative flex-1 max-h-[600px]">
                {/* Blob Container - Hidden Overflow */}
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-[#D4E0E8]/50 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-[#EAD2DC]/30 rounded-full blur-3xl opacity-60"></div>
                </div>

                {activeTab === 'tracker' ? (
                    <div className="w-full flex flex-col items-center animate-fade-in z-10 flex-1 justify-center">
                        {/* Goal Input */}
                        <div className="w-full mb-4">
                            <div className="text-center">
                                <span className="text-[10px] font-bold text-[#6B6D70]/60 uppercase tracking-widest mb-1 block flex justify-center items-center gap-1">
                                    <Sparkles size={10} /> I want to...
                                </span>
                                {isEditingGoal ? (
                                    <div className="flex items-center gap-2 w-full animate-fade-in justify-center">
                                        <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} className="w-48 bg-[#EAD2DC]/30 border-2 border-[#EAD2DC] rounded-xl px-3 py-2 text-center text-[#6B6D70] text-lg font-bold focus:outline-none" autoFocus onBlur={() => setIsEditingGoal(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingGoal(false)} />
                                        <button onClick={() => setIsEditingGoal(false)} className="p-2 bg-[#EAD2DC]/50 rounded-lg text-[#6B6D70]"><Check size={16} /></button>
                                    </div>
                                ) : (
                                    <div onClick={() => setIsEditingGoal(true)} className="group flex items-center justify-center gap-2 cursor-pointer hover:bg-[#EAD2DC]/20 px-4 py-2 rounded-xl transition">
                                        <h2 className={`text-2xl font-bold ${!goal ? 'text-[#6B6D70]/30 italic' : 'text-[#6B6D70]'}`}>{goal || "Set a goal..."}</h2>
                                        <Settings size={14} className="text-[#6B6D70]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Streak Counter */}
                        <div className="flex flex-col items-center mb-6">
                            <span className="text-xs font-semibold text-[#6B6D70]/60 uppercase tracking-wider mb-1">Current Streak</span>
                            <div className="relative">
                                <div className="text-7xl font-bold text-[#6B6D70] tracking-tighter leading-none">{streak}</div>
                                <img src="https://i.postimg.cc/g2rrmgnW/fire.png" alt="On Fire!" className="absolute -right-5 -top-1 w-6 h-6 animate-bounce drop-shadow-sm" />
                            </div>
                            <span className="text-[#6B6D70]/60 font-medium text-xs mt-1">days</span>
                        </div>

                        {/* Check-in Button */}
                        <button onClick={handleCheckIn} disabled={isCheckedInToday()} className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl ${isCheckedInToday() ? 'bg-[#EAD2DC]/30 text-[#6B6D70] cursor-default scale-100 ring-4 ring-[#EAD2DC]/30' : 'bg-[#6B6D70] text-[#FEFCF5] hover:scale-105 active:scale-95 shadow-[#6B6D70]/30 cursor-pointer ring-4 ring-[#6B6D70]/10'}`}>
                            {isCheckedInToday() ? (
                                <> <Check size={40} strokeWidth={3} /> <span className="text-[10px] font-bold mt-1">Done!</span> </>
                            ) : (
                                <> <Heart size={40} className="fill-current animate-pulse-slow" /> <span className="text-xs font-bold mt-1">Check In</span> </>
                            )}
                        </button>

                        {/* Comfort Button */}
                        <button onClick={handleResetRequest} className="mt-6 py-2 px-4 text-[10px] font-medium text-[#6B6D70]/40 hover:text-[#6B6D70] hover:bg-[#EAD2DC]/30 rounded-lg transition-colors">Oh no, I missed a day...</button>
                    </div>
                ) : (
                    <div className="w-full h-full z-10 flex-1">
                        <StickerCalendar history={history} onToggleDate={handleToggleDate} isHappy={isHappy} />
                    </div>
                )}
            </div>

            {notificationsEnabled && (
                <div className="mt-4 bg-[#FEFCF5] text-[#6B6D70] px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 animate-fade-in shadow-sm border border-[#EAD2DC]/50">
                    <Bell size={10} className="fill-current" /> Cute reminders are ON!
                </div>
            )}
        </div>
    );
}