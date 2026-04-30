// Seed the products catalog with eco-friendly items.
// Run: node backend/seed-products.cjs
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'eco_pakalpojumi.db');
const db = new sqlite3.Database(dbPath);

const products = [
  // Home
  {
    name: 'Bamboo Toothbrush Set',
    description: 'Pack of 4 biodegradable bamboo toothbrushes with soft BPA-free bristles. Compostable handles reduce plastic waste.',
    price: 7.99,
    category: 'Home',
    stock: 250,
    image_url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&q=80',
    lifecycle_info: 'Handles fully compost in 6 months. Replaces ~16 plastic toothbrushes per year per person.'
  },
  {
    name: 'Soy Wax Candle (Lavender)',
    description: 'Hand-poured soy wax candle in reusable amber glass jar. 40h burn time. Cotton wick, no paraffin.',
    price: 14.50,
    category: 'Home',
    stock: 180,
    image_url: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600&q=80',
    lifecycle_info: 'Soy wax is renewable and biodegradable. Glass jar is reusable / fully recyclable.'
  },

  // Kitchen
  {
    name: 'Reusable Beeswax Food Wraps (Set of 3)',
    description: 'Replace plastic cling film with beeswax-coated organic cotton wraps. Washable and reusable for up to a year.',
    price: 18.90,
    category: 'Kitchen',
    stock: 320,
    image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80',
    lifecycle_info: 'One set replaces ~80 m of plastic wrap. Compostable at end of life.'
  },
  {
    name: 'Stainless Steel Lunch Box',
    description: 'Two-tier leak-proof stainless steel lunch box. Plastic-free and dishwasher-safe.',
    price: 24.99,
    category: 'Kitchen',
    stock: 140,
    image_url: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&q=80',
    lifecycle_info: 'Durable steel lasts decades; saves ~600 disposable containers over 5 years of daily use.'
  },

  // Garden
  {
    name: 'Compost Bin (Kitchen Counter)',
    description: '5L odor-control countertop compost bin with charcoal filter. Turn food scraps into garden gold.',
    price: 29.95,
    category: 'Garden',
    stock: 95,
    image_url: 'https://images.unsplash.com/photo-1591100302424-2ac9be8aa6f9?w=600&q=80',
    lifecycle_info: 'Diverts ~150 kg of organic waste from landfill per household per year.'
  },
  {
    name: 'Heirloom Vegetable Seed Kit',
    description: 'Curated set of 12 organic, non-GMO heirloom seed packets: tomatoes, peppers, herbs, leafy greens.',
    price: 16.00,
    category: 'Garden',
    stock: 210,
    image_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80',
    lifecycle_info: 'Open-pollinated seeds can be saved each season for self-sufficient growing.'
  },

  // Beauty
  {
    name: 'Solid Shampoo Bar',
    description: 'Plastic-free shampoo bar with argan oil and shea butter. Equivalent to ~3 bottles of liquid shampoo.',
    price: 9.50,
    category: 'Beauty',
    stock: 400,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    lifecycle_info: 'Zero plastic packaging. Saves 3 bottles of plastic per bar.'
  },
  {
    name: 'Refillable Deodorant Stick',
    description: 'Aluminium-free natural deodorant in a refillable stainless steel tube. Available in 3 scents.',
    price: 12.75,
    category: 'Beauty',
    stock: 175,
    image_url: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=600&q=80',
    lifecycle_info: 'Refills come in compostable paper packaging. The tube lasts a lifetime.'
  },

  // Fashion
  {
    name: 'Organic Cotton T-Shirt',
    description: 'GOTS-certified organic cotton t-shirt, fair trade. Naturally dyed, available in 5 earth tones.',
    price: 28.00,
    category: 'Fashion',
    stock: 220,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    lifecycle_info: 'Uses 91% less water than conventional cotton. Biodegrades in soil within 5 months.'
  },
  {
    name: 'Recycled PET Backpack',
    description: 'Durable 20L backpack made from 18 recycled plastic bottles. Padded laptop sleeve included.',
    price: 49.99,
    category: 'Fashion',
    stock: 110,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    lifecycle_info: 'Each bag diverts 18 PET bottles from landfill or ocean.'
  },

  // Electronics
  {
    name: 'Solar Power Bank 20 000 mAh',
    description: 'Charge phones and tablets anywhere with built-in solar panel and USB-C fast charge.',
    price: 39.90,
    category: 'Electronics',
    stock: 75,
    image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
    lifecycle_info: 'Solar charging reduces grid electricity use. Casing made of 60% recycled plastic.'
  },
  {
    name: 'LED Smart Bulb (E27, 9W)',
    description: 'Wi-Fi smart LED bulb, 800 lumens, 25 000h lifespan. Replaces 60W incandescent.',
    price: 11.99,
    category: 'Electronics',
    stock: 500,
    image_url: 'https://images.unsplash.com/photo-1565636192335-eed52e6cf1f1?w=600&q=80',
    lifecycle_info: 'Saves ~80 kWh per year per bulb compared to incandescent.'
  },

  // Office
  {
    name: 'Recycled Paper Notebook (A5)',
    description: '120-page A5 notebook made from 100% post-consumer recycled paper. Stitched binding lays flat.',
    price: 6.50,
    category: 'Office',
    stock: 600,
    image_url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80',
    lifecycle_info: 'Saves ~5L of water and 1.5 kg CO\u2082 per notebook vs. virgin paper.'
  },
  {
    name: 'Plantable Pencil Set (Pack of 8)',
    description: 'Wood pencils with seed capsules at the end. Plant the stub when finished to grow herbs or flowers.',
    price: 9.95,
    category: 'Office',
    stock: 340,
    image_url: 'https://images.unsplash.com/photo-1502014822147-1aedfb0676e0?w=600&q=80',
    lifecycle_info: 'Zero waste pencils made from FSC-certified wood and non-GMO seeds.'
  },

  // Food
  {
    name: 'Organic Loose-Leaf Green Tea (100 g)',
    description: 'Single-origin organic sencha green tea in a refillable tin. No tea bag waste.',
    price: 12.50,
    category: 'Food',
    stock: 260,
    image_url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
    lifecycle_info: 'Loose tea avoids ~150 plastic-coated tea bags per tin.'
  },
  {
    name: 'Fair-Trade Dark Chocolate (70%)',
    description: 'Single-origin Peruvian cacao, fair-trade certified, in compostable paper wrap.',
    price: 4.25,
    category: 'Food',
    stock: 480,
    image_url: 'https://images.unsplash.com/photo-1623430196750-91ec2e15a37c?w=600&q=80',
    lifecycle_info: 'Supports smallholder farmers and uses fully compostable packaging.'
  }
];

