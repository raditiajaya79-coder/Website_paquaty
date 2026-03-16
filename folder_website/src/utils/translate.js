/**
 * translateText — Fungsi utility untuk menerjemahkan teks menggunakan MyMemory API
 * Mendukung teks panjang dengan mekanisme chunking (500 chars limit).
 */
export const translateText = async (text, targetLang = 'en', sourceLang = 'id') => {
    if (!text || text === '[]' || text === '""' || !text.trim()) return text;
    if (targetLang === sourceLang) return text;

    const MAX_CHARS = 1000; // Google handles longer strings better than MyMemory

    const callGoogleTranslate = async (q) => {
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(q)}`;
            const response = await fetch(url);
            const data = await response.json();
            // Google returns data in nested arrays: [[ ["translated", "original", ...], ... ]]
            return data[0].map(x => x[0]).join('');
        } catch (e) {
            console.error('Google Translate failed, falling back to MyMemory', e);
            return null;
        }
    };

    const callMyMemory = async (q) => {
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${sourceLang}|${targetLang}`
            );
            const data = await response.json();
            return data.responseData ? data.responseData.translatedText : null;
        } catch (e) {
            console.error('MyMemory fallback failed', e);
            return null;
        }
    };

    try {
        // Jika teks pendek, kirim langsung
        if (text.length <= MAX_CHARS) {
            const result = await callGoogleTranslate(text);
            if (result) return result;
            
            // Fallback to MyMemory
            const fallbackResult = await callMyMemory(text);
            return fallbackResult || text;
        }

        // Jika teks panjang, pecah menjadi beberapa bagian (chunking)
        const sentences = text.match(/[^.!?]+[.!?]+|\s*\n\s*|[^.!?]+$/g) || [text];
        let currentChunk = "";
        let finalTranslation = "";

        for (const sentence of sentences) {
            if ((currentChunk + sentence).length > MAX_CHARS) {
                if (currentChunk.trim()) {
                    let res = await callGoogleTranslate(currentChunk);
                    if (!res) res = await callMyMemory(currentChunk);
                    finalTranslation += (res || currentChunk) + " ";
                }
                currentChunk = sentence;
            } else {
                currentChunk += sentence;
            }
        }

        if (currentChunk.trim()) {
            let res = await callGoogleTranslate(currentChunk);
            if (!res) res = await callMyMemory(currentChunk);
            finalTranslation += (res || currentChunk);
        }

        return finalTranslation.trim();
    } catch (err) {
        console.error('Translation utility error:', err);
        return text;
    }
};
