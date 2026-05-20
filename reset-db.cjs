const sqlite3 = require('sqlite3').verbose();

// Atiestatīt lietotāju tabulu
const db = new sqlite3.Database('./eco_pakalpojumi.db');

console.log('🗑️  RESETTING USERS TABLE...');

db.serialize(() => {
  // Dzēst un atkārtoti izveidot lietotāju tabulu
  db.run(`DROP TABLE IF EXISTS users`, (err) => {
    if (err) {
      console.error('❌ Error dropping users table:', err);
      return;
    }
    console.log('✅ Users table dropped');
  });

  // Atkārtoti izveidot lietotāju tabulu ar pareizo shēmu
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    blocked BOOLEAN DEFAULT 0,
    google_id TEXT
  )`, (err) => {
    if (err) {
      console.error('❌ Error creating users table:', err);
      return;
    }
    console.log('✅ Users table recreated with correct schema');
    console.log('📋 Schema:');
    console.log('  - id (INTEGER, PRIMARY KEY)');
    console.log('  - name (TEXT, NOT NULL)');
    console.log('  - email (TEXT, UNIQUE, NOT NULL)');
    console.log('  - password (TEXT, NOT NULL)');
    console.log('  - role (TEXT DEFAULT \'user\')');
    console.log('  - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)');
    console.log('  - blocked (BOOLEAN DEFAULT 0)');
    console.log('  - google_id (TEXT)');
  });

  // Pārbaudīt tabulas izveidi
  db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) {
      console.error('❌ Error getting table info:', err);
      return;
    }
    console.log('\n🔍 TABLE SCHEMA VERIFICATION:');
    rows.forEach(row => {
      console.log(`  ${row.name}: ${row.type}${row.notnull ? ' NOT NULL' : ''}${row.dflt_value ? ` DEFAULT ${row.dflt_value}` : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
    });

    console.log('\n🎉 DATABASE RESET COMPLETE!');
    console.log('You can now test registration and login.');
    console.log('Check the backend console for debug logs.');

    db.close();
  });
});