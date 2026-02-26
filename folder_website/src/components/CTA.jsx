import React from 'react';

const CTA = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-[#1C1917] rounded-[2.5rem] p-8 md:p-20 text-center relative overflow-hidden">
                    {/* Abstract Circle */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#A3B14B] rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6 relative z-10 font-geist">
                        Ready to source premium products?
                    </h2>
                    <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto relative z-10 font-geist font-light">
                        Join 500+ global businesses importing the finest natural goods through our streamlined supply chain.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <input
                            type="email"
                            placeholder="Enter your business email"
                            className="w-full sm:w-96 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#A3B14B] focus:border-transparent transition-all"
                        />
                        <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#A3B14B] text-white font-medium hover:bg-[#8f9c40] transition-all whitespace-nowrap">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
