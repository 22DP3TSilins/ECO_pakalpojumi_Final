const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./eco_pakalpojumi.db');

async function seedAdminData() {
  console.log('🔧 SEEDING DATABASE WITH TEST DATA FOR ADMIN PANEL...\n');

  try {
    // Šifrēt paroles
    const demoPassword = await bcrypt.hash('Demo123!', 10);
    const adminPassword = await bcrypt.hash('AdminPass123', 10);
    const userPasswords = await Promise.all([
      bcrypt.hash('User123!', 10),
      bcrypt.hash('User123!', 10),
      bcrypt.hash('User123!', 10),
      bcrypt.hash('User123!', 10),
      bcrypt.hash('User123!', 10),
    ]);

    // Pārliecināties, ka tabulas eksistē
    db.serialize(() => {
      // Izveidot lietotāju tabulu, ja tā neeksistē
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        blocked BOOLEAN DEFAULT 0,
        google_id TEXT
      )`);

      // Pievienot phone kolonnu, ja tā neeksistē (SQLite risinājums)
      db.run(`ALTER TABLE users ADD COLUMN phone TEXT`, (err) => {
        // Ignorēt kļūdu, ja kolonna jau eksistē
      });

      // Izveidot pasūtījumu tabulu, ja tā neeksistē
      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        shipping_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`);

      // Izveidot order_items tabulu, ja tā neeksistē
      db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`);

      // Notīrīt esošos testa datus (saglabājot reālos lietotājus)
      console.log('📦 Clearing old test orders...');
      db.run('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id IN (SELECT id FROM users WHERE email LIKE "%@test.eco.lv"))');
      db.run('DELETE FROM orders WHERE user_id IN (SELECT id FROM users WHERE email LIKE "%@test.eco.lv")');
      db.run('DELETE FROM users WHERE email LIKE "%@test.eco.lv"');

      // Ievietot demonstrācijas lietotāju (pagaidām bez tālruņa, pievienot vēlāk)
      console.log('👤 Creating demo user...');
      db.run(
        `INSERT OR IGNORE INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, datetime('now', '-5 days'))`,
        ['Demo Lietotājs', 'demo@ecopakalpojumi.lv', demoPassword, 'user']
      );

      // Ievietot administratora lietotāju
      console.log('👑 Creating admin user...');
      db.run(
        `INSERT OR IGNORE INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, datetime('now', '-30 days'))`,
        ['Admin', 'admin@ecopakalpojumi.lv', adminPassword, 'admin']
      );

      // Ievietot testa lietotājus ar dažādiem izveides datumiem
      const testUsers = [
        { name: 'Jānis Bērziņš', email: 'janis@test.eco.lv', days: 0 },  // odien
        { name: 'Anna Kalniņa', email: 'anna@test.eco.lv', days: 1 },   // Vakar
        { name: 'Māris Ozols', email: 'maris@test.eco.lv', days: 3 },   // oned
        { name: 'Līga Liepiņa', email: 'liga@test.eco.lv', days: 10 },  // omnes
        { name: 'Pēteris Zariņš', email: 'peteris@test.eco.lv', days: 45 }, // Pagjuaj mnes
        { name: 'Kristīne Bērziņa', email: 'kristine@test.eco.lv', days: 60 }, // Pirms 2 mneiem
        { name: 'Artūrs Kalniņš', email: 'arturs@test.eco.lv', days: 120 }, // ogad
        { name: 'Sandra Ozola', email: 'sandra@test.eco.lv', days: 200 }, // ogad
      ];

      console.log('👥 Creating test users...');
      testUsers.forEach((user, index) => {
        db.run(
          `INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, 'user', datetime('now', '-${user.days} days'))`,
          [user.name, user.email, userPasswords[index % userPasswords.length]]
        );
      });

      // Pagaidīt, kamēr lietotāji tiek izveidoti, tad pievienot pasūtījumus
      setTimeout(() => {
        console.log('📦 Creating test orders...');
        
        // Iegūt visus lietotāju ID
        db.all('SELECT id, name FROM users', [], (err, users) => {
          if (err || !users.length) {
            console.error('❌ Error fetching users:', err);
            return;
          }

          const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
          const orders = [
            { userIndex: 0, total: 45.99, status: 'pending', days: 0 },      // odien
            { userIndex: 1, total: 89.50, status: 'processing', days: 0 },   // odien
            { userIndex: 2, total: 125.00, status: 'shipped', days: 1 },     // Vakar
            { userIndex: 3, total: 67.25, status: 'delivered', days: 2 },    // oned
            { userIndex: 4, total: 234.99, status: 'delivered', days: 5 },   // oned
            { userIndex: 0, total: 55.00, status: 'pending', days: 8 },      // omnes
            { userIndex: 1, total: 178.50, status: 'shipped', days: 12 },    // omnes
            { userIndex: 2, total: 92.00, status: 'delivered', days: 15 },   // omnes
            { userIndex: 3, total: 45.00, status: 'cancelled', days: 20 },   // omnes
            { userIndex: 4, total: 310.00, status: 'delivered', days: 35 },  // Pagjuaj mnes
            { userIndex: 0, total: 88.75, status: 'delivered', days: 40 },   // Pagjuaj mnes
            { userIndex: 1, total: 156.00, status: 'delivered', days: 50 },  // Pirms 2 mneiem
            { userIndex: 2, total: 220.00, status: 'delivered', days: 90 },  // ogad
            { userIndex: 3, total: 75.50, status: 'delivered', days: 150 },  // ogad
            { userIndex: 4, total: 445.00, status: 'delivered', days: 200 }, // ogad
          ];

          orders.forEach(order => {
            const userId = users[order.userIndex % users.length].id;
            db.run(
              `INSERT INTO orders (user_id, total, status, created_at) VALUES (?, ?, ?, datetime('now', '-${order.days} days'))`,
              [userId, order.total, order.status]
            );
          });

          // Gala kopsavilkums
          setTimeout(() => {
            db.get('SELECT COUNT(*) as count FROM users', (err, userCount) => {
              db.get('SELECT COUNT(*) as count FROM orders', (err, orderCount) => {
                db.get('SELECT SUM(total) as total FROM orders', (err, revenue) => {
                  console.log('\n✅ DATABASE SEEDED SUCCESSFULLY!\n');
                  console.log('📊 SUMMARY:');
                  console.log('─────────────────────────────────────');
                  console.log(`👥 Total Users: ${userCount?.count || 0}`);
                  console.log(`📦 Total Orders: ${orderCount?.count || 0}`);
                  console.log(`💰 Total Revenue: €${revenue?.total?.toFixed(2) || 0}`);
                  console.log('─────────────────────────────────────');
                  console.log('\n📝 LOGIN CREDENTIALS:');
                  console.log('─────────────────────────────────────');
                  console.log('Demo User:');
                  console.log('  Email: demo@ecopakalpojumi.lv');
                  console.log('  Password: Demo123!');
                  console.log('─────────────────────────────────────');
                  console.log('Admin User:');
                  console.log('  Email: admin@ecopakalpojumi.lv');
                  console.log('  Password: AdminPass123');
                  console.log('─────────────────────────────────────\n');
                  
                  db.close();
                });
              });
            });
          }, 500);
        });
      }, 500);
    });
  } catch (error) {
    console.error('❌ Error:', error);
    db.close();
  }
}

seedAdminData();
