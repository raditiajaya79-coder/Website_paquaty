/**
 * migrate_static_data.js — Skrip untuk migrasi data statis ke database
 * Menjalankan skrip ini akan memasukkan data awal (produk, galeri, dll) 
 * dari website lama ke PostgreSQL.
 */
const pool = require('./config/db');

const PRODUCTS = [
    {
        name: "Original",
        grade: "Classic Tempe Chip",
        origin: "Kediri, East Java",
        moq: "100 pcs",
        packaging_options: JSON.stringify([
            { label: "50 Gram", value: "50g" },
            { label: "200 Gram", value: "200g" },
            { label: "325 Gram (Jar)", value: "325g-jar" }
        ]),
        image: "/logo-product-pure/01.ORIGINAL-HOLO-PNG - GRADING.webp",
        detail_image: "/images/keripik tempe original pakuaty.jpg",
        tag: "Best Seller",
        price: 12000,
        original_price: 15000,
        description: "Buat kamu yang suka camilan unik dan beda, Keripik Tempe Pakuaty rasa Original siap jadi teman setiamu! \nDibuat dari resep tradisional yang kaya akan rasa otentik budaya Indonesia, Pakuaty menghadirkan kelezatan yang bikin ketagihan. Rasanya renyah, gurih dan tidak berminyak yang akan bikin kamu ingat pada keaslian rasa tempe yang tidak pernah lekang oleh waktu. \nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍",
        is_bestseller: true,
        category: 'Tempe Chips'
    },
    {
        name: "Balado",
        grade: "Spicy Chili Tempe Chip",
        origin: "Kediri, East Java",
        moq: "100 pcs",
        packaging_options: JSON.stringify([
            { label: "50 Gram", value: "50g" }
        ]),
        image: "/logo-product-pure/02.BALADO-HOLOPNG-GRADING.webp",
        detail_image: "/images/keirpik tempe balado pakuaty.jpg",
        tag: "Spicy",
        price: 12000,
        original_price: 15000,
        description: "Siap merasakan pedasnya yang bikin ketagihan? Keripik Tempe Pakuaty rasa Balado hadir dengan kerenyahan sempurna dan bumbu balado yang nendang. Pas banget buat kamu yang suka ngemil dengan sensasi pedas gurih yang nggak bisa berhenti. Dibuat dari bahan pilihan dan diolah secara higienis, snack 50 gram ini jadi teman setia di setiap momen santaimu, dari ngobrol santai sampai me time yang berharga.\nMau ngemil asik yang bikin nggak bisa stop? Ayo, cobain sekarang dan rasakan sensasi pedas gurih Keripik Tempe Pakuaty yang bakal bikin kamu balik lagi dan lagi!\nKeripik Tempe Pakuaty,\nCoba sekali, Ga bisa berhenti 😋😋😋",
        is_bestseller: false,
        category: 'Tempe Chips'
    },
    {
        name: "BBQ",
        grade: "Smoky BBQ Tempe Chip",
        origin: "Kediri, East Java",
        moq: "100 pcs",
        packaging_options: JSON.stringify([
            { label: "50 Gram", value: "50g" }
        ]),
        image: "/logo-product-pure/04.BBQ-HOLO-PNG-GRADING.webp",
        detail_image: "/images/keripik tempe bbq pakuaty.jpg",
        tag: "",
        price: 12000,
        original_price: 15000,
        description: "Bawa suasana panggangan ke dalam setiap gigitan dengan Keripik Tempe Pakuaty rasa Barbeque! Kerenyahannya yang maksimal, ditambah dengan sentuhan rasa barbeque yang smoky dan gurih, bikin kamu nggak bisa berhenti ngemil. Cocok banget buat kamu yang ingin menikmati sensasi barbeque kapan saja, di mana saja, tanpa perlu repot. Kemasan 50 gram ini praktis, pas banget untuk temani kesibukan harianmu atau saat santai di rumah.\nNgemil seru tanpa ribet? Cobain Keripik Tempe Pakuaty rasa Barbeque sekarang, dan rasakan sensasi panggangan yang bikin ketagihan! Jangan sampai ketinggalan, buruan beli!\nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍",
        is_bestseller: false,
        category: 'Tempe Chips'
    },
    {
        name: "Keju",
        grade: "Cheese Tempe Chip",
        origin: "Kediri, East Java",
        moq: "100 pcs",
        packaging_options: JSON.stringify([
            { label: "50 Gram", value: "50g" }
        ]),
        image: "/logo-product-pure/05.KEJU-HOLO-PNG-GRADING.webp",
        detail_image: "/images/keripik tempe keju pakuaty.jpg",
        tag: "Popular",
        price: 12000,
        original_price: 15000,
        description: "Siap-siap merasakan kombinasi kerenyahan tempe dan gurihnya keju yang lumer di lidah! Keripik Tempe Pakuaty rasa Keju hadir dengan cita rasa keju yang creamy dan bikin nagih. Camilan ringan ini sempurna buat kamu yang suka ngemil tapi tetap ingin rasa yang beda dan penuh kejutan. Dengan kemasan praktis 50 gram, keripik ini jadi teman pas buat menemani kesibukan sehari-hari atau santai bareng keluarga.\nPengen ngemil yang gurih dan beda? Yuk, coba sekarang Keripik Tempe Pakuaty rasa Keju, sekali coba pasti ga bisa berhenti! Jangan sampai kelewatan, segera dapetin di toko terdekat!\nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍",
        is_bestseller: false,
        category: 'Tempe Chips'
    },
    {
        name: "Sapi Panggang",
        grade: "Roasted Beef Tempe Chip",
        origin: "Kediri, East Java",
        moq: "100 pcs",
        packaging_options: JSON.stringify([
            { label: "50 Gram", value: "50g" }
        ]),
        image: "/logo-product-pure/03.SPP-HOLO-PNG-GRADING.webp",
        detail_image: "/images/keripik tempe sapi pakuaty.jpg",
        tag: "",
        price: 12000,
        original_price: 15000,
        description: "Temukan kenikmatan baru dalam setiap gigitan! Keripik Tempe Pakuaty rasa Sapi Panggang menyajikan rasa gurih lezat yang bikin lidah bergoyang. Kerenyahan tempe berpadu sempurna dengan aroma khas sapi panggang yang kaya rasa. Cocok buat kamu yang suka camilan nikmat dengan sentuhan rasa daging yang menggoda. Praktis dalam kemasan 50 gram, pas untuk dibawa ke mana saja, kapan saja\nLagi cari camilan yang beda dari biasanya? Yuk, cobain sekarang Keripik Tempe Pakuaty rasa Sapi Panggang, rasakan gurihnya yang bikin pengen lagi dan lagi!\nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍",
        is_bestseller: false,
        category: 'Tempe Chips'
    },
    {
        name: "Jamur Crispy",
        grade: "Crispy Mushroom Chip",
        origin: "Kediri, East Java",
        moq: "100 pcs",
        packaging_options: JSON.stringify([
            { label: "300 Gram", value: "300g" }
        ]),
        image: "/images/keripik jamur pakuaty.jpg",
        detail_image: "/images/keripik jamur pakuaty.jpg",
        tag: "New",
        price: 60000,
        original_price: 70000,
        description: "Ngemil enak tanpa rasa bersalah? Keripik Jamur Pakuaty solusinya! Hadir dalam kemasan praktis 300 gram, keripik ini terbuat dari jamur berkualitas yang diolah dengan cara higienis. Rasanya gurih, teksturnya renyah, dan pastinya bikin ketagihan! Camilan sehat ini cocok untuk menemani aktivitas harianmu, dari sibuk di kantor sampai santai di rumah.\nNggak cuma renyah, tapi juga sehat! Cobain Keripik Jamur Pakuaty sekarang, nikmati setiap gigitan, dan rasakan bedanya! Dapatkan Segera!",
        is_bestseller: false,
        category: 'Mushroom Chips'
    }
];

