const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
  ssl: { rejectUnauthorized: false }
});

const products = [
  {
    name: 'Original',
    grade: 'Classic Tempe Chip',
    description: 'Buat kamu yang suka camilan unik dan beda, Keripik Tempe Pakuaty rasa Original siap jadi teman setiamu! \nDibuat dari resep tradisional yang kaya akan rasa otentik budaya Indonesia, Pakuaty menghadirkan kelezatan yang bikin ketagihan. Rasanya renyah, gurih dan tidak berminyak yang akan bikin kamu ingat pada keaslian rasa tempe yang tidak pernah lekang oleh waktu. \nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍'
  },
  {
    name: 'Balado',
    grade: 'Spicy Chili Tempe Chip',
    description: 'Siap merasakan pedasnya yang bikin ketagihan? Keripik Tempe Pakuaty rasa Balado hadir dengan kerenyahan sempurna dan bumbu balado yang nendang. Pas banget buat kamu yang suka ngemil dengan sensasi pedas gurih yang nggak bisa berhenti. Dibuat dari bahan pilihan dan diolah secara higienis, snack 50 gram ini jadi teman setia di setiap momen santaimu, dari ngobrol santai sampai me time yang berharga.\nMau ngemil asik yang bikin nggak bisa stop? Ayo, cobain sekarang dan rasakan sensasi pedas gurih Keripik Tempe Pakuaty yang bakal bikin kamu balik lagi dan lagi!\nKeripik Tempe Pakuaty,\nCoba sekali, Ga bisa berhenti 😋😋😋'
  },
  {
    name: 'BBQ',
    grade: 'Smoky BBQ Tempe Chip',
    description: 'Bawa suasana panggangan ke dalam setiap gigitan dengan Keripik Tempe Pakuaty rasa Barbeque! Kerenyahannya yang maksimal, ditambah dengan sentuhan rasa barbeque yang smoky dan gurih, bikin kamu nggak bisa berhenti ngemil. Cocok banget buat kamu yang ingin menikmati sensasi barbeque kapan saja, di mana saja, tanpa perlu repot. Kemasan 50 gram ini praktis, pas banget untuk temani kesibukan harianmu atau saat santai di rumah.\nNgemil seru tanpa ribet? Cobain Keripik Tempe Pakuaty rasa Barbeque sekarang, dan rasakan sensasi panggangan yang bikin ketagihan! Jangan sampai ketinggalan, buruan beli!\nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍'
  },
  {
    name: 'Keju',
    grade: 'Cheese Tempe Chip',
    description: 'Siap-siap merasakan kombinasi kerenyahan tempe dan gurihnya keju yang lumer di lidah! Keripik Tempe Pakuaty rasa Keju hadir dengan cita rasa keju yang creamy dan bikin nagih. Camilan ringan ini sempurna buat kamu yang suka ngemil tapi tetap ingin rasa yang beda dan penuh kejutan. Dengan kemasan praktis 50 gram, keripik ini jadi teman pas buat menemani kesibukan sehari-hari atau santai bareng keluarga.\nPengen ngemil yang gurih dan beda? Yuk, coba sekarang Keripik Tempe Pakuaty rasa Keju, sekali coba pasti ga bisa berhenti! Jangan sampai kelewatan, segera dapetin di toko terdekat!\nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍'
  },
  {
    name: 'Sapi Panggang',
    grade: 'Roasted Beef Tempe Chip',
    description: 'Temukan kenikmatan baru dalam setiap gigitan! Keripik Tempe Pakuaty rasa Sapi Panggang menyajikan rasa gurih lezat yang bikin lidah bergoyang. Kerenyahannya yang maksimal, ditambah dengan aroma khas sapi panggang yang kaya rasa. Cocok buat kamu yang suka camilan nikmat dengan sentuhan rasa daging yang menggoda. Praktis dalam kemasan 50 gram, pas untuk dibawa ke mana saja, kapan saja\nLagi cari camilan yang beda dari biasanya? Yuk, cobain sekarang Keripik Tempe Pakuaty rasa Sapi Panggang, rasakan gurihnya yang bikin pengen lagi dan lagi!\nPakuaty, \nCoba sekali, ga bisa berhenti! 👍👍👍'
  },
  {
    name: 'Jamur Crispy',
    grade: 'Crispy Mushroom Chip',
    description: 'Ngemil enak tanpa rasa bersalah? Keripik Jamur Pakuaty solusinya! Hadir dalam kemasan praktis 300 gram, keripik ini terbuat dari jamur berkualitas yang diolah dengan cara higienis. Rasanya gurih, teksturnya renyah, dan pastinya bikin ketagihan! Camilan sehat ini cocok untuk menemani aktivitas harianmu, dari sibuk di kantor sampai santai di rumah.\nNggak cuma renyah, tapi juga sehat! Cobain Keripik Jamur Pakuaty sekarang, nikmati setiap gigitan, dan rasakan bedanya! Dapatkan Segera!'
  }
];

async function sync() {
  const client = await pool.connect();
  try {
    for (const p of products) {
      console.log(`Syncing ${p.name}...`);
      await client.query(
        'UPDATE products SET description = $1, grade = $2 WHERE name = $3',
        [p.description, p.grade, p.name]
      );
    }
    console.log('✅ Sync completed successfully!');
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
  } finally {
    client.release();
    process.exit();
  }
}

sync();
