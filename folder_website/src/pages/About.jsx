// About.jsx — Halaman Tentang Kami
// Menampilkan: header, filosofi nama, pesan founder, core values, dan closing
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Globe, ShieldCheck, Award, Quote, Sprout, Lightbulb, Heart, Users } from 'lucide-react';
import { generatePageTitle } from '../utils/seo';
import { COMPANY_INFO, FOUNDER } from '../data/products';

/**
 * About — Halaman "Tentang Kami"
 * Berisi: header, filosofi nama perusahaan, pesan dari founder, core values, closing
 */
const About = () => {
    // Konfigurasi animasi fade-in
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <>
            {/* SEO metadata */}
            <Helmet>
                <title>{generatePageTitle('Tentang Kami')}</title>
                <meta name="description" content={`Learn the story of PT Bala Aditi Pakuaty. Discover how we're transforming Indonesian heritage into a global premium tempe chip brand, rooted in tradition and designed for the world.`} />
            </Helmet>

            <div className="bg-neutral-bone min-h-screen pt-24 pb-16 md:py-32">
                <div className="max-w-7xl mx-auto px-6">

                    {/* ========================== */}
                    {/* HEADER — Judul halaman */}
                    {/* ========================== */}
                    <motion.header {...fadeIn} className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
                        {/* Label kategori halaman */}
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-6 block">Tentang Kami</span>
                        {/* Headline utama */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-stone-dark tracking-tight mb-8 leading-tight">
                            Warisan Cita Rasa, <br />
                            <span className="text-brand-blue">Visi untuk Dunia.</span>
                        </h1>
                        {/* Deskripsi singkat perusahaan */}
                        <p className="text-xl text-[#57534E] font-light leading-relaxed mb-6">
                            Pakuaty adalah brand keripik tempe premium Indonesia di bawah PT. Bala Aditi Pakuaty. Kami mentransformasi protein fermentasi tradisional menjadi produk camilan berkelas dunia, siap ekspor.
                        </p>
                        {/* Tagline */}
                        <p className="text-lg text-brand-blue/60 font-medium italic">
                            Berakar dari kearifan Indonesia. Dirancang untuk pasar internasional.
                        </p>
                    </motion.header>

                    {/* ============================================= */}
                    {/* FILOSOFI NAMA — Arti di balik "Bala Aditi Pakuaty" */}
                    {/* ============================================= */}
                    <motion.section {...fadeIn} className="mb-20 md:mb-32">
                        {/* Card dark background untuk kontras visual */}
                        <div className="bg-stone-dark rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
                            {/* Decorative Gradients — Migrated from blur to High-Performance Ultra-Light pattern */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(38,84,161,0.15)_0%,transparent_70%)] transform translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle,rgba(218,165,32,0.1)_0%,transparent_70%)] transform -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Label section */}
                                <span className="text-brand-gold font-medium tracking-[0.4em] uppercase text-xs mb-8 block">Filosofi Perusahaan</span>
                                {/* Judul section */}
                                <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-6">
                                    PT. <span className="text-brand-gold">Bala Aditi Pakuaty</span>
                                </h2>
                                {/* Penjelasan umum filosofi */}
                                <p className="text-neutral-400 leading-relaxed mb-12 max-w-3xl">
                                    Terdapat makna filosofis dibalik nama perusahaan kami. Nama tersebut berasal dari bahasa Sansekerta yang merupakan bahasa leluhur kami.
                                </p>

                                {/* Grid 3 kolom: penjelasan tiap kata */}
                                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                                    {/* BALA — arti pertama */}
                                    <div className="border-l-2 border-brand-gold/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Users className="w-6 h-6 text-brand-gold" />
                                            <h3 className="text-xl font-semibold text-white">Bala</h3>
                                        </div>
                                        {/* Arti dalam bahasa Sansekerta */}
                                        <p className="text-sm text-brand-gold font-medium mb-3 italic">Sansekerta — "Pasukan" atau "Tim"</p>
                                        {/* Penjelasan makna */}
                                        <p className="text-neutral-400 leading-relaxed">
                                            Bermakna sebuah pasukan atau tim, menggambarkan semangat kolaboratif dari setiap individu dalam perusahaan, yang bersatu sebagai satu tim untuk menciptakan produk yang akan dikenal dan disukai di seluruh dunia.
                                        </p>
                                    </div>

                                    {/* ADITI — arti kedua */}
                                    <div className="border-l-2 border-brand-gold/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Globe className="w-6 h-6 text-brand-gold" />
                                            <h3 className="text-xl font-semibold text-white">Aditi</h3>
                                        </div>
                                        <p className="text-sm text-brand-gold font-medium mb-3 italic">Sansekerta — "Mendunia" atau "Tanpa Batas"</p>
                                        <p className="text-neutral-400 leading-relaxed">
                                            Bermakna mendunia atau mencapai seluruh dunia, mewakili visi kami untuk menghadirkan cita rasa dan keberlanjutan yang mencapai ke seluruh penjuru dunia.
                                        </p>
                                    </div>

                                    {/* PAKUATY — arti ketiga */}
                                    <div className="border-l-2 border-brand-gold/30 pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Heart className="w-6 h-6 text-brand-gold" />
                                            <h3 className="text-xl font-semibold text-white">Pakuaty</h3>
                                        </div>
                                        <p className="text-sm text-brand-gold font-medium mb-3 italic">"Pakunya Hati"</p>
                                        <p className="text-neutral-400 leading-relaxed">
                                            Nama merek kami yang merupakan singkatan dari "Pakunya Hati". Hal ini untuk memunculkan sugesti bahwa pelanggan akan tepaku hatinya pada produk kami dan "tidak berpindah ke lain hati" atau berpindah ke produk lain.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* ============================================ */}
                    {/* PESAN DARI FOUNDER — Photo-only buffer for color clash fix */}
                    {/* ============================================ */}
                    <div className="mb-32">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Kolom kiri: Foto founder with white buffer background */}
                            <motion.div
                                {...fadeIn}
                                className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-white p-2 group"
                            >
                                <div className="relative w-full h-full rounded-[2.1rem] overflow-hidden bg-stone-100">
                                    {/* Gambar founder dari data FOUNDER */}
                                    <img src={FOUNDER.image} alt={FOUNDER.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-1000 ease-[0.22,1,0.36,1]" />
                                    {/* Overlay gradient + nama founder di bawah gambar */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-stone-dark to-transparent">
                                        <h3 className="text-2xl font-semibold text-white">{FOUNDER.name}</h3>
                                        <p className="text-brand-gold text-sm font-medium tracking-widest">{FOUNDER.title}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Kolom kanan: Pesan dari founder */}
                            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="relative">
                                {/* Icon quote decorative */}
                                <Quote className="w-12 h-12 text-brand-blue/20 mb-6" />
                                {/* Label section */}
                                <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Pesan dari Founder</span>
                                {/* Paragraf pesan utama dari founder — konten dari user */}
                                <div className="space-y-4 text-[#57534E] text-base leading-relaxed font-light">
                                    <p>
                                        Selamat datang di PT Bala Aditi Pakuaty, rumah bagi keripik tempe Pakuaty yang memikat hati dan mengekspresikan semangat tim kami untuk menyebarkan kelezatan, cita rasa khas Indonesia ke seluruh penjuru dunia.
                                    </p>
                                    <p>
                                        Nama 'Bala Aditi Pakuaty' berasal dari bahasa Sansekerta yang memiliki makna yang dalam. 'Bala' yang berarti pasukan atau tim, menggambarkan semangat kolaboratif dari setiap individu dalam perusahaan. Sedangkan 'Aditi', yang berarti mendunia, mewakili visi kami untuk menghadirkan cita rasa dan keberlanjutan yang mencapai ke seluruh penjuru dunia.
                                    </p>
                                    <p>
                                        Dan nama merek 'Pakuaty' bukanlah semata-mata sebuah kata, tetapi merupakan cerminan dari komitmen kami. 'Pakuaty' adalah singkatan dari 'pakunya hati', yang memiliki makna bahwa kami berupaya untuk memukau, memikat hati dan menciptakan produk yang mengikat hati pelanggan, sehingga mereka tidak akan berpindah ke lain hati.
                                    </p>
                                    <p>
                                        Dengan fondasi yang kuat ini, kami mengundang Anda semua untuk bergabung dalam perjalanan kami untuk menciptakan dunia di mana makanan yang bercitarasa khas Indonesia, bernutrisi, dan berkelanjutan adalah norma.
                                    </p>
                                </div>
                                {/* Tanda tangan founder */}
                                <div className="mt-8 pt-8 border-t border-brand-blue/10">
                                    <p className="text-stone-dark font-semibold text-lg">Billy Bachtiar</p>
                                    <p className="text-sm text-[#78716C]">Founder, PT. Bala Aditi Pakuaty</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ======================== */}
                    {/* CORE VALUES — Nilai Inti */}
                    {/* ======================== */}
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <span className="text-brand-blue font-medium tracking-[0.4em] uppercase text-xs mb-4 block">Yang Menggerakkan Kami</span>
                        <h2 className="text-4xl md:text-5xl font-medium text-stone-dark tracking-tight">Nilai Inti Kami</h2>
                    </motion.div>

                    {/* Grid 3 kartu core values */}
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        {[
                            {
                                icon: Lightbulb,
                                title: "Teknologi Tempe",
                                desc: "Kami melihat tempe bukan hanya sebagai makanan, tetapi sebagai proses fermentasi berusia berabad-abad yang dapat diterapkan pada sumber protein apapun secara global."
                            },
                            {
                                icon: Globe,
                                title: "Adaptasi Global",
                                desc: "Visi kami adalah memberdayakan bangsa lain untuk menggunakan kacang lokal mereka dengan keahlian fermentasi Indonesia untuk menciptakan nutrisi berkelanjutan."
                            },
                            {
                                icon: Sprout,
                                title: "Kearifan Indonesia",
                                desc: "Menghormati teknik 'ragi' tradisional sambil mengembangkannya menjadi solusi global berteknologi tinggi untuk masa depan industri makanan."
                            }
                        ].map((pillar, idx) => (
                            // Card core value — hover effect pada border
                            <motion.div key={idx} {...fadeIn} transition={{ ...fadeIn.transition, delay: idx * 0.1 }} className="bg-white p-10 rounded-[2.5rem] border border-stone-dark/5 hover:border-brand-gold transition-all duration-700 shadow-sm" >
                                {/* Icon pillar */}
                                <pillar.icon className="w-10 h-10 text-brand-blue mb-6" />
                                {/* Judul pillar */}
                                <h4 className="text-xl font-bold text-stone-dark mb-4">{pillar.title}</h4>
                                {/* Deskripsi pillar */}
                                <p className="text-[#57534E] font-light leading-relaxed">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* ================================ */}
                    {/* CLOSING — Pesan penutup manifesto */}
                    {/* ================================ */}
                    <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto">
                        <div className="bg-brand-blue border border-brand-blue/10 rounded-[2.5rem] p-10 md:p-16 shadow-2xl">
                            <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-6">
                                Bersama, kita hadirkan <span className="text-brand-gold">cita rasa</span>.<br />
                                Bersama, kita bangun <span className="text-brand-gold">dunia yang lebih baik</span>.
                            </h2>
                            <p className="text-lg text-stone-200 font-light leading-relaxed">
                                Marilah kita bersama-sama membangun masa depan yang lebih cerah untuk industri makanan global dan kesejahteraan umat manusia.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </>
    );
};

export default About;
