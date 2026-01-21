const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./eco_pakalpojumi.db');

async function seedAdminData() {
  console.log('🔧 SEEDING DATABASE WITH TEST DATA FOR ADMIN PANEL...\n');

  try {
    // Hash passwords
    const demoPassword = await bcrypt.hash('Demo123!', 10);
    const adminPassword = await bcrypt.hash('AdminPass123', 10);
    const userPasswords = await Promise.all([
      bcrypt.hash('User123!', 10),
      bcrypt.hash('User123!', 10),
      bcrypt.hash('User123!', 10),
      bcrypt.hash('User123!', 10),
      bcrypt.hash('User123!', 10),
    ]);

    // Ensure tables exist
    db.serialize(() => {
      // Create users table if not exists
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

      // Add phone column if it doesn't exist (SQLite workaround)
      db.run(`ALTER TABLE users ADD COLUMN phone TEXT`, (err) => {
        // Ignore error if column already exists
      });

      // Create orders table if not exists
      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        shipping_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`);

      // Create order_items table if not exists
      db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`);

      // Clear existing test data (but keep real users)
      console.log('📦 Clearing old test orders...');
      db.run('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id IN (SELECT id FROM users WHERE email LIKE "%@test.eco.lv"))');
      db.run('DELETE FROM orders WHERE user_id IN (SELECT id FROM users WHERE email LIKE "%@test.eco.lv")');
      db.run('DELETE FROM users WHERE email LIKE "%@test.eco.lv"');

      // Insert demo user (without phone for now, add it after)
      console.log('👤 Creating demo user...');
      db.run(
        `INSERT OR IGNORE INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, datetime('now', '-5 days'))`,
        ['Demo Lietotājs', 'demo@ecopakalpojumi.lv', demoPassword, 'user']
      );

      // Insert admin user
      console.log('👑 Creating admin user...');
      db.run(
        `INSERT OR IGNORE INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, datetime('now', '-30 days'))`,
        ['Admin', 'admin@ecopakalpojumi.lv', adminPassword, 'admin']
      );

      // Insert test users with varied creation dates
      const testUsers = [
        { name: 'Jānis Bērziņš', email: 'janis@test.eco.lv', days: 0 },  // Today
        { name: 'Anna Kalniņa', email: 'anna@test.eco.lv', days: 1 },   // Yesterday
        { name: 'Māris Ozols', email: 'maris@test.eco.lv', days: 3 },   // This week
        { name: 'Līga Liepiņa', email: 'liga@test.eco.lv', days: 10 },  // This month
        { name: 'Pēteris Zariņš', email: 'peteris@test.eco.lv', days: 45 }, // Last month
        { name: 'Kristīne Bērziņa', email: 'kristine@test.eco.lv', days: 60 }, // 2 months ago
        { name: 'Artūrs Kalniņš', email: 'arturs@test.eco.lv', days: 120 }, // This year
        { name: 'Sandra Ozola', email: 'sandra@test.eco.lv', days: 200 }, // This year
      ];

      console.log('👥 Creating test users...');
      testUsers.forEach((user, index) => {
        db.run(
          `INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, 'user', datetime('now', '-${user.days} days'))`,
          [user.name, user.email, userPasswords[index % userPasswords.length]]
        );
      });

      // Wait for users to be created, then add orders
      setTimeout(() => {
        console.log('📦 Creating test orders...');
        
        // Get all user IDs
        db.all('SELECT id, name FROM users', [], (err, users) => {
          if (err || !users.length) {
            console.error('❌ Error fetching users:', err);
            return;
          }

          const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
          const orders = [
            { userIndex: 0, total: 45.99, status: 'pending', days: 0 },      // Today
            { userIndex: 1, total: 89.50, status: 'processing', days: 0 },   // Today
            { userIndex: 2, total: 125.00, status: 'shipped', days: 1 },     // Yesterday
            { userIndex: 3, total: 67.25, status: 'delivered', days: 2 },    // This week
            { userIndex: 4, total: 234.99, status: 'delivered', days: 5 },   // This week
            { userIndex: 0, total: 55.00, status: 'pending', days: 8 },      // This month
            { userIndex: 1, total: 178.50, status: 'shipped', days: 12 },    // This month
            { userIndex: 2, total: 92.00, status: 'delivered', days: 15 },   // This month
            { userIndex: 3, total: 45.00, status: 'cancelled', days: 20 },   // This month
            { userIndex: 4, total: 310.00, status: 'delivered', days: 35 },  // Last month
            { userIndex: 0, total: 88.75, status: 'delivered', days: 40 },   // Last month
            { userIndex: 1, total: 156.00, status: 'delivered', days: 50 },  // 2 months ago
            { userIndex: 2, total: 220.00, status: 'delivered', days: 90 },  // This year
            { userIndex: 3, total: 75.50, status: 'delivered', days: 150 },  // This year
            { userIndex: 4, total: 445.00, status: 'delivered', days: 200 }, // This year
          ];

          orders.forEach(order => {
            const userId = users[order.userIndex % users.length].id;
            db.run(
              `INSERT INTO orders (user_id, total, status, created_at) VALUES (?, ?, ?, datetime('now', '-${order.days} days'))`,
              [userId, order.total, order.status]
            );
          });

          // Final summary
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
