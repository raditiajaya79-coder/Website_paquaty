import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send, Clock } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';

import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle(t('seo.contact_title'))}</title>
                <meta name="description" content={t('seo.contact_desc')} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-32 pb-24 relative overflow-hidden selection:bg-brand-gold/30 selection:text-stone-dark">
                {/* Background Textures & Glows */}
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 xl:gap-24 items-start">

                        {/* LEFT PANEL : Typography & Contact Info */}
                        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="pt-8 lg:pt-16">
                            <span className="inline-block text-[9px] font-black tracking-[0.3em] uppercase text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full mb-8">
                                {t('contact.header_label')}
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light text-stone-dark tracking-tighter mb-8 leading-[1.1]">
                                {t('contact.header_title').split(' ').slice(0, -1).join(' ')}{' '}
                                <span className="font-semibold text-brand-blue">{t('contact.header_title').split(' ').slice(-1)}</span>
                                <br />
                                <span className="italic font-serif text-brand-gold text-5xl sm:text-6xl lg:text-7xl">{t('contact.header_title_accent')}</span>
                            </h1>
                            <p className="text-lg text-stone-dark/60 font-light leading-relaxed max-w-lg mb-16">
                                {t('contact.header_desc')}
                            </p>

                            <div className="space-y-10">
                                {/* Address */}
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-brand-gold group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold tracking-widest uppercase text-stone-dark mb-2">{t('contact.office_title')}</h4>
                                        <p className="text-stone-dark/60 font-medium leading-relaxed">
                                            Jl. Veteran No.15 B<br />
                                            Kota Kediri 64114, Jawa Timur<br />
                                            Indonesia
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-brand-gold group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold tracking-widest uppercase text-stone-dark mb-2">{t('contact.email_title')}</h4>
                                        <p className="text-brand-blue font-medium leading-relaxed hover:text-brand-gold transition-colors cursor-pointer">
                                            bala.aditi.pakuaty@gmail.com
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center text-brand-gold group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold tracking-widest uppercase text-stone-dark mb-2">{t('contact.whatsapp_title')}</h4>
                                        <p className="text-stone-dark/60 font-medium leading-relaxed tracking-wider">
                                            +62 812-8799-0370<br />
                                            +62 821-4220-5147
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Working Hours Mini Card */}
                            <div className="mt-16 p-8 bg-white/50 backdrop-blur-md border border-stone-200/50 rounded-3xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <Clock className="w-4 h-4 text-brand-gold" />
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-blue">{t('contact.hours_label')}</span>
                                </div>
                                <div className="space-y-3 text-sm relative z-10">
                                    <div className="flex justify-between items-center pb-3 border-b border-stone-200/50">
                                        <span className="text-stone-dark/60 font-medium">{t('contact.monday_friday')}</span>
                                        <span className="text-brand-blue font-bold tracking-widest">09:00 - 18:00</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-dark/60 font-medium">{t('contact.saturday')}</span>
                                        <span className="text-brand-blue font-bold tracking-widest">09:00 - 13:00</span>
                                    </div>
                                    <p className="text-[9px] text-stone-dark/40 font-bold uppercase tracking-widest pt-3 text-right">{t('contact.time_zone')}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT PANEL : Floating Contact Form */}
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.3 }}
                            className="relative lg:mt-10"
                        >
                            {/* Decorative background shape for the form */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-brand-gold/20 via-transparent to-brand-blue/10 blur-2xl rounded-[3rem] -z-10" />

                            <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-12 md:p-14 rounded-[2rem] sm:rounded-[3rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl rounded-full pointer-events-none mix-blend-multiply group-hover:bg-brand-gold/20 transition-all duration-700"></div>

                                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-brand-blue mb-10 border-b border-stone-200/50 pb-6">
                                    {t('contact.form_title')}
                                </h3>

                                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        {/* Name input */}
                                        <div className="relative group/input">
                                            <input
                                                type="text"
                                                id="name"
                                                className="peer w-full bg-transparent border-b border-stone-300 py-4 text-stone-dark font-medium placeholder-transparent focus:outline-none focus:border-brand-gold transition-colors"
                                                placeholder="John Doe"
                                                required
                                            />
                                            <label
                                                htmlFor="name"
                                                className="absolute left-0 -top-3.5 text-[10px] font-bold text-stone-dark/40 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-dark/40 peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-brand-gold peer-focus:font-bold"
                                            >
                                                {t('contact.form_name')}
                                            </label>
                                        </div>

                                        {/* Email input */}
                                        <div className="relative group/input">
                                            <input
                                                type="email"
                                                id="email"
                                                className="peer w-full bg-transparent border-b border-stone-300 py-4 text-stone-dark font-medium placeholder-transparent focus:outline-none focus:border-brand-gold transition-colors"
                                                placeholder="john@company.com"
                                                required
                                            />
                                            <label
                                                htmlFor="email"
                                                className="absolute left-0 -top-3.5 text-[10px] font-bold text-stone-dark/40 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-dark/40 peer-placeholder-shown:top-4 peer-placeholder-shown:font-medium peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-brand-gold peer-focus:font-bold"
                                            >
                                                {t('contact.form_email')}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Message Textarea */}
                                    <div className="relative group/input pt-4">
                                        <textarea
                                            id="message"
                                            rows="4"
                                            className="peer w-full bg-stone-50/50 border border-stone-200 rounded-2xl p-6 text-stone-dark font-medium placeholder-transparent focus:outline-none focus:border-brand-gold focus:bg-white transition-all resize-none"
                                            placeholder={t('contact.form_message_placeholder')}
                                            required
                                        ></textarea>
                                        <label
                                            htmlFor="message"
                                            className="absolute left-6 -top-2 px-2 bg-white text-[10px] font-bold text-stone-dark/40 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-stone-dark/40 peer-placeholder-shown:top-6 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-medium peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-brand-gold peer-focus:bg-white peer-focus:font-bold"
                                        >
                                            {t('contact.form_message')}
                                        </label>
                                    </div>

                                    <button className="w-full py-5 bg-brand-blue text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-gold hover:text-stone-dark transition-all duration-500 shadow-xl shadow-brand-blue/20 hover:shadow-brand-gold/40 flex items-center justify-center gap-4 group/btn overflow-hidden relative">
                                        <span className="relative z-10">{t('contact.form_submit')}</span>
                                        <Send className="w-4 h-4 relative z-10 transition-transform duration-500 group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2" />
                                        {/* Hover glare effect */}
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[glare_1s_ease-in-out]" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
