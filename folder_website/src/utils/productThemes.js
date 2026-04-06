/**
 * productThemes.js
 * Utility to map product names/flavors to consistent visual themes.
 * Refined with more vibrant, brand-aligned colors based on user feedback.
 */

export const PRODUCT_THEMES = {
    original: {
        bgGradient: "bg-gradient-to-br from-[#0147AD] to-[#1596D4]", // Deep Brand Blue to Cyan
        glowColor: "rgba(1, 71, 173, 0.3)",                          // Vibrant Blue Glow
        accentColor: "#0147AD",                                      // Deep Blue
        badgeColor: "bg-brand-gold",
        textColor: "text-white"                                      // For potential text overlay
    },
    balado: {
        bgGradient: "bg-gradient-to-br from-[#DC2626] to-[#7F1D1D]", // Saturated Red to Dark Red
        glowColor: "rgba(220, 38, 38, 0.25)",                        // Intense Red Glow
        accentColor: "#B91C1C",
        badgeColor: "bg-white text-red-600",
        textColor: "text-white"
    },
    bbq: {
        bgGradient: "bg-gradient-to-br from-[#92400E] to-[#451A03]", // Smoky Brown to Deep Brown
        glowColor: "rgba(146, 64, 14, 0.25)",                        // Warm BBQ Glow
        accentColor: "#78350F",
        badgeColor: "bg-orange-500 text-white",
        textColor: "text-white"
    },
    keju: {
        bgGradient: "bg-gradient-to-br from-[#E5B326] to-[#FACC15]", // Gold to Vibrant Yellow
        glowColor: "rgba(229, 179, 38, 0.35)",                       // Golden Glow
        accentColor: "#E5B326",
        badgeColor: "bg-stone-dark text-white",
        textColor: "text-stone-dark"
    },
    panggang: {
        bgGradient: "bg-gradient-to-br from-[#78350F] to-[#1A1206]", // Roasted Brown to Stone Dark
        glowColor: "rgba(120, 53, 15, 0.2)",                         // Deep Roast Glow
        accentColor: "#4D3006",
        badgeColor: "bg-amber-600 text-white",
        textColor: "text-white"
    },
    jamur: {
        bgGradient: "bg-gradient-to-br from-[#059669] to-[#064E3B]", // Emerald to Forest Green
        glowColor: "rgba(5, 150, 105, 0.25)",                        // Fresh Mushroom Green Glow
        accentColor: "#059669",
        badgeColor: "bg-emerald-100 text-emerald-800",
        textColor: "text-white"
    },
    default: {
        bgGradient: "bg-gradient-to-br from-stone-50 to-neutral-100",
        glowColor: "rgba(0, 0, 0, 0.04)",
        accentColor: "#57534E",
        badgeColor: "bg-brand-gold",
        textColor: "text-stone-dark"
    }
};

/**
 * getProductTheme — Finds the matching theme for a product based on its name or grade.
 * @param {string} name - Product name (e.g., "Original", "Balado")
 * @returns {object} Theme configuration
 */
export const getProductTheme = (name) => {
    if (!name) return PRODUCT_THEMES.default;
    const lowerName = name.toLowerCase();

    if (lowerName.includes('original')) return PRODUCT_THEMES.original;
    if (lowerName.includes('balado')) return PRODUCT_THEMES.balado;
    if (lowerName.includes('bbq')) return PRODUCT_THEMES.bbq;
    if (lowerName.includes('keju') || lowerName.includes('cheese')) return PRODUCT_THEMES.keju;
    if (lowerName.includes('panggang') || lowerName.includes('roasted')) return PRODUCT_THEMES.panggang;
    if (lowerName.includes('jamur') || lowerName.includes('mushroom')) return PRODUCT_THEMES.jamur;

    return PRODUCT_THEMES.default;
};
