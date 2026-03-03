import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send, Clock } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';

const Contact = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <>
            <Helmet>
                <title>{generatePageTitle('Contact Our Team')}</title>
                <meta name="description" content="Get in touch with Pakuaty for wholesale inquiries and partnership opportunities." />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div {...fadeIn} className="text-center mb-16 md:mb-28">
                        <span className="text-brand-blue font-bold tracking-[0.4em] uppercase text-xs mb-6 block underline decoration-brand-blue/20 decoration-2 underline-offset-8">Inquiry & Support</span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8 leading-tight">
                            Start a <span className="text-brand-blue italic">Partnership</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#57534E] font-light leading-relaxed max-w-2xl mx-auto">
                            Whether you're looking for a reliable supply chain partner or have questions about our origin sourcing, our team is here to help.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
                            <div className="space-y-12">
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-white border border-stone-border rounded-2xl flex items-center justify-center text-brand-blue shadow-sm group-hover:border-brand-blue transition-colors">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-stone-dark mb-2">Our Office</h4>
                                        <p className="text-[#78716C] font-light leading-relaxed">
                                            Jl. Veteran No.15 B<br />
                                            Kota Kediri 64114<br />
                                            Jawa Timur, Indonesia
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-white border border-stone-border rounded-2xl flex items-center justify-center text-brand-blue shadow-sm group-hover:border-brand-blue transition-colors">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-stone-dark mb-2">Email</h4>
                                        <p className="text-[#78716C] font-light leading-relaxed">
                                            bala.aditi.pakuaty@gmail.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-white border border-stone-border rounded-2xl flex items-center justify-center text-brand-blue shadow-sm group-hover:border-brand-blue transition-colors">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-stone-dark mb-2">WhatsApp</h4>
                                        <p className="text-[#78716C] font-light leading-relaxed">
                                            +62 812-8799-0370<br />
                                            +62 821-4220-5147
                                        </p>
                                    </div>
                                </div>

                                <div className="p-10 bg-white border border-stone-border/30 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-700 shadow-soft">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-stone-dark" />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-dark/60">Global Office Hours</span>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-stone-dark font-medium flex justify-between">
                                            <span>Monday — Friday</span>
                                            <span className="text-brand-blue">09:00 - 18:00</span>
                                        </p>
                                        <p className="text-stone-dark font-medium flex justify-between">
                                            <span>Saturday</span>
                                            <span className="text-brand-blue">09:00 - 13:00</span>
                                        </p>
                                        <p className="text-[10px] text-stone-dark/40 font-bold uppercase tracking-wider pt-4 border-t border-stone-border/30">Western Indonesia Time (GMT+7)</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-stone-border shadow-2xl relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 blur-3xl rounded-full"></div>
                            <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-stone-dark mb-10">Inquiry Desk</h3>
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-bold text-stone-dark/40 uppercase tracking-[0.2em] px-1">Full Name</label>
                                        <input type="text" className="w-full px-6 py-4 bg-neutral-50/50 border border-stone-border rounded-2xl focus:outline-none focus:border-brand-blue focus:bg-white transition-all text-stone-dark placeholder:text-stone-300 font-medium" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-bold text-stone-dark/40 uppercase tracking-[0.2em] px-1">Email Address</label>
                                        <input type="email" className="w-full px-6 py-4 bg-neutral-50/50 border border-stone-border rounded-2xl focus:outline-none focus:border-brand-blue focus:bg-white transition-all text-stone-dark placeholder:text-stone-300 font-medium" placeholder="john@company.com" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-stone-dark/40 uppercase tracking-[0.2em] px-1">Message</label>
                                    <textarea rows="4" className="w-full px-6 py-4 bg-neutral-50/50 border border-stone-border rounded-2xl focus:outline-none focus:border-brand-blue focus:bg-white transition-all text-stone-dark placeholder:text-stone-300 font-medium leading-relaxed" placeholder="Tell us about your global sourcing needs..."></textarea>
                                </div>
                                <button className="w-full py-5 bg-stone-dark text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-blue transition-all shadow-xl shadow-stone-dark/10 hover:shadow-brand-blue/30 flex items-center justify-center gap-4 active:scale-95 group/btn">
                                    Send Inquiry
                                    <Send className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
