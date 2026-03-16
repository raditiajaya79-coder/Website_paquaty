import { useState, useEffect } from 'react';

/**
 * useAutoTranslate — Hook untuk menerjemahkan teks secara otomatis (Client-side)
 * Menggunakan API MyMemory (gratis untuk penggunaan ringan).
 */
export const useAutoTranslate = (text, targetLang = 'en', sourceLang = 'id') => {
    const [translatedText, setTranslatedText] = useState(text);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        // Jika bahasa target sama dengan bahasa sumber, atau teks kosong, jangan terjemahkan
        if (targetLang === sourceLang || !text || text === '[]' || text === '""') {
            setTranslatedText(text);
            return;
        }

        const translate = async () => {
            setIsTranslating(true);
            try {
                const MAX_CHARS = 500;
                
                // Jika teks pendek, kirim langsung
                if (text.length <= MAX_CHARS) {
                    const response = await fetch(
                        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
                    );
                    const data = await response.json();
                    if (data.responseData) {
                        setTranslatedText(data.responseData.translatedText);
                    }
                } else {
                    // Jika teks panjang, pecah menjadi beberapa bagian (chunking)
                    // Kita pecah berdasarkan titik/kalimat agar lebih rapi
                    const sentences = text.match(/[^.!?]+[.!?]+|\s*\n\s*|[^.!?]+$/g) || [text];
                    let currentChunk = "";
                    let finalTranslation = "";
                    
                    for (const sentence of sentences) {
                        if ((currentChunk + sentence).length > MAX_CHARS) {
                            // Kirim chunk yang sudah penuh
                            const response = await fetch(
                                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(currentChunk)}&langpair=${sourceLang}|${targetLang}`
                            );
                            const data = await response.json();
                            if (data.responseData) {
                                finalTranslation += data.responseData.translatedText + " ";
                            }
                            currentChunk = sentence;
                        } else {
                            currentChunk += sentence;
                        }
                    }
                    
                    // Kirim sisa chunk terakhir
                    if (currentChunk) {
                        const response = await fetch(
                            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(currentChunk)}&langpair=${sourceLang}|${targetLang}`
                        );
                        const data = await response.json();
                        if (data.responseData) {
                            finalTranslation += data.responseData.translatedText;
                        }
                    }
                    
                    setTranslatedText(finalTranslation.trim());
                }
            } catch (err) {
                console.error('Translation error:', err);
                setTranslatedText(text); // Fallback ke teks asli
            } finally {
                setIsTranslating(false);
            }
        };

        const timer = setTimeout(translate, 500); // Debounce
        return () => clearTimeout(timer);
    }, [text, targetLang, sourceLang]);

    return { translatedText, isTranslating };
};