db.serialize(() => {
  // Remove the test product if present
  db.run("DELETE FROM products WHERE name = 'ER Diagramma'", function (err) {
    if (err) console.error('Delete error:', err.message);
    else if (this.changes > 0) console.log(`Removed ${this.changes} test product(s).`);
  });

  const stmt = db.prepare(
    'INSERT INTO products (name, description, price, category, stock, image_url, lifecycle_info) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  let inserted = 0;
  let skipped = 0;
  let pending = products.length;

  products.forEach((p) => {
    db.get('SELECT id FROM products WHERE name = ?', [p.name], (err, row) => {
      if (err) {
        console.error('Lookup error:', err.message);
      } else if (row) {
        skipped++;
      } else {
        stmt.run(p.name, p.description, p.price, p.category, p.stock, p.image_url, p.lifecycle_info, (e) => {
          if (e) console.error('Insert error for', p.name, e.message);
        });
        inserted++;
      }
      pending--;
      if (pending === 0) {
        stmt.finalize(() => {
          console.log(`Done. Inserted: ${inserted}, skipped (already exist): ${skipped}.`);
          db.all('SELECT COUNT(*) AS c FROM products', (e, rs) => {
            if (!e) console.log(`Total products in catalog: ${rs[0].c}`);
            db.close();
          });
        });
      }
    });
  });
});
