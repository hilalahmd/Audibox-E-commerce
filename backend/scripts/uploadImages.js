const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const images = [
  'beats_studio_pro2.png',
  'bose_ultra.png',
  'senn_m4.png',
  'Marshall Emberton III .png',
  'sony_WF.png',
  'airpods_pro.png',
  'technics_AZ2.png',
  'senn_tws4.png',
  'Bose_soundlink.png',
  'Marshall E II.png',
  'JBL_2.png',
  'Bose_H1.png',
  'samsung_buds4.png',
  'saregama.png',
  'marshaljumbo.png',
  'Bosemicro.png',
  'jblbar.png',
  'skullcandy.png',
  'sonos.png',
  'senneheiser3.png',
  'Hifiman.png',
  'marshall Major.png',
  'nothing1.png',
  'sony_aura.png',
  'sonyaqua.png',
  'skullcandyneon.png',
  'skullcandyneonbuds.png',
  'Bose_master.png',
];

const uploadAll = async () => {

  const imagesFolder = path.join(__dirname, '../frontend/public/images');

  console.log('🚀 Uploading images to Cloudinary...\n');

  const results = {};

  for (const filename of images) {
    const filePath = path.join(imagesFolder, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Not found: ${filename} — skipping`);
      continue;
    }

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'ecommerce-products',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      results[filename] = result.secure_url;
      console.log(`✅ ${filename}`);
      console.log(`   → ${result.secure_url}\n`);

    } catch (err) {
      console.log(`❌ Failed: ${filename} — ${err.message}\n`);
    }
  }

  fs.writeFileSync(
    path.join(__dirname, 'cloudinaryUrls.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('🎉 Done! All URLs saved to cloudinaryUrls.json');
};

uploadAll();
