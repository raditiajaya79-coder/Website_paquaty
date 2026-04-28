import React, { useState, useRef, useEffect } from 'react';
import { useGlobalData } from '../context/GlobalDataContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Komponen pembantu untuk efek mengetik (Typewriter)
 * Tetap dipertahankan untuk memisahkan logika UI mengetik dari wadah state agar tidak berantakan.
 */
const TypewriterText = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
                // Trigger scroll agar window chat ke bawah perlahan seiring ngetik bertambah panjang
                if (onComplete && currentIndex % 10 === 0) onComplete();
            }, 25);
            return () => clearTimeout(timeout);
        } else {
            if (onComplete) onComplete();
        }
    }, [currentIndex, text, onComplete]);

    return (
        <span>
            {displayedText}
            {currentIndex < text.length && <span className="inline-block w-1 h-3 ml-0.5 bg-stone-300 animate-pulse"></span>}
        </span>
    );
};

/**
 * FloatingChatbot
 * Telah DIKEMBALIKAN (Reverted) ke desain bentuk pertama yang disukai (UI yang simpel, padat, dan solid).
 * Namun Engine/Logic di dalamnya dipertahankan menggunakan upgrade Typewriter animasi panjang.
 */
const FloatingChatbot = () => {
    // STATE UNTUK UI
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    
    // MENGAMBIL DATA PRODUK DARI GLOBAL CONTEXT
    const { products } = useGlobalData();
    
    // STATE UNTUK RIWAYAT PESAN
    // Pesan pertama disetel statis tanpa animasi
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Halo! Selamat datang. Ada yang bisa kami bantu seputar Keripik Tempe Pakuaty hari ini?', animate: false }
    ]);
    
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Fungsi otomatis scrollToBottom saat ada render pesan baru
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleToggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        const textToProcess = inputValue.trim();
        if (!textToProcess) return;

        // Cetak bubble User
        setMessages((prev) => [...prev, { role: 'user', text: textToProcess }]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Membuat session unik per browser untuk kebutuhan Node Memory di n8n
            let chatSessionId = localStorage.getItem('pakuaty_chat_session');
            if (!chatSessionId) {
                chatSessionId = 'pakuaty-' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('pakuaty_chat_session', chatSessionId);
            }

            // INTEGRASI REAL KE n8n WEBHOOK WEB
            const response = await fetch('https://auto.apps.kediritechnopark.com/webhook/chatbot_pakuaty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: textToProcess, // key parameter yang ditangkap webhook n8n
                    sessionId: chatSessionId, // untuk dihubungkan ke Session ID di n8n Memory
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error('Response API Webhook gagal.');

            // Ekstraksi data secara dinamis
            const contentType = response.headers.get("content-type");
            let botReply = '';

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                
                // Helper untuk mengekstrak string jika struktur JSON tidak lazim (mencegah error key bersarang n8n)
                const extractStringFallback = (obj) => {
                    if (typeof obj === 'string') return obj;
                    if (typeof obj === 'object' && obj !== null) {
                        for (let k in obj) {
                            if (typeof obj[k] === 'string') return obj[k];
                            let res = extractStringFallback(obj[k]);
                            if (res) return res;
                        }
                    }
                    return JSON.stringify(obj);
                };

                // Membongkar hasil dari standar format n8n array atau object tunggal
                if (Array.isArray(data) && data.length > 0) {
                    botReply = data[0].output || data[0].text || data[0].message || data[0].response || extractStringFallback(data[0]);
                } else if (data.output || data.text || data.message || data.response) {
                    botReply = data.output || data.text || data.message || data.response;
                } else {
                    botReply = extractStringFallback(data);
                }
            } else {
                botReply = await response.text();
            }

            // Cegah error blank response dari n8n webhook node
            if (!botReply || botReply.trim() === '[]') {
                botReply = "Maaf, sistem AI merespons dengan hasil kosong. Mohon atur node format Output pada n8n Anda.";
            }

            // Keputusan Animasi yang Dipertahankan (Skip efek ngetik jika teks kepanjangan agar tidak mengganggu kecepatan baca)
            const shouldAnimate = botReply.length < 100;

            // Cetak Bubble Bot
            setMessages((prev) => [...prev, { 
                role: 'bot', 
                text: botReply, 
                animate: shouldAnimate 
            }]);
        } catch (error) {
            console.error("n8n Webhook Error:", error);
            setMessages((prev) => [...prev, { role: 'bot', text: 'Maaf, terjadi kendala saat menghubungi ke n8n server. Apakah Webhook di n8n-nya sudah aktif (Active/Test)?', animate: false }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {/* Dikembalikan ke desain popup pertama, namun dengan overflow-visible agar gambar pop-out bisa keluar melewati batas atas */}
            <div 
                className={`mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-stone-100 transition-all duration-300 origin-bottom-right flex flex-col relative z-50 ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none absolute bottom-0'
                }`}
            >
                {/* 
                  Gambar Produk "Pop Out" (3D Effect) - Terkonsentrasi di Kiri Atas menggantikan Profil
                */}
                <div className="absolute -top-[4rem] -left-2 pointer-events-none z-30 w-44 h-40 group">
                    {/* Kemasan Belakang Kiri (BBQ) - Diposisikan seimbang di kiri belakang */}
                    <img 
                        src="/Foto_productNew/10. BBQ - DEPAN.webp" 
                        alt="BBQ" 
                        className="w-[3.8rem] h-auto -rotate-[22deg] drop-shadow-md absolute top-[2.5rem] left-0 opacity-95 transition-all duration-300 group-hover:-translate-x-1 group-hover:-rotate-[25deg]" 
                        onError={(e) => { e.target.style.display='none'; }}
                    />
                    {/* Kemasan Belakang Kanan (Balado) - Diposisikan seimbang di kanan belakang */}
                    <img 
                        src="/Foto_productNew/04. BALADO - DEPAN PNG.webp" 
                        alt="Balado" 
                        className="w-[3.8rem] h-auto rotate-[22deg] drop-shadow-md absolute top-[2.5rem] left-[4.6rem] opacity-95 transition-all duration-300 group-hover:translate-x-1 group-hover:rotate-[25deg]" 
                        onError={(e) => { e.target.style.display='none'; }}
                    />
                    {/* Kemasan Depan (Original - Titik Fokus Tengah Depan) */}
                    <img 
                        src="/Foto_productNew/01. ORIGINAL - DEPAN PNG.webp" 
                        alt="Original" 
                        className="w-[5.2rem] h-auto -rotate-3 drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] absolute top-[0.8rem] left-[1.6rem] z-10 pointer-events-auto hover:-translate-y-3 hover:rotate-0 hover:scale-110 transition-all duration-300 ease-out cursor-pointer" 
                        onError={(e) => { e.target.style.display='none'; }}
                    />
                </div>

                {/* Desain Header Profesional dengan Soft Brand Color */}
                <div className="bg-gradient-to-r from-brand-blue to-[#3366A6] flex flex-col shadow-md relative overflow-hidden shrink-0 rounded-t-2xl z-10">
                    {/* Motif Dekorasi Latar Header */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none blur-xl"></div>
                    
                    <div className="p-4 flex items-center justify-start relative z-40 h-14 pl-[8.5rem]">
                        <div className="flex flex-col">
                            <h3 className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-brand-gold font-extrabold text-[17px] tracking-wide drop-shadow-md">Asisten Pakuaty</h3>
                            <span className="text-white/75 text-[9px] uppercase tracking-[0.25em] font-medium mt-0.5">Layanan Cerdas</span>
                        </div>
                    </div>
                </div>

                <div className="h-[20rem] sm:h-[24rem] bg-[#FAFAFA] p-4 pt-10 overflow-y-auto flex flex-col gap-3 relative z-0 scroll-smooth">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3, type: "spring", stiffness: 250, damping: 20 }}
                                className={`flex origin-bottom hover:-translate-y-0.5 transition-transform ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* Desain Bubble Pertama: Gold vs White solid dengan border tipis */}
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-brand-gold text-stone-dark rounded-tr-sm shadow-md' 
                                    : 'bg-white border border-stone-200 text-stone-dark rounded-tl-sm shadow-sm'
                                }`}>
                                    {/* Logika integrasi Typewriter dipertahankan */}
                                    {msg.role === 'bot' && msg.animate ? (
                                        <TypewriterText text={msg.text} onComplete={scrollToBottom} />
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    <AnimatePresence>
                        {isLoading && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="flex justify-start origin-bottom"
                            >
                                <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center h-10 px-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce delay-100"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce delay-200"></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Desain Form Input Pertama */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-100 bg-white flex items-center gap-2 rounded-b-2xl relative z-10">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ketik pertanyaan Anda..." 
                        className="flex-1 bg-stone-50 border-transparent outline-none focus:ring-1 focus:ring-brand-gold rounded-full px-4 py-2 text-sm text-stone-dark placeholder-stone-400"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || isLoading}
                        className="w-10 h-10 rounded-full flex-shrink-0 bg-brand-blue flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-blue/90 transition-colors shadow-sm"
                        title="Kirim pesan (Enter)"
                    >
                        {/* 
                          Memperbaiki asimetris optikal pada Send Icon: 
                          Dihapus margin-left yang terlalu besar (ml-1), dan ditambahkan sedikit -ml-[2px] 
                          dan translate-y-[1px] agar secara optikal tepat di tengah lingkaran. 
                        */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] -ml-[2px] mt-[1px]">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>

            {/* Desain Button Pertama: Solid blue flex tanpa ring pulse */}
            <button
                onClick={handleToggleChat}
                className="flex items-center justify-center w-14 h-14 bg-brand-blue text-white rounded-full shadow-2xl hover:shadow-brand-blue/40 hover:-translate-y-1 transition-all duration-300 z-10 relative group"
                title={isOpen ? "Tutup Bantuan" : "Buka Bantuan Virtual"}
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 animate-in zoom-in duration-300">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 transform group-hover:scale-110 transition-transform animate-in zoom-in duration-300">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
            </button>

        </div>
    );
};

export default FloatingChatbot;
