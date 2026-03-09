/**
 * seed.js — Script untuk mengisi database dengan data awal
 * Mengekspor semua data statis yang ada di frontend ke PostgreSQL.
 * Jalankan dengan: npm run seed
 * 
 * Data yang di-seed:
 * - 1 admin default
 * - 6 produk (dari products.js)
 * - 6 artikel (dari Events.jsx)
 * - 7 foto galeri (dari Gallery.jsx)
 * - 5 sertifikat (dari Certificates.jsx)
 */
const pool = require('./config/db'); // Koneksi database
const bcrypt = require('bcryptjs'); // Library hashing password
const initializeDatabase = require('./config/initDb'); // Inisialisasi tabel

/**
 * seedDatabase — Mengisi semua tabel dengan data awal dari frontend
 */
async function seedDatabase() {
  const client = await pool.connect(); // Ambil koneksi dari pool

  try {
    console.log('🌱 Memulai proses seeding database...\n');

    // === Step 1: Inisialisasi tabel (buat jika belum ada) ===
    await initializeDatabase();
    console.log('✅ Tabel berhasil diinisialisasi.\n');

    // === Step 2: Seed Admin Default ===
    console.log('👤 Membuat admin default...');
    const hashedPassword = await bcrypt.hash('pakuaty2026', 10); // Hash password dengan salt rounds 10
    
    // Gunakan ON CONFLICT agar tidak duplikasi jika seed dijalankan ulang
    await client.query(`
      INSERT INTO admins (username, email, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['admin_pakuaty', 'admin@pakuaty.com', hashedPassword, 'Administrator Pakuaty', 'super_admin']);
    console.log('   ✅ Admin: admin@pakuaty.com / pakuaty2026\n');

    // === Step 3: Seed Produk (6 produk dari products.js) ===
    console.log('📦 Mengisi data produk...');
    
    // Data produk — diambil persis dari src/data/products.js
    const products = [
      {
        name: 'Original',
        grade: 'Classic Tempe Chip',
        origin: 'Kediri, East Java',
        moq: '100 pcs',
        image: '/logo-product-pure/01.ORIGINAL-HOLO-PNG - GRADING.webp',
        detail_image: '/images/keripik tempe original pakuaty.jpg',
        tag: 'Best Seller',
        price: 12000,
        original_price: 15000,
        description: 'Buat kamu yang suka camilan unik dan beda, Keripik Tempe Pakuaty rasa Original siap jadi teman setiamu! \nDibuat dari resep tradisional yang kaya akan rasa otentik budaya Indonesia, Pakuaty menghadirkan kelezatan yang bikin ketagihan. Rasanya renyah, gurih dan tidak berminyak yang akan bikin kamu ingat pada keaslian rasa tempe yang tidak pernah lekang oleh waktu. \nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍',
        is_bestseller: true,
        is_hero: true,
        packaging_options: JSON.stringify([
          { label: '50 Gram', value: '50g' },
          { label: '200 Gram', value: '200g' },
          { label: '325 Gram (Jar)', value: '325g-jar' }
        ])
      },
      {
        name: 'Balado',
        grade: 'Spicy Chili Tempe Chip',
        origin: 'Kediri, East Java',
        moq: '100 pcs',
        image: '/logo-product-pure/02.BALADO-HOLOPNG-GRADING.webp',
        detail_image: '/images/keirpik tempe balado pakuaty.jpg',
        tag: 'Spicy',
        price: 12000,
        original_price: 15000,
        description: 'Siap merasakan pedasnya yang bikin ketagihan? Keripik Tempe Pakuaty rasa Balado hadir dengan kerenyahan sempurna dan bumbu balado yang nendang. Pas banget buat kamu yang suka ngemil dengan sensasi pedas gurih yang nggak bisa berhenti. Dibuat dari bahan pilihan dan diolah secara higienis, snack 50 gram ini jadi teman setia di setiap momen santaimu, dari ngobrol santai sampai me time yang berharga.\nMau ngemil asik yang bikin nggak bisa stop? Ayo, cobain sekarang dan rasakan sensasi pedas gurih Keripik Tempe Pakuaty yang bakal bikin kamu balik lagi dan lagi!\nKeripik Tempe Pakuaty,\nCoba sekali, Ga bisa berhenti 😋😋😋',
        is_bestseller: false,
        is_hero: true,
        packaging_options: JSON.stringify([{ label: '50 Gram', value: '50g' }])
      },
      {
        name: 'BBQ',
        grade: 'Smoky BBQ Tempe Chip',
        origin: 'Kediri, East Java',
        moq: '100 pcs',
        image: '/logo-product-pure/04.BBQ-HOLO-PNG-GRADING.webp',
        detail_image: '/images/keripik tempe bbq pakuaty.jpg',
        tag: '',
        price: 12000,
        original_price: 15000,
        description: 'Bawa suasana panggangan ke dalam setiap gigitan dengan Keripik Tempe Pakuaty rasa Barbeque! Kerenyahannya yang maksimal, ditambah dengan sentuhan rasa barbeque yang smoky dan gurih, bikin kamu nggak bisa berhenti ngemil. Cocok banget buat kamu yang ingin menikmati sensasi barbeque kapan saja, di mana saja, tanpa perlu repot. Kemasan 50 gram ini praktis, pas banget untuk temani kesibukan harianmu atau saat santai di rumah.\nNgemil seru tanpa ribet? Cobain Keripik Tempe Pakuaty rasa Barbeque sekarang, dan rasakan sensasi panggangan yang bikin ketagihan! Jangan sampai ketinggalan, buruan beli!\nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍',
        is_bestseller: false,
        is_hero: true,
        packaging_options: JSON.stringify([{ label: '50 Gram', value: '50g' }])
      },
      {
        name: 'Keju',
        grade: 'Cheese Tempe Chip',
        origin: 'Kediri, East Java',
        moq: '100 pcs',
        image: '/logo-product-pure/05.KEJU-HOLO-PNG-GRADING.webp',
        detail_image: '/images/keripik tempe keju pakuaty.jpg',
        tag: 'Popular',
        price: 12000,
        original_price: 15000,
        description: 'Siap-siap merasakan kombinasi kerenyahan tempe dan gurihnya keju yang lumer di lidah! Keripik Tempe Pakuaty rasa Keju hadir dengan cita rasa keju yang creamy dan bikin nagih. Camilan ringan ini sempurna buat kamu yang suka ngemil tapi tetap ingin rasa yang beda dan penuh kejutan. Dengan kemasan praktis 50 gram, keripik ini jadi teman pas buat menemani kesibukan sehari-hari atau santai bareng keluarga.\nPengen ngemil yang gurih dan beda? Yuk, coba sekarang Keripik Tempe Pakuaty rasa Keju, sekali coba pasti ga bisa berhenti! Jangan sampai kelewatan, segera dapetin di toko terdekat!\nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍',
        is_bestseller: false,
        is_hero: true,
        packaging_options: JSON.stringify([{ label: '50 Gram', value: '50g' }])
      },
      {
        name: 'Sapi Panggang',
        grade: 'Roasted Beef Tempe Chip',
        origin: 'Kediri, East Java',
        moq: '100 pcs',
        image: '/logo-product-pure/03.SPP-HOLO-PNG-GRADING.webp',
        detail_image: '/images/keripik tempe sapi pakuaty.jpg',
        tag: '',
        price: 12000,
        original_price: 15000,
        description: 'Temukan kenikmatan baru dalam setiap gigitan! Keripik Tempe Pakuaty rasa Sapi Panggang menyajikan rasa gurih lezat yang bikin lidah bergoyang. Kerenyahan tempe berpadu sempurna dengan aroma khas sapi panggang yang kaya rasa. Cocok buat kamu yang suka camilan nikmat dengan sentuhan rasa daging yang menggoda. Praktis dalam kemasan 50 gram, pas untuk dibawa ke mana saja, kapan saja\nLagi cari camilan yang beda dari biasanya? Yuk, cobain sekarang Keripik Tempe Pakuaty rasa Sapi Panggang, rasakan gurihnya yang bikin pengen lagi dan lagi!\nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍',
        is_bestseller: false,
        is_hero: true,
        packaging_options: JSON.stringify([{ label: '50 Gram', value: '50g' }])
      },
      {
        name: 'Jamur Crispy',
        grade: 'Crispy Mushroom Chip',
        origin: 'Kediri, East Java',
        moq: '100 pcs',
        image: '/images/keripik jamur pakuaty.jpg',
        detail_image: '/images/keripik jamur pakuaty.jpg',
        tag: 'New',
        price: 60000,
        original_price: 70000,
        description: 'Ngemil enak tanpa rasa bersalah? Keripik Jamur Pakuaty solusinya! Hadir dalam kemasan praktis 300 gram, keripik ini terbuat dari jamur berkualitas yang diolah dengan cara higienis. Rasanya gurih, teksturnya renyah, dan pastinya bikin ketagihan! Camilan sehat ini cocok untuk menemani aktivitas harianmu, dari sibuk di kantor sampai santai di rumah.\nNggak cuma renyah, tapi juga sehat! Cobain Keripik Jamur Pakuaty sekarang, nikmati setiap gigitan, dan rasakan bedanya! Dapatkan Segera!',
        is_bestseller: false,
        is_hero: false,
        packaging_options: JSON.stringify([{ label: '300 Gram', value: '300g' }])
      }
    ];

    // Insert setiap produk, skip jika nama sudah ada
    for (const p of products) {
      await client.query(`
        INSERT INTO products (name, grade, origin, moq, image, detail_image, tag, price, original_price, description, is_bestseller, is_hero, packaging_options)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT DO NOTHING
      `, [p.name, p.grade, p.origin, p.moq, p.image, p.detail_image, p.tag, p.price, p.original_price, p.description, p.is_bestseller, p.is_hero, p.packaging_options]);
    }
    console.log(`   ✅ ${products.length} produk berhasil di-seed.\n`);

    // === Step 4: Seed Artikel (6 artikel dari Events.jsx) ===
    console.log('📰 Mengisi data artikel...');
    
    const articles = [
      {
        title: "Traditional Fermentation: The Secret to Pakuaty's Crunch",
        excerpt: "Discover the ancient heritage behind our 48-hour fermentation process that creates the unique texture and deep flavor profile of our artisan tempe.",
        content: "Our fermentation process is a labor of love that spans generations. We start with carefully selected non-GMO soybeans, which are soaked and then inoculated with a traditional starter culture. The critical phase is the 48-hour slow fermentation in a temperature-controlled environment. This allows the mycelium to fully bind the soybeans, creating a dense, protein-rich 'cake' that forms the base of our chips.\n\nThis patient approach is what differentiates Pakuaty. While industrial methods try to speed up this process, we believe that true flavor and the perfect 'crunch' can only be achieved by respecting nature's timeline. The result is a snack that isn't just delicious, but deeply rooted in Indonesian heritage.",
        date: "Jan 15, 2026",
        author: "Heritage Master",
        category: "Process",
        image: "/images/keripik tempe original pakuaty.jpg"
      },
      {
        title: "Pakuaty Expands to Middle Eastern Markets",
        excerpt: "Our recent partnership with major retailers in Dubai marks a significant milestone in our journey to bring Indonesian flavors to the global stage.",
        content: "We are thrilled to announce our expansion into the Middle Eastern market. This partnership with leading retailers in Dubai and Abu Dhabi represents a major milestone for Pakuaty. Our products have been specifically adapted to meet halal certification standards while maintaining the authentic Indonesian taste that defines our brand.",
        date: "Feb 02, 2026",
        author: "Trade Dept",
        category: "Export",
        image: "/images/keirpik tempe balado pakuaty.jpg"
      },
      {
        title: "Designing the Future: The Evolution of Our Packaging",
        excerpt: "Explore the design philosophy behind our new premium holographic packaging that balances modern aesthetics with traditional Indonesian motifs.",
        content: "Our new holographic packaging is more than just a visual upgrade. It represents our commitment to blending tradition with innovation. Each package features subtle Indonesian batik patterns rendered in a modern holographic finish, creating a premium shelf presence that honors our heritage while speaking to contemporary consumers worldwide.",
        date: "Feb 18, 2026",
        author: "Design Team",
        category: "Innovation",
        image: "/images/logo pakuaty tagline.png"
      },
      {
        title: "Sourcing Excellence: Meeting Our Local Soybean Farmers",
        excerpt: "We visit the heart of East Java to meet the families who grow the non-GMO soybeans that form the foundation of every Pakuaty tempe chip.",
        content: "Behind every bag of Pakuaty chips are dedicated farming families in East Java. These farmers practice sustainable agriculture, growing non-GMO soybeans with traditional methods passed down through generations. Our direct partnership ensures fair prices for farmers and the highest quality raw materials for our production.",
        date: "Feb 25, 2026",
        author: "Sourcing Team",
        category: "Community",
        image: "/images/keripik tempe sapi pakuaty.jpg"
      },
      {
        title: "The Health Benefits of Fermented Snacks",
        excerpt: "Scientific insights into why our traditional fermentation process makes tempe chips a superior snack choice for health-conscious consumers.",
        content: "Fermented foods have been recognized by nutritional science as beneficial for gut health and overall wellness. Our tempe chips undergo a natural fermentation process that increases protein bioavailability, creates beneficial probiotics, and reduces anti-nutritional factors found in raw soybeans. This makes Pakuaty chips not just delicious, but genuinely nutritious.",
        date: "Mar 01, 2026",
        author: "Health Expert",
        category: "Wellness",
        image: "/images/keripik jamur pakuaty.jpg"
      },
      {
        title: "Upcoming Event: Indonesian Food Expo 2026",
        excerpt: "Join us in Jakarta this coming April as we showcase our latest flavor innovations and heritage craftsmanship at the national food exhibition.",
        content: "Pakuaty will be a featured exhibitor at the Indonesian Food Expo 2026 in Jakarta this April. We will be showcasing our complete product line, including exciting new flavors currently in development. Visitors can experience live demonstrations of our traditional fermentation process and taste exclusive samples.",
        date: "Mar 10, 2026",
        author: "PR Team",
        category: "Event",
        image: "/images/FOTO ALL KERIPIK TEMPE.jpg"
      }
    ];

    for (const a of articles) {
      await client.query(`
        INSERT INTO articles (title, excerpt, content, date, author, category, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [a.title, a.excerpt, a.content, a.date, a.author, a.category, a.image]);
    }
    console.log(`   ✅ ${articles.length} artikel berhasil di-seed.\n`);

    // === Step 5: Seed Galeri (7 foto dari Gallery.jsx) ===
    console.log('🖼️  Mengisi data galeri...');
    
    const galleries = [
      { title: 'Heritage Fermentation', category: 'Process', image: '/images/keripik tempe original pakuaty.jpg', span: 'md:col-span-8', aspect: 'aspect-[1.5/1] md:aspect-[2/1]' },
      { title: 'Spicy Infusion', category: 'Flavor', image: '/images/keirpik tempe balado pakuaty.jpg', span: 'md:col-span-4', aspect: 'aspect-square' },
      { title: 'Smoky Perfection', category: 'Quality', image: '/images/keripik tempe bbq pakuaty.jpg', span: 'md:col-span-4', aspect: 'aspect-square' },
      { title: 'Golden Grating', category: 'Detail', image: '/images/keripik tempe keju pakuaty.jpg', span: 'md:col-span-4', aspect: 'aspect-square' },
      { title: 'Roasted Excellence', category: 'Export', image: '/images/keripik tempe sapi pakuaty.jpg', span: 'md:col-span-4', aspect: 'aspect-square' },
      { title: 'Crunch Anatomy', category: 'Detail', image: '/images/keripik jamur pakuaty.jpg', span: 'md:col-span-6', aspect: 'aspect-video' },
      { title: 'The Collection', category: 'Brand', image: '/images/FOTO ALL KERIPIK TEMPE.jpg', span: 'md:col-span-6', aspect: 'aspect-video' }
    ];

    for (const g of galleries) {
      await client.query(`
        INSERT INTO galleries (title, category, image, span, aspect)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [g.title, g.category, g.image, g.span, g.aspect]);
    }
    console.log(`   ✅ ${galleries.length} foto galeri berhasil di-seed.\n`);

    // === Step 6: Seed Sertifikat (5 sertifikat dari Certificates.jsx) ===
    console.log('🏅 Mengisi data sertifikat...');
    
    const certificates = [
      {
        title: 'HACCP Certified',
        sub: 'Food Safety',
        description: 'Hazard Analysis and Critical Control Points (HACCP) is an internationally recognized system for reducing food safety hazards.',
        issued_by: 'International HACCP Alliance'
      },
      {
        title: 'Halal Indonesia',
        sub: 'BPJPH Certified',
        description: 'Ensuring all products comply with Islamic dietary laws as regulated by the Indonesian government.',
        issued_by: 'BPJPH (Badan Penyelenggara Jaminan Produk Halal)'
      },
      {
        title: 'SNI Standard',
        sub: 'National Standard',
        description: 'The only standard that has national validity in Indonesia, ensuring product quality and safety.',
        issued_by: 'BSN (Badan Standardisasi Nasional)'
      },
      {
        title: 'BPOM RI',
        sub: 'Food Safety',
        description: 'Official registration ensuring that our products meet national health and safety requirements.',
        issued_by: 'BPOM (Badan Pengawas Obat dan Makanan)'
      },
      {
        title: 'ISO 22000',
        sub: 'Safety Systems',
        description: 'International standard for food safety management across the entire supply chain.',
        issued_by: 'ISO (International Organization for Standardization)'
      }
    ];

    for (const c of certificates) {
      await client.query(`
        INSERT INTO certificates (title, sub, description, issued_by)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [c.title, c.sub, c.description, c.issued_by]);
    }
    console.log(`   ✅ ${certificates.length} sertifikat berhasil di-seed.\n`);

    // === Selesai ===
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SEEDING SELESAI! Database siap digunakan.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Ringkasan:');
    console.log('   👤 1 admin (admin@pakuaty.com / pakuaty2026)');
    console.log(`   📦 ${products.length} produk`);
    console.log(`   📰 ${articles.length} artikel`);
    console.log(`   🖼️  ${galleries.length} foto galeri`);
    console.log(`   🏅 ${certificates.length} sertifikat`);
    console.log('\n🚀 Jalankan server: npm run dev\n');

  } catch (error) {
    console.error('❌ Error saat seeding:', error.message);
  } finally {
    client.release(); // Kembalikan koneksi ke pool
    await pool.end(); // Tutup semua koneksi pool
    process.exit(0); // Keluar dari proses
  }
}

// Jalankan seed
seedDatabase();
