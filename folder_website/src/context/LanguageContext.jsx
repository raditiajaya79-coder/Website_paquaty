import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { id } from '../locales/id';

const LanguageContext = createContext();

const translations = { en, id };

export const LanguageProvider = ({ children }) => {
    // Initialize from LocalStorage or default to 'en'
    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('pakuaty_lang');
        return saved || 'en';
    });

    // Persist language choice
    useEffect(() => {
        localStorage.setItem('pakuaty_lang', lang);
    }, [lang]);

    const switchLang = (newLang) => {
        if (translations[newLang]) {
            setLang(newLang);
        }
    };

    const t = (key) => {
        // Basic translation lookup with fallback to English then the key itself
        return translations[lang][key] || translations['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, switchLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