const GALLERIES = [
    { title: "Original Tempe Chips", image: "/images/keripik tempe original pakuaty.jpg", span: "md:col-span-8", aspect: "aspect-[1.5/1]", category: "Flavor" },
    { title: "Balado Flavor", image: "/images/keirpik tempe balado pakuaty.jpg", span: "md:col-span-4", aspect: "aspect-square", category: "Flavor" },
    { title: "BBQ Flavor", image: "/images/keripik tempe bbq pakuaty.jpg", span: "md:col-span-4", aspect: "aspect-square", category: "Flavor" },
    { title: "Cheese Flavor", image: "/images/keripik tempe keju pakuaty.jpg", span: "md:col-span-4", aspect: "aspect-square", category: "Flavor" },
    { title: "Roasted Beef", image: "/images/keripik tempe sapi pakuaty.jpg", span: "md:col-span-4", aspect: "aspect-square", category: "Flavor" },
    { title: "Mushroom Chips", image: "/images/keripik jamur pakuaty.jpg", span: "md:col-span-6", aspect: "aspect-video", category: "New Product" },
    { title: "All Variants", image: "/images/FOTO ALL KERIPIK TEMPE.jpg", span: "md:col-span-6", aspect: "aspect-video", category: "Presentation" }
];

const CERTIFICATES = [
    { title: "BPOM RI MD", sub: "Sertifikasi Keamanan Pangan", issued_by: "Badan Pengawas Obat dan Makanan", description: "Memenuhi standar keamanan dan mutu pangan olahan untuk distribusi di seluruh wilayah Indonesia.", is_active: true },
    { title: "Ketetapan Halal", sub: "Sertifikasi Kehalalan Produk", issued_by: "LPPOM MUI", description: "Menjamin seluruh proses produksi dan bahan baku yang digunakan telah memenuhi kriteria syariat Islam.", is_active: true },
    { title: "P-IRT", sub: "Izin Usaha Industri Rumah Tangga", issued_by: "Dinas Kesehatan", description: "Legalitas resmi untuk produk industri rumah tangga yang menjamin standar kebersihan dan sanitasi.", is_active: true },
    { title: "NIB", sub: "Nomor Induk Berusaha", issued_by: "OSS RI", description: "Identitas pelaku usaha resmi yang diterbitkan oleh pemerintah Republik Indonesia.", is_active: true }
];

