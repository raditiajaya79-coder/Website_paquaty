import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send, Clock } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';

/**
 * Contact — Premium Contact Page Design
 */
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

            <div className="bg-stone-light min-h-screen pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div {...fadeIn} className="text-center max-w-2xl mx-auto mb-20">
                        <h1 className="text-5xl font-serif font-medium text-stone-dark mb-6 tracking-tight">
                            Let's Start a <span className="text-primary italic">Partnership.</span>
                        </h1>
                        <p className="text-lg text-stone-600 font-light leading-relaxed">
                            Whether you're looking for a reliable supply chain partner or have questions about our origin sourcing, our team is here to help.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Info Column */}
                        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
                            <div className="space-y-12">
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-white border border-stone-border rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:border-primary transition-colors">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-stone-dark mb-2">Our Office</h4>
                                        <p className="text-stone-500 font-light leading-relaxed">
                                            Jl. Veteran No.15 B<br />
                                            Kota Kediri 64114<br />
                                            Jawa Timur, Indonesia
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-white border border-stone-border rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:border-primary transition-colors">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-stone-dark mb-2">Email</h4>
                                        <p className="text-stone-500 font-light leading-relaxed">
                                            bala.aditi.pakuaty@gmail.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-white border border-stone-border rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:border-primary transition-colors">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-stone-dark mb-2">WhatsApp</h4>
                                        <p className="text-stone-500 font-light leading-relaxed">
                                            +62 812-8799-0370<br />
                                            +62 821-4220-5147
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8 bg-stone-dark rounded-[2rem] text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-20 blur-3xl"></div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <span className="text-sm font-medium tracking-wider uppercase">Business Hours</span>
                                    </div>
                                    <p className="text-stone-400 font-light">
                                        Mon — Fri: 09:00 - 18:00 (GMT+7)<br />
                                        Sat: 09:00 - 13:00 (GMT+7)
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Form Column */}
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-10 rounded-[2.5rem] border border-stone-border shadow-xl shadow-stone-dark/5"
                        >
                            <h3 className="text-2xl font-serif font-semibold text-stone-dark mb-8">Send an Inquiry</h3>
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-2 px-1">Full Name</label>
                                        <input type="text" className="w-full px-5 py-4 bg-stone-light border border-stone-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-stone-dark placeholder:text-stone-300" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-2 px-1">Email Address</label>
                                        <input type="email" className="w-full px-5 py-4 bg-stone-light border border-stone-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-stone-dark placeholder:text-stone-300" placeholder="john@company.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-2 px-1">Message</label>
                                    <textarea rows="5" className="w-full px-5 py-4 bg-stone-light border border-stone-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-stone-dark placeholder:text-stone-300" placeholder="Tell us about your sourcing needs..."></textarea>
                                </div>
                                <button className="w-full py-5 bg-stone-dark text-white rounded-2xl font-medium hover:bg-primary transition-all shadow-xl shadow-stone-dark/10 hover:shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98]">
                                    Submit Request
                                    <Send className="w-4 h-4" />
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
