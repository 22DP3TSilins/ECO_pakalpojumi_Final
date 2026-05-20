const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./eco_pakalpojumi.db');

async function resetAndSeedDatabase() {
  console.log('🔧 RESETTING DATABASE AND CREATING TEST USERS...\n');

  try {
    // Dzēst esošo lietotāju tabulu
    db.run(`DROP TABLE IF EXISTS users`, async (err) => {
      if (err) {
        console.error('❌ Error dropping users table:', err);
        return;
      }
      console.log('✅ Users table dropped');

      // Atkārtoti izveidot lietotāju tabulu
      db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        blocked BOOLEAN DEFAULT 0,
        google_id TEXT
      )`, async (err) => {
        if (err) {
          console.error('❌ Error creating users table:', err);
          return;
        }
        console.log('✅ Users table recreated');

        // Šifrēt paroles testa lietotājiem
        const demoUserPassword = await bcrypt.hash('Demo123!', 10);
        const testUserPassword = await bcrypt.hash('TestPass123', 10);
        const adminUserPassword = await bcrypt.hash('AdminPass123', 10);

        // Ievietot demonstrācijas lietotāju (pieteikšanās lapas demo)
        db.run(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Demo Lietotājs', 'demo@ecopakalpojumi.lv', demoUserPassword, 'user'],
          function(err) {
            if (err) {
              console.error('❌ Error creating demo user:', err);
              return;
            }
            console.log('✅ Demo user created:');
            console.log('   Email: demo@ecopakalpojumi.lv');
            console.log('   Password: Demo123!');
            console.log('   Role: user');

            // Ievietot testa lietotāju
            db.run(
              'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
              ['Test User', 'test@example.com', testUserPassword, 'user'],
              function(err) {
                if (err) {
                  console.error('❌ Error creating test user:', err);
                  return;
                }
                console.log('✅ Test user created:');
                console.log('   Email: test@example.com');
                console.log('   Password: TestPass123');
                console.log('   Role: user');

                // Ievietot administratora lietotāju
                db.run(
                  'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                  ['Admin User', 'admin@ecopakalpojumi.lv', adminUserPassword, 'admin'],
                  function(err) {
                    if (err) {
                      console.error('❌ Error creating admin user:', err);
                      return;
                    }
                    console.log('✅ Admin user created:');
                    console.log('   Email: admin@ecopakalpojumi.lv');
                    console.log('   Password: AdminPass123');
                    console.log('   Role: admin');

                    // Pārbaudīt, vai lietotāji tika izveidoti
                    db.all('SELECT id, name, email, role FROM users', (err, rows) => {
                      if (err) {
                        console.error('❌ Error fetching users:', err);
                        return;
                      }
                      console.log('\n📋 DATABASE SUMMARY:');
                      console.log(`Total users: ${rows.length}`);
                      rows.forEach((user, index) => {
                        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
                      });

                      console.log('\n🎉 DATABASE RESET COMPLETE!');
                      console.log('\n📝 LOGIN CREDENTIALS:');
                      console.log('─────────────────────────────────────');
                      console.log('Demo User (shown on login page):');
                      console.log('  Email: demo@ecopakalpojumi.lv');
                      console.log('  Password: Demo123!');
                      console.log('─────────────────────────────────────');
                      console.log('Test User:');
                      console.log('  Email: test@example.com');
                      console.log('  Password: TestPass123');
                      console.log('─────────────────────────────────────');
                      console.log('Admin User:');
                      console.log('  Email: admin@ecopakalpojumi.lv');
                      console.log('  Password: AdminPass123');
                      console.log('─────────────────────────────────────\n');

                      db.close();
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  } catch (error) {
    console.error('❌ Error:', error);
    db.close();
  }
}

resetAndSeedDatabase();