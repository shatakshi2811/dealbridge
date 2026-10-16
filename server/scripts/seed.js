/**
 * DealBridge — Database Seed Script
 * Run with: npm run seed
 *
 * Seeds:
 *  - 2 demo users (admin + regular user)
 *  - 20 products across 6 categories
 *  - 2-3 merchant offers per product
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const MerchantOffer = require('../src/models/MerchantOffer');
const User = require('../src/models/User');
const Click = require('../src/models/Click');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not defined. Please create a .env file from .env.example');
  process.exit(1);
}

// ─── Seed Data ─────────────────────────────────────────────────────────────

const users = [
  {
    name: 'Admin User',
    email: 'admin@dealbridge.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'Demo User',
    email: 'user@dealbridge.com',
    password: 'User@1234',
    role: 'user',
  },
];

const products = [
  // ── Watches ──────────────────────────────────────────────────────────────
  {
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    model: 'Series 9 GPS 45mm',
    description:
      'Apple Watch Series 9 with the new S9 chip, Double Tap gesture, Siri on device, and bright Always-On Retina display. Track your fitness, stay connected, and more.',
    category: 'Watches',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MR9A3_VW_34FR+watch-45-alum-midnight-nc-9s_VW_34FR_WF_CO_GEO_IN?wid=750&hei=712',
    ],
    specifications: new Map([
      ['Display', '45mm Always-On Retina LTPO OLED'],
      ['Chip', 'Apple S9 SiP'],
      ['Battery', 'Up to 18 hours'],
      ['Water Resistance', '50 metres'],
      ['Connectivity', 'GPS, Bluetooth 5.3, Wi-Fi'],
    ]),
  },
  {
    name: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    model: 'Galaxy Watch 6 Classic 47mm',
    description:
      'Sleek and sophisticated, the Samsung Galaxy Watch 6 Classic features advanced health monitoring, a rotating bezel, and seamless integration with Android devices.',
    category: 'Watches',
    images: [
      'https://images.samsung.com/in/smartphones/galaxy-watch6-classic/buy/06_GW6C_47mm_Black_DPG.jpg',
    ],
    specifications: new Map([
      ['Display', '1.4" Super AMOLED'],
      ['Processor', 'Exynos W930'],
      ['Battery', '425 mAh'],
      ['Water Resistance', '5ATM + IP68'],
      ['OS', 'Wear OS 4 with One UI Watch 5'],
    ]),
  },
  {
    name: 'Fossil Gen 6 Smartwatch',
    brand: 'Fossil',
    model: 'Gen 6 44mm',
    description:
      'Fossil Gen 6 combines classic watch design with Wear OS, Snapdragon Wear 4100+ chip, and health tracking features like SpO2 and heart rate monitoring.',
    category: 'Watches',
    images: [
      'https://fossil.scene7.com/is/image/FossilPartners/FTW4059_main?wid=1400&fmt=jpg',
    ],
    specifications: new Map([
      ['Display', '1.28" AMOLED'],
      ['Chip', 'Snapdragon Wear 4100+'],
      ['Battery', '300 mAh'],
      ['Water Resistance', '3ATM'],
      ['OS', 'Wear OS by Google'],
    ]),
  },

  // ── Smartphones ───────────────────────────────────────────────────────────
  {
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    model: 'iPhone 15 Pro 256GB',
    description:
      'iPhone 15 Pro with the A17 Pro chip, titanium design, Action button, and a 48MP camera system with 5x optical zoom. The most pro iPhone ever.',
    category: 'Smartphones',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_AV1?wid=800',
    ],
    specifications: new Map([
      ['Chip', 'A17 Pro'],
      ['Display', '6.1" Super Retina XDR ProMotion'],
      ['Camera', '48MP Main + 12MP Ultra Wide + 12MP Telephoto 5x'],
      ['Battery', 'Up to 23 hours video playback'],
      ['Storage', '256GB'],
    ]),
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra 256GB',
    description:
      'Galaxy S24 Ultra with the built-in S Pen, 200MP camera, Snapdragon 8 Gen 3, and Galaxy AI features. The ultimate Android flagship.',
    category: 'Smartphones',
    images: [
      'https://images.samsung.com/in/smartphones/galaxy-s24-ultra/buy/galaxy-s24-ultra-titanium-gray.png',
    ],
    specifications: new Map([
      ['Processor', 'Snapdragon 8 Gen 3'],
      ['Display', '6.8" Dynamic AMOLED 2X 120Hz'],
      ['Camera', '200MP + 50MP + 10MP + 12MP'],
      ['Battery', '5000 mAh'],
      ['RAM', '12GB'],
    ]),
  },
  {
    name: 'OnePlus 12',
    brand: 'OnePlus',
    model: 'OnePlus 12 256GB',
    description:
      'OnePlus 12 with Snapdragon 8 Gen 3, 50MP Hasselblad camera system, 100W SUPERVOOC charging, and a stunning 2K ProXDR display.',
    category: 'Smartphones',
    images: [
      'https://image01.oneplus.net/ebp/202312/22/1-m00-53-62-rb8bwgwhk_gafvf-aadocupbzjo487.png',
    ],
    specifications: new Map([
      ['Processor', 'Snapdragon 8 Gen 3'],
      ['Display', '6.82" 2K ProXDR 120Hz AMOLED'],
      ['Camera', '50MP Hasselblad Main + 48MP Ultra Wide + 64MP Telephoto'],
      ['Battery', '5400 mAh with 100W charging'],
      ['RAM', '16GB'],
    ]),
  },
  {
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    model: 'Pixel 8 Pro 128GB',
    description:
      'Google Pixel 8 Pro with the Tensor G3 chip, Best Take camera feature, Temperature sensor, and 7 years of OS and security updates.',
    category: 'Smartphones',
    images: [
      'https://lh3.googleusercontent.com/HHpHBIMSYEpz9gkbqvj7IQHAD3V1bfOHv8ADwrJv_wbVtns4',
    ],
    specifications: new Map([
      ['Processor', 'Google Tensor G3'],
      ['Display', '6.7" LTPO OLED 120Hz'],
      ['Camera', '50MP Main + 48MP Ultra Wide + 48MP Telephoto 5x'],
      ['Battery', '5050 mAh'],
      ['Updates', '7 years of OS & security updates'],
    ]),
  },

  // ── Laptops ───────────────────────────────────────────────────────────────
  {
    name: 'MacBook Air M2',
    brand: 'Apple',
    model: 'MacBook Air M2 13" 512GB',
    description:
      'Supercharged by the M2 chip, MacBook Air is impossibly thin and light with a stunning Liquid Retina display, up to 18 hours battery, and silent fanless design.',
    category: 'Laptops',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=800',
    ],
    specifications: new Map([
      ['Chip', 'Apple M2'],
      ['Display', '13.6" Liquid Retina'],
      ['RAM', '8GB Unified Memory'],
      ['Storage', '512GB SSD'],
      ['Battery', 'Up to 18 hours'],
    ]),
  },
  {
    name: 'Dell XPS 15',
    brand: 'Dell',
    model: 'XPS 15 9530 Intel Core i7',
    description:
      'Dell XPS 15 with 13th Gen Intel Core i7, NVIDIA RTX 4060, and a stunning OLED touch display. Perfect for creative professionals.',
    category: 'Laptops',
    images: [
      'https://i.dell.com/sites/csimages/App-Merchandizing_Images/all/xps-15-9530.jpg',
    ],
    specifications: new Map([
      ['Processor', 'Intel Core i7-13700H'],
      ['Display', '15.6" OLED 3.5K Touch'],
      ['GPU', 'NVIDIA GeForce RTX 4060'],
      ['RAM', '16GB DDR5'],
      ['Storage', '512GB NVMe SSD'],
    ]),
  },
  {
    name: 'HP Spectre x360',
    brand: 'HP',
    model: 'Spectre x360 14" 2-in-1',
    description:
      'HP Spectre x360 14-inch 2-in-1 convertible with Intel Evo platform, stunning OLED display, and premium design. Use as laptop, tent, or tablet.',
    category: 'Laptops',
    images: [
      'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knivel/c08361000.png',
    ],
    specifications: new Map([
      ['Processor', 'Intel Core i7-1355U'],
      ['Display', '14" 2.8K OLED Touch'],
      ['RAM', '16GB LPDDR5'],
      ['Storage', '1TB NVMe SSD'],
      ['Form Factor', '2-in-1 Convertible'],
    ]),
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 11',
    description:
      'The legendary ThinkPad X1 Carbon Gen 11 with Intel Core i7 vPro, military-grade durability, 14" 2.8K OLED display, and all-day battery life.',
    category: 'Laptops',
    images: [
      'https://p3-ofp.static.pub/fes/cms/2023/03/27/5pcxqkxwlz4s88e3bam2c6g8btzgqf761484.png',
    ],
    specifications: new Map([
      ['Processor', 'Intel Core i7-1365U vPro'],
      ['Display', '14" 2.8K OLED'],
      ['RAM', '16GB LPDDR5'],
      ['Storage', '512GB SSD'],
      ['Weight', '1.12 kg'],
    ]),
  },

  // ── Headphones ────────────────────────────────────────────────────────────
  {
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    model: 'WH-1000XM5',
    description:
      'Industry-leading noise cancelling headphones with Auto NC Optimizer, precise voice pickup, up to 30-hour battery, and multipoint connection.',
    category: 'Headphones',
    images: [
      'https://www.sony.co.in/image/5d02da5df552836db894cead8a68f764?fmt=png-alpha&wid=800',
    ],
    specifications: new Map([
      ['Driver', '30mm'],
      ['Noise Cancellation', 'Yes — Dual Noise Sensor'],
      ['Battery', 'Up to 30 hours (NC on)'],
      ['Connectivity', 'Bluetooth 5.2, 3.5mm'],
      ['Weight', '250g'],
    ]),
  },
  {
    name: 'Bose QuietComfort 45',
    brand: 'Bose',
    model: 'QuietComfort 45',
    description:
      'Bose QC45 with world-class noise cancellation, balanced sound, comfortable design, and 24-hour battery. Quiet and aware modes at the press of a button.',
    category: 'Headphones',
    images: [
      'https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/quietcomfort_45/images/quickview/qc45_black.jpg',
    ],
    specifications: new Map([
      ['Noise Cancellation', 'Active Noise Cancellation'],
      ['Battery', 'Up to 24 hours'],
      ['Connectivity', 'Bluetooth 5.1, 2.5mm'],
      ['Modes', 'Quiet Mode, Aware Mode'],
      ['Weight', '238g'],
    ]),
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    brand: 'Apple',
    model: 'AirPods Pro 2nd Generation',
    description:
      'AirPods Pro 2nd generation with H2 chip, up to 2x more Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio, and Touch control.',
    category: 'Headphones',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=800',
    ],
    specifications: new Map([
      ['Chip', 'Apple H2'],
      ['Noise Cancellation', 'Active Noise Cancellation'],
      ['Battery', 'Up to 6 hours (30 with case)'],
      ['Water Resistance', 'IP54'],
      ['Features', 'Adaptive Transparency, Spatial Audio'],
    ]),
  },

  // ── Fashion ───────────────────────────────────────────────────────────────
  {
    name: "Nike Air Max 270",
    brand: 'Nike',
    model: 'Air Max 270 Men\'s Shoes',
    description:
      "The Nike Air Max 270 features Nike's biggest heel Air unit yet for a super-soft ride. Breathable mesh upper and a foam midsole keep you comfortable all day.",
    category: 'Fashion',
    images: [
      'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-665455a5-45de-40fb-945f-c1852b82400d/air-max-270-mens-shoes-KkLcGR.png',
    ],
    specifications: new Map([
      ['Type', 'Lifestyle Shoe'],
      ['Upper', 'Mesh'],
      ['Sole', 'Air Max unit + foam midsole'],
      ['Sizes Available', 'UK 6 to UK 12'],
      ['Gender', "Men's"],
    ]),
  },
  {
    name: "Levi's 501 Original Jeans",
    brand: "Levi's",
    model: '501 Original Fit',
    description:
      "The original jean since 1873. Levi's 501 jeans feature a straight leg, button fly, and a classic regular fit that looks great on everyone.",
    category: 'Fashion',
    images: [
      'https://lsco.scene7.com/is/image/lscotablet/005010194-front-pdp?fmt=jpeg&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=720&hei=900',
    ],
    specifications: new Map([
      ['Fit', 'Regular Straight'],
      ['Closure', 'Button Fly'],
      ['Material', '100% Cotton denim'],
      ['Rise', 'Mid Rise'],
      ['Available Sizes', '28-44 waist'],
    ]),
  },
  {
    name: 'Ray-Ban Aviator Classic',
    brand: 'Ray-Ban',
    model: 'RB3025 Aviator Classic',
    description:
      'The Ray-Ban Aviator Classic — an icon since 1937. Timeless teardrop shape, metal frame, and crystal lenses for crisp, clear vision with UV protection.',
    category: 'Fashion',
    images: [
      'https://assets.ray-ban.com/is/image/RayBan/805289602057-HERO-A?wid=800',
    ],
    specifications: new Map([
      ['Frame Material', 'Metal'],
      ['Lens Material', 'Crystal'],
      ['UV Protection', '100% UV400'],
      ['Frame Size', '58mm'],
      ['Style', 'Aviator'],
    ]),
  },

  // ── Home Appliances ───────────────────────────────────────────────────────
  {
    name: 'Dyson V15 Detect',
    brand: 'Dyson',
    model: 'V15 Detect Absolute',
    description:
      'Dyson V15 Detect with laser that reveals hidden dust, piezo sensor that counts and sizes particles, and up to 60 minutes of powerful suction.',
    category: 'Home Appliances',
    images: [
      'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/vacuums/cordless/v15-detect/v15-detect-absolute-iron-yellow/v15-detect-absolute-iron-yellow.png?wid=800',
    ],
    specifications: new Map([
      ['Suction Power', '240 AW'],
      ['Battery Life', 'Up to 60 minutes'],
      ['Filtration', 'Whole-machine HEPA filtration'],
      ['Weight', '3.1 kg'],
      ['Charging Time', '4.5 hours'],
    ]),
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    brand: 'Instant Pot',
    model: 'Duo 7-in-1 6 Litre',
    description:
      'The Instant Pot Duo replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
    category: 'Home Appliances',
    images: [
      'https://m.media-amazon.com/images/I/71V1LoPpKEL._AC_SL1500_.jpg',
    ],
    specifications: new Map([
      ['Capacity', '6 Litre'],
      ['Functions', '7-in-1'],
      ['Presets', '14 Smart Programs'],
      ['Material', '18/8 Stainless Steel'],
      ['Safety Certifications', 'UL, cUL, CE, CB, RCM'],
    ]),
  },
  {
    name: 'Philips Air Fryer XXL',
    brand: 'Philips',
    model: 'HD9270/91 Airfryer XXL',
    description:
      'Philips Air Fryer XXL uses Rapid Air technology to fry with up to 90% less fat. Extra-large 1.4kg capacity, dishwasher-safe parts, and 5 smart presets.',
    category: 'Home Appliances',
    images: [
      'https://www.philips.co.in/c-dam/b2c/category-pages/cooking/air-fryers/hd9270-90-front.jpg',
    ],
    specifications: new Map([
      ['Capacity', '1.4 kg / 6.2 Litre'],
      ['Technology', 'TurboStar Rapid Air'],
      ['Power', '2225W'],
      ['Presets', '5 smart cooking programs'],
      ['Dishwasher Safe', 'Yes (drawer and basket)'],
    ]),
  },
];

// Merchant offers data — will be associated with product _ids after insertion
const offerTemplates = [
  // Apple Watch Series 9
  { productIndex: 0, offers: [
    { merchantName: 'Amazon', price: 41900, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Apple-Smartwatch-Midnight-Aluminium-Sport/dp/B0CG9JQDJ5' },
    { merchantName: 'Croma', price: 43900, availability: 'In Stock', destinationUrl: 'https://www.croma.com/apple-watch-series-9-gps-45mm/p/263481' },
    { merchantName: 'Flipkart', price: 42999, availability: 'Limited', destinationUrl: 'https://www.flipkart.com/apple-watch-series-9-gps-45-mm-midnight-aluminium-case-sport-band/p/itm123' },
  ]},
  // Samsung Galaxy Watch 6
  { productIndex: 1, offers: [
    { merchantName: 'Amazon', price: 34999, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Samsung-Galaxy-Watch6-Classic-Bluetooth/dp/B0C7RS6Q2J' },
    { merchantName: 'Flipkart', price: 32999, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/samsung-galaxy-watch6-classic-bluetooth-47mm/p/itm456' },
  ]},
  // Fossil Gen 6
  { productIndex: 2, offers: [
    { merchantName: 'Amazon', price: 19995, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Fossil-Gen-Smartwatch-FTW4059/dp/B09GZL4XNW' },
    { merchantName: 'Myntra', price: 21999, availability: 'Limited', destinationUrl: 'https://www.myntra.com/fossil-gen-6-smartwatch' },
  ]},
  // iPhone 15 Pro
  { productIndex: 3, offers: [
    { merchantName: 'Amazon', price: 134900, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Apple-iPhone-15-Pro-256/dp/B0CHX3QBCH' },
    { merchantName: 'Flipkart', price: 132999, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/apple-iphone-15-pro-natural-titanium-256-gb/p/itm789' },
    { merchantName: 'Croma', price: 134900, availability: 'In Stock', destinationUrl: 'https://www.croma.com/apple-iphone-15-pro-256gb/p/264578' },
  ]},
  // Samsung Galaxy S24 Ultra
  { productIndex: 4, offers: [
    { merchantName: 'Amazon', price: 124999, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Samsung-Galaxy-S24-Ultra-Titanium/dp/B0CSVB8P9X' },
    { merchantName: 'Flipkart', price: 119999, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itm321' },
    { merchantName: 'Reliance Digital', price: 124999, availability: 'In Stock', destinationUrl: 'https://www.reliancedigital.in/samsung-galaxy-s24-ultra/p/493696048' },
  ]},
  // OnePlus 12
  { productIndex: 5, offers: [
    { merchantName: 'Amazon', price: 64999, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/OnePlus-12-Silky-Black-256GB/dp/B0CQSVLWRH' },
    { merchantName: 'Flipkart', price: 62999, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/oneplus-12-silky-black-256-gb/p/itm654' },
  ]},
  // Pixel 8 Pro
  { productIndex: 6, offers: [
    { merchantName: 'Flipkart', price: 89999, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/google-pixel-8-pro-obsidian-128-gb/p/itmdf10bd04d12c4' },
    { merchantName: 'Amazon', price: 92999, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Google-Pixel-Pro-Obsidian-128GB/dp/B0CGP9SGTF' },
  ]},
  // MacBook Air M2
  { productIndex: 7, offers: [
    { merchantName: 'Amazon', price: 114900, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Apple-MacBook-Laptop-chip-512GB/dp/B0B3C2R8MP' },
    { merchantName: 'Croma', price: 119990, availability: 'In Stock', destinationUrl: 'https://www.croma.com/apple-macbook-air-m2-512gb/p/257710' },
    { merchantName: 'Flipkart', price: 112999, availability: 'Limited', destinationUrl: 'https://www.flipkart.com/apple-macbook-air-apple-m2-8-gb-512-gb-ssd-mac-os-monterey-mly43hn-a/p/itm987' },
  ]},
  // Dell XPS 15
  { productIndex: 8, offers: [
    { merchantName: 'Amazon', price: 174999, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Dell-XPS-15-9530-Laptop/dp/B0CB9XNX67' },
    { merchantName: 'Flipkart', price: 169999, availability: 'Limited', destinationUrl: 'https://www.flipkart.com/dell-xps-15-9530-intel-core-i7-13th-gen/p/itm246' },
  ]},
  // HP Spectre x360
  { productIndex: 9, offers: [
    { merchantName: 'Amazon', price: 159999, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/HP-Spectre-x360-14-ef0051TU/dp/B09YLBMMJX' },
    { merchantName: 'Flipkart', price: 154999, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/hp-spectre-x360-core-i7-13th-gen/p/itm135' },
  ]},
  // Lenovo ThinkPad X1 Carbon
  { productIndex: 10, offers: [
    { merchantName: 'Amazon', price: 189990, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Lenovo-ThinkPad-X1-Carbon-Gen11/dp/B0BY4RRDLW' },
    { merchantName: 'Flipkart', price: 184999, availability: 'Limited', destinationUrl: 'https://www.flipkart.com/lenovo-thinkpad-x1-carbon-gen11/p/itm579' },
    { merchantName: 'Reliance Digital', price: 191990, availability: 'In Stock', destinationUrl: 'https://www.reliancedigital.in/lenovo-thinkpad-x1-carbon/p/493696120' },
  ]},
  // Sony WH-1000XM5
  { productIndex: 11, offers: [
    { merchantName: 'Amazon', price: 26990, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Sony-WH-1000XM5-Cancelling-Headphones-Hands-Free/dp/B09XS7JWHH' },
    { merchantName: 'Flipkart', price: 24990, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itmb7fa8b74f7edc' },
    { merchantName: 'Croma', price: 27990, availability: 'In Stock', destinationUrl: 'https://www.croma.com/sony-wh1000xm5-wireless-headphone/p/253476' },
  ]},
  // Bose QC45
  { productIndex: 12, offers: [
    { merchantName: 'Amazon', price: 24500, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Bose-QuietComfort-45-Bluetooth-Cancelling/dp/B098FKXT8L' },
    { merchantName: 'Flipkart', price: 22990, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/bose-quietcomfort-45-bluetooth-headset/p/itme6bb5117dc0f0' },
  ]},
  // AirPods Pro 2
  { productIndex: 13, offers: [
    { merchantName: 'Amazon', price: 24900, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Apple-AirPods-Pro-2nd-Generation/dp/B0BDHWDR12' },
    { merchantName: 'Croma', price: 26900, availability: 'In Stock', destinationUrl: 'https://www.croma.com/apple-airpods-pro-2nd-generation/p/259498' },
    { merchantName: 'Flipkart', price: 24500, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/apple-airpods-pro-2nd-generation-magsafe-charging-case/p/itm2a3bef51e58e3' },
  ]},
  // Nike Air Max 270
  { productIndex: 14, offers: [
    { merchantName: 'Amazon', price: 10795, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Nike-Air-Max-270-Shoes/dp/B079PHN6RS' },
    { merchantName: 'Myntra', price: 9999, availability: 'In Stock', destinationUrl: 'https://www.myntra.com/sports-shoes/nike/nike-men-air-max-270-shoes' },
    { merchantName: 'Flipkart', price: 10599, availability: 'Limited', destinationUrl: 'https://www.flipkart.com/nike-air-max-270-running-shoes/p/itmfc01d1bd7e7b1' },
  ]},
  // Levi's 501
  { productIndex: 15, offers: [
    { merchantName: 'Amazon', price: 3799, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Levis-Mens-00501-0101-Jeans/dp/B00DE0TXIY' },
    { merchantName: 'Myntra', price: 3499, availability: 'In Stock', destinationUrl: 'https://www.myntra.com/jeans/levis/levis-men-501-original-regular-fit-jeans' },
    { merchantName: 'Ajio', price: 3299, availability: 'In Stock', destinationUrl: 'https://www.ajio.com/levis-501-original-fit-jeans' },
  ]},
  // Ray-Ban Aviator
  { productIndex: 16, offers: [
    { merchantName: 'Amazon', price: 8990, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Ray-Ban-RB3025-Aviator-Classic/dp/B001IT5YCC' },
    { merchantName: 'Myntra', price: 9490, availability: 'In Stock', destinationUrl: 'https://www.myntra.com/sunglasses/ray-ban/ray-ban-unisex-aviator-classic' },
    { merchantName: 'Flipkart', price: 8799, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/ray-ban-aviator-classic-sunglasses/p/itm568' },
  ]},
  // Dyson V15
  { productIndex: 17, offers: [
    { merchantName: 'Amazon', price: 62900, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Dyson-V15-Detect-Absolute-Vacuum/dp/B092TR4FXN' },
    { merchantName: 'Croma', price: 64990, availability: 'In Stock', destinationUrl: 'https://www.croma.com/dyson-v15-detect-absolute-cordless-vacuum-cleaner/p/254003' },
    { merchantName: 'Flipkart', price: 61990, availability: 'Limited', destinationUrl: 'https://www.flipkart.com/dyson-v15-detect-handheld-vacuum-cleaner/p/itm8e8de8cf7e2a2' },
  ]},
  // Instant Pot
  { productIndex: 18, offers: [
    { merchantName: 'Amazon', price: 7999, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Instant-Pot-DUO60-Electric-Pressure/dp/B00FLYWNYQ' },
    { merchantName: 'Flipkart', price: 7499, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/instant-pot-duo-6-litre/p/itm753' },
    { merchantName: 'Tata CLiQ', price: 8299, availability: 'In Stock', destinationUrl: 'https://www.tatacliq.com/instant-pot-duo-6-litre' },
  ]},
  // Philips Air Fryer
  { productIndex: 19, offers: [
    { merchantName: 'Amazon', price: 11995, availability: 'In Stock', destinationUrl: 'https://www.amazon.in/Philips-HD9270-91-AirFryer-Capacity/dp/B08HJCQ3S7' },
    { merchantName: 'Flipkart', price: 10999, availability: 'In Stock', destinationUrl: 'https://www.flipkart.com/philips-hd9270-91-2225-w-air-fryer/p/itm13c7ba5e0c6a6' },
    { merchantName: 'Croma', price: 12490, availability: 'In Stock', destinationUrl: 'https://www.croma.com/philips-air-fryer-xxl/p/234569' },
  ]},
];

// ─── Seed function ─────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    // Clear existing data
    console.log('🗑   Clearing existing data...');
    await Promise.all([
      Product.deleteMany({}),
      MerchantOffer.deleteMany({}),
      User.deleteMany({}),
      Click.deleteMany({}),
    ]);

    // Seed users
    console.log('👤  Seeding users...');
    const createdUsers = await User.create(users);
    console.log(`    ✓ Created ${createdUsers.length} users`);
    console.log('    → admin@dealbridge.com / Admin@123');
    console.log('    → user@dealbridge.com  / User@1234');

    // Seed products
    console.log('📦  Seeding products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`    ✓ Created ${createdProducts.length} products`);

    // Seed merchant offers
    console.log('🛒  Seeding merchant offers...');
    const offerDocs = offerTemplates.flatMap(({ productIndex, offers }) =>
      offers.map((offer) => ({
        ...offer,
        product: createdProducts[productIndex]._id,
      }))
    );

    // Insert offers one by one so post-save hooks update lowestPrice correctly
    let offerCount = 0;
    for (const offerData of offerDocs) {
      await MerchantOffer.create(offerData);
      offerCount++;
    }
    console.log(`    ✓ Created ${offerCount} merchant offers`);

    // Summary
    console.log('\n🎉  Seed complete!');
    console.log('─'.repeat(50));
    console.log(`Products:        ${createdProducts.length}`);
    console.log(`Merchant Offers: ${offerCount}`);
    console.log(`Users:           ${createdUsers.length}`);
    console.log('─'.repeat(50));
    console.log('\nDemo credentials:');
    console.log('  Admin → admin@dealbridge.com / Admin@123');
    console.log('  User  → user@dealbridge.com  / User@1234');

    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

seed();