const EVENTS = [
    { title: "Pameran Produk Unggulan Kediri 2026", description: "Bergabunglah dengan kami dalam pameran produk UMKM terbesar di Kediri. Pakuaty akan menghadirkan seluruh varian produk dengan promo eksklusif.", date: "20 Maret 2026", location: "Gala Hall, Kediri", image: "/images/hero about.jpg", status: "upcoming" }
];

const ARTICLES = [
    { title: "Rahasia Kerenyahan Keripik Tempe Warisan Budaya", excerpt: "Bagaimana Pakuaty mempertahankan resep tradisional di tengah modernisasi? Simak cerita di balik dapur kami.", date: "10 Maret 2026", author: "Admin Pakuaty", category: "Budaya", image: "/images/keripik tempe original pakuaty.jpg" },
    { title: "Pakuaty Menembus Pasar Internasional", excerpt: "Langkah strategis PT. Bala Aditi Pakuaty dalam membawa cita rasa lokal ke kancah global.", date: "05 Maret 2026", author: "Billy Bachtiar", category: "Bisnis", image: "/images/BILLY FOUNDER PAQUATY.png" }
];

async function migrate() {
    console.log('🔄 Memulai migrasi data statis...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Clean tables first to avoid duplicates (Optional, but user said "don't create new data again")
        // await client.query('TRUNCATE products, galleries, certificates, events, articles CASCADE');

        // Migrate Products
        console.log('📦 Migrasi Produk...');
        for (const p of PRODUCTS) {
            await client.query(`
                INSERT INTO products (name, grade, origin, moq, packaging_options, image, detail_image, tag, price, original_price, description, is_bestseller, category)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT DO NOTHING
            `, [p.name, p.grade, p.origin, p.moq, p.packaging_options, p.image, p.detail_image, p.tag, p.price, p.original_price, p.description, p.is_bestseller, p.category]);
        }

        // Migrate Galleries
        console.log('🖼️ Migrasi Galeri...');
        for (const g of GALLERIES) {
            await client.query(`
                INSERT INTO galleries (title, image, span, aspect, category)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT DO NOTHING
            `, [g.title, g.image, g.span, g.aspect, g.category]);
        }

        // Migrate Certificates
        console.log('📜 Migrasi Sertifikat...');
        for (const c of CERTIFICATES) {
            await client.query(`
                INSERT INTO certificates (title, sub, issued_by, description, is_active)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT DO NOTHING
            `, [c.title, c.sub, c.issued_by, c.description, c.is_active]);
        }

        // Migrate Events
        console.log('📅 Migrasi Event...');
        for (const e of EVENTS) {
            await client.query(`
                INSERT INTO events (title, description, date, location, image, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING
            `, [e.title, e.description, e.date, e.location, e.image, e.status]);
        }

        // Migrate Articles
        console.log('📝 Migrasi Artikel...');
        for (const a of ARTICLES) {
            await client.query(`
                INSERT INTO articles (title, excerpt, date, author, category, image)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING
            `, [a.title, a.excerpt, a.date, a.author, a.category, a.image]);
        }

        await client.query('COMMIT');
        console.log('✅ Migrasi selesai dengan sukses!');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Terjadi kesalahan saat migrasi:', e.message);
    } finally {
        client.release();
        process.exit();
    }
}

migrate();
