const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// CORS: atļaut lokālo izstrādi + izvietoto priekšpusi (FRONTEND_URL vides mainīgais)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    // Atļaut pieprasījumus bez izcelsmes (curl, mobilās lietotnes) un jebkuru sarakstā esošu izcelsmi
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());

// Izveidot uploads direktoriju, ja tā neeksistē
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Apkalpot statiskos failus no uploads mapes
app.use('/uploads', express.static(uploadsDir));

// Multer konfigurācija failu augšupielādei
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB ierobežojums
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Autentifikācijas starpprogrammatūra
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Passport iestatīšana Google autentifikācijai
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Šeit jūs atrastu vai izveidotu lietotāju datubāzē
    return done(null, profile);
  }
));

app.use(passport.initialize());

// Google OAuth — pārbaudīt pilnvaru no priekšpuses un izveidot/pieteikt lietotāju
app.post('/api/auth/google', async (req, res) => {
  const { credential, clientId } = req.body;
  
  try {
    // Dekodēt Google JWT pilnvaru (ražošanā pārbaudīt ar Google publiskajām atslēgām)
    const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
    
    const { email, name, sub: googleId, picture } = payload;
    
    // Pārbaudīt, vai lietotājs eksistē
    db.get('SELECT * FROM users WHERE email = ? OR google_id = ?', [email, googleId], (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (existingUser) {
        // Lietotājs eksistē — atjaunināt google_id, ja nepieciešams, un pieteikt
        if (!existingUser.google_id) {
          db.run('UPDATE users SET google_id = ? WHERE id = ?', [googleId, existingUser.id]);
        }
        
        const token = jwt.sign(
          { id: existingUser.id, email: existingUser.email, name: existingUser.name, role: existingUser.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        return res.json({
          token,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role
          }
        });
      } else {
        // Izveidot jaunu lietotāju ar Google kontu
        const randomPassword = Math.random().toString(36).slice(-12) + 'Aa1!';
        bcrypt.hash(randomPassword, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({ error: 'Error creating user' });
          }
          
          db.run(
            'INSERT INTO users (name, email, password, google_id, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, googleId, 'user'],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Error creating user' });
              }
              
              const userId = this.lastID;
              const token = jwt.sign(
                { id: userId, email, name, role: 'user' },
                JWT_SECRET,
                { expiresIn: '7d' }
              );
              
              return res.json({
                token,
                user: { id: userId, email, name, role: 'user' },
                isNewUser: true
              });
            }
          );
        });
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ error: 'Invalid Google token' });
  }
});

// Datubāzes iestatīšana
const dbPath = process.env.DB_PATH || path.join(__dirname, 'eco_pakalpojumi.db');
const db = new sqlite3.Database(dbPath);

// Izveidot tabulas, ja tās neeksistē
db.serialize(() => {
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
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    lifecycle_info TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS user_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    activity TEXT,
    date TEXT,
    impact REAL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    content TEXT,
    category TEXT,
    tags TEXT,
    date TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  // Pievienot kolonnas, ja tās neeksistē (esošajām datubāzēm)
  db.run(`ALTER TABLE posts ADD COLUMN category TEXT`, () => {});
  db.run(`ALTER TABLE posts ADD COLUMN tags TEXT`, () => {});
  db.run(`ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0`, () => {});
  db.run(`CREATE TABLE IF NOT EXISTS post_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(post_id, user_id),
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS post_bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(post_id, user_id),
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    content TEXT,
    date TEXT,
    parent_id INTEGER DEFAULT NULL,
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(parent_id) REFERENCES comments(id)
  )`);
  db.run(`ALTER TABLE comments ADD COLUMN parent_id INTEGER DEFAULT NULL`, () => {});
  db.run(`CREATE TABLE IF NOT EXISTS comment_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(comment_id, user_id),
    FOREIGN KEY(comment_id) REFERENCES comments(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    reward TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS user_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    challenge_id INTEGER,
    completed BOOLEAN DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(challenge_id) REFERENCES challenges(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS education_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    type TEXT,
    date TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    icon TEXT DEFAULT '🔔',
    type TEXT DEFAULT 'info',
    read INTEGER DEFAULT 0,
    link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  // Pievienot phone kolonnu esošajām datubāzēm
  db.run(`ALTER TABLE users ADD COLUMN phone TEXT`, () => {});
});

// Automātiski aizpildīt produktu katalogu palaišanas brīdī (idempotenti — izlaiž jau esošos).
// Noderīgi resursdatoros ar īslaicīgiem diskiem, kur SQLite datubāze tiek dzēsta pārstartēšanā.
try {
  const { seedProducts } = require('./seed-products.cjs');
  // Īsi atlikt, lai pārliecinātos, ka iepriekšējie CREATE TABLE pieprasījumi ir izpildīti
  setTimeout(() => {
    seedProducts(db).catch((e) => console.error('[seed-products] failed:', e));
  }, 500);
} catch (e) {
  console.warn('[seed-products] module not available:', e.message);
}

// Maršruti
// Paroles validācijas funkcija
const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!hasNumbers) {
    return 'Password must contain at least one number';
  }

  return null; // Derīga parole
};

// Vienkāršs atmiņā balstīts ātruma ierobežotājs
const rateLimitStore = new Map();
const rateLimit = (maxRequests, windowMs) => (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const key = `${ip}:${req.path}`;
  const now = Date.now();
  const windowStart = now - windowMs;
  
  let record = rateLimitStore.get(key);
  if (!record) {
    record = [];
    rateLimitStore.set(key, record);
  }
  
  // Noņemt izbeigušās vienības
  while (record.length > 0 && record[0] < windowStart) record.shift();
  
  if (record.length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  
  record.push(now);
  next();
};

// Notīrīt ātruma ierobežojuma krātuvi katras 10 minūtes
setInterval(() => {
  const cutoff = Date.now() - 15 * 60 * 1000;
  for (const [key, timestamps] of rateLimitStore) {
    const filtered = timestamps.filter(t => t > cutoff);
    if (filtered.length === 0) rateLimitStore.delete(key);
    else rateLimitStore.set(key, filtered);
  }
}, 10 * 60 * 1000);

// Pilnvaras atjaunošanas galapunkts
app.post('/api/auth/refresh', authenticateToken, (req, res) => {
  const user = req.user;
  db.get('SELECT id, email, name, role, blocked FROM users WHERE id = ?', [user.id], (err, row) => {
    if (err || !row) return res.status(401).json({ error: 'User not found' });
    if (row.blocked) return res.status(403).json({ error: 'Account is blocked' });
    const token = jwt.sign(
      { id: row.id, email: row.email, name: row.name, role: row.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: row.id, email: row.email, name: row.name, role: row.role } });
  });
});

// Autentifikācija
app.post('/api/auth/register', rateLimit(5, 15 * 60 * 1000), async (req, res) => {
  console.log('🔍 REGISTER REQUEST RECEIVED:', req.body);

  const { name, email, password, phone } = req.body;

  // Pārbaudīt ievadi
  if (!name || !email || !password) {
    console.log('❌ MISSING REQUIRED FIELDS');
    return res.status(400).json({ error: 'Please fill in all required fields: name, email, and password.' });
  }

  // Pārbaudīt vārda garumu
  if (name.trim().length < 2) {
    console.log('❌ NAME TOO SHORT');
    return res.status(400).json({ error: 'Name must be at least 2 characters long' });
  }

  // Pārbaudīt e-pasta formātu
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('❌ INVALID EMAIL FORMAT');
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  // Pārbaudīt paroles stiprumu
  const passwordError = validatePassword(password);
  if (passwordError) {
    console.log('❌ PASSWORD VALIDATION FAILED:', passwordError);
    return res.status(400).json({ error: passwordError });
  }

  console.log('✅ ALL VALIDATIONS PASSED');

  // Pārbaudīt, vai e-pasts eksistē
  db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      console.log('❌ DATABASE ERROR:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (row) {
      console.log('❌ EMAIL ALREADY EXISTS');
      return res.status(400).json({ error: 'An account with this email address already exists. Please use a different email or try logging in instead.' });
    }

    console.log('✅ EMAIL CHECK PASSED');

    try {
      console.log('🔐 HASHING PASSWORD...');
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('✅ PASSWORD HASHED');

      console.log('💾 INSERTING USER INTO DATABASE...');
      db.run('INSERT INTO users (email, password, name, role, created_at, phone) VALUES (?, ?, ?, ?, datetime("now"), ?)',
        [email, hashedPassword, name, 'user', phone || null], function(err) {
        if (err) {
          console.log('❌ DATABASE INSERT ERROR:', err);
          return res.status(500).json({ error: 'Failed to create user' });
        }
        console.log('✅ USER CREATED SUCCESSFULLY, ID:', this.lastID);
        // Izveidot sveiciena paziņojumu
        db.run('INSERT INTO notifications (user_id, message, icon, type) VALUES (?, ?, ?, ?)',
          [this.lastID, 'Welcome to Eco Pakalpojumi! Start exploring eco-friendly products. 🌿', '🎉', 'welcome']);
        res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (error) {
      console.log('❌ BCRYPT ERROR:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  });
});

app.post('/api/auth/login', rateLimit(10, 15 * 60 * 1000), (req, res) => {
  console.log('🔍 LOGIN REQUEST RECEIVED:', req.body);

  const { email, password } = req.body;

  // Pārbaudīt ievadi
  if (!email || !password) {
    console.log('❌ MISSING EMAIL OR PASSWORD');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  console.log('✅ BASIC VALIDATION PASSED');

  db.get('SELECT id, email, password, name, role FROM users WHERE email = ? AND blocked = 0', [email], async (err, user) => {
    if (err) {
      console.log('❌ DATABASE ERROR:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      console.log('❌ USER NOT FOUND FOR EMAIL:', email);
      return res.status(401).json({ error: 'No account found with this email address. Please check your email or register first.' });
    }

    console.log('✅ USER FOUND:', user.email);

    try {
      console.log('🔐 COMPARING PASSWORD...');
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('🔐 PASSWORD COMPARISON RESULT:', isValidPassword);

      if (!isValidPassword) {
        console.log('❌ INVALID PASSWORD');
        return res.status(401).json({ error: 'Incorrect password. Please check your password and try again.' });
      }

      console.log('✅ PASSWORD VALID, GENERATING TOKEN...');

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('✅ TOKEN GENERATED, LOGIN SUCCESSFUL');

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.log('❌ BCRYPT COMPARISON ERROR:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  });
});

// Aizmirsta parole
app.post('/api/auth/forgot-password', rateLimit(3, 15 * 60 * 1000), (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      // Neatklāt, vai e-pasts eksistē
      return res.json({ message: 'If an account with that email exists, a temporary password has been generated. Check your console/logs.' });
    }

    try {
      // Ģenerēt nejaušu pagaidu paroli
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
      let tempPassword = 'Tmp';
      for (let i = 0; i < 8; i++) {
        tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      tempPassword += '1!'; // pārliecināties, ka tā atbilst stipruma prasībām

      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id], function(updateErr) {
        if (updateErr) {
          return res.status(500).json({ error: 'Failed to reset password' });
        }
        // Ražošanā sūtīt e-pastu. Izstrādē reģistrēt žurnālā.
        console.log(`🔑 TEMPORARY PASSWORD for ${email}: ${tempPassword}`);
        res.json({ message: `Password has been reset. Your temporary password is: ${tempPassword}  — Please change it after logging in.` });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Izveidot JWT Google lietotājam
  const token = jwt.sign({ id: req.user.id, email: req.user.emails[0].value, name: req.user.displayName }, JWT_SECRET);
  res.redirect(`http://localhost:5173?token=${token}`);
});

// Produkti
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ products: rows });
  });
});

// Grozs
app.get('/api/cart', authenticateToken, (req, res) => {
  db.all(`
    SELECT cart.id, cart.quantity, cart.product_id,
           products.name, products.price, products.image_url, products.stock
    FROM cart 
    JOIN products ON cart.product_id = products.id 
    WHERE cart.user_id = ?
  `, [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ cart: rows || [] });
  });
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const { product_id, quantity } = req.body;
  const pid = parseInt(product_id);
  const qty = parseInt(quantity);
  if (!pid || pid < 1 || !qty || qty < 1 || qty > 999) {
    return res.status(400).json({ error: 'Invalid product_id or quantity' });
  }
  
  // Pārbaudīt, vai produkts jau ir grozā
  db.get('SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?', [req.user.id, pid], (err, existing) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (existing) {
      // Atjaunināt daudzumu
      db.run('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [qty, existing.id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: existing.id, updated: true });
      });
    } else {
      // Ievietot jaunu
      db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, pid, qty], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID });
      });
    }
  });
});

app.put('/api/cart/:id', authenticateToken, (req, res) => {
  const { quantity } = req.body;
  const qty = parseInt(quantity);
  if (isNaN(qty) || qty > 999) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  if (qty <= 0) {
    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ deleted: true });
    });
  } else {
    db.run('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [qty, req.params.id, req.user.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updated: true });
    });
  }
});

app.delete('/api/cart/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

app.delete('/api/cart', authenticateToken, (req, res) => {
  db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ cleared: this.changes });
  });
});

// Norēķini / izveidot pasūtījumu
app.post('/api/checkout', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { promoCode } = req.body || {};
  
  // Pārbaudīt akcijas kodu servera pusē
  const validPromos = { 'ECO10': 0.1, 'GREEN20': 0.2, 'PLANET15': 0.15 };
  const discountRate = promoCode ? validPromos[promoCode.toUpperCase()] || 0 : 0;
  
  // Iegūt groza vienumus
  db.all(`
    SELECT cart.id, cart.quantity, cart.product_id,
           products.name, products.price, products.stock
    FROM cart 
    JOIN products ON cart.product_id = products.id 
    WHERE cart.user_id = ?
  `, [userId], (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Pārbaudīt krājumus
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${item.name}` });
      }
    }
    
    // Aprēķināt kopsummu ar atlaidi
    let total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = total * discountRate;
    total = Math.round((total - discountAmount) * 100) / 100;
    
    // Izveidot pasūtījumu
    db.run('INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)', [userId, total, 'pending'], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const orderId = this.lastID;
      
      // Ievietot pasūtījuma vienumus
      const insertStmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
      const updateStockStmt = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
      
      for (const item of cartItems) {
        insertStmt.run(orderId, item.product_id, item.quantity, item.price);
        updateStockStmt.run(item.quantity, item.product_id);
      }
      
      insertStmt.finalize();
      updateStockStmt.finalize();
      
      // Notīrīt grozu
      db.run('DELETE FROM cart WHERE user_id = ?', [userId], function(err) {
        if (err) {
          console.error('Error clearing cart:', err);
        }
        // Izveidot pasūtījuma paziņojumu
        db.run('INSERT INTO notifications (user_id, message, icon, type, link) VALUES (?, ?, ?, ?, ?)',
          [userId, `Order #${orderId} placed successfully! Total: €${total.toFixed(2)}`, '🛒', 'order', `/profile`]);
        res.json({ 
          success: true, 
          orderId: orderId, 
          total: total,
          discount: discountAmount || 0,
          message: 'Order placed successfully!' 
        });
      });
    });
  });
});

// Iegūt lietotāja pasūtījumus
app.get('/api/orders', authenticateToken, (req, res) => {
  db.all(`
    SELECT o.*, 
           GROUP_CONCAT(p.name || ' x' || oi.quantity) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ orders: rows || [] });
  });
});

// Oglekļa pēdas nospiedums
app.get('/api/footprint', authenticateToken, (req, res) => {
  db.all('SELECT * FROM user_activities WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ activities: rows });
  });
});

app.post('/api/footprint', authenticateToken, (req, res) => {
  const { activity, impact } = req.body;
  if (!activity || typeof activity !== 'string' || activity.trim().length === 0 || activity.length > 500) {
    return res.status(400).json({ error: 'Activity is required (max 500 chars)' });
  }
  const numImpact = parseFloat(impact);
  if (isNaN(numImpact) || numImpact < 0 || numImpact > 10000) {
    return res.status(400).json({ error: 'Impact must be a number between 0 and 10000' });
  }
  db.run('INSERT INTO user_activities (user_id, activity, date, impact) VALUES (?, ?, datetime("now"), ?)', [req.user.id, activity.trim(), numImpact], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Forums
app.get('/api/posts', (req, res) => {
  // Pārbaudīt, vai lietotājs ir pieteicies, lai iekļautu viņa patīk/grāmatzīmju statusu
  const token = req.headers.authorization?.split(' ')[1];
  let userId = null;
  if (token) {
    try { userId = jwt.verify(token, JWT_SECRET).id; } catch (e) {}
  }

  db.all(`
    SELECT posts.id, posts.title, posts.content, posts.category, posts.tags, posts.date,
    posts.views,
    COALESCE(users.name, 'Deleted user') as name,
    (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) as comment_count,
    (SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.id) as like_count
    FROM posts 
    LEFT JOIN users ON posts.user_id = users.id 
    ORDER BY date DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!userId) {
      return res.json({ posts: rows.map(r => ({ ...r, liked: false, bookmarked: false })) });
    }

    // Iegūt lietotāja patīkamos un grāmatzīmes
    db.all('SELECT post_id FROM post_likes WHERE user_id = ?', [userId], (err2, likes) => {
      const likedSet = new Set((likes || []).map(l => l.post_id));
      db.all('SELECT post_id FROM post_bookmarks WHERE user_id = ?', [userId], (err3, bookmarks) => {
        const bookmarkedSet = new Set((bookmarks || []).map(b => b.post_id));
        const postsWithStatus = rows.map(r => ({
          ...r,
          liked: likedSet.has(r.id),
          bookmarked: bookmarkedSet.has(r.id)
        }));
        res.json({ posts: postsWithStatus });
      });
    });
  });
});

app.post('/api/posts', (req, res) => {
  const { title, content, category, tags } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!title || typeof title !== 'string' || title.trim().length === 0 || title.length > 500) {
      return res.status(400).json({ error: 'Title is required (max 500 chars)' });
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0 || content.length > 50000) {
      return res.status(400).json({ error: 'Content is required (max 50000 chars)' });
    }
    db.run('INSERT INTO posts (user_id, title, content, category, tags, date) VALUES (?, ?, ?, ?, ?, datetime("now"))', 
      [decoded.id, title.trim(), content.trim(), category || '', tags || ''], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Reģistrēt skatījumu, atverot ierakstu
app.post('/api/posts/:id/view', (req, res) => {
  db.run('UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT views FROM posts WHERE id = ?', [req.params.id], (err2, row) => {
      res.json({ views: row?.views || 0 });
    });
  });
});

// Patīk / atcelt patīk ierakstam
app.post('/api/posts/:id/like', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const postId = req.params.id;
    const userId = decoded.id;

    // Pārbaudīt, vai jau atzīmēts kā patīk
    db.get('SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row) {
        // Atcelt patīk
        db.run('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId], function(err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          db.get('SELECT COUNT(*) as count FROM post_likes WHERE post_id = ?', [postId], (err3, countRow) => {
            res.json({ liked: false, like_count: countRow?.count || 0 });
          });
        });
      } else {
        // Patīk
        db.run('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId], function(err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          db.get('SELECT COUNT(*) as count FROM post_likes WHERE post_id = ?', [postId], (err3, countRow) => {
            res.json({ liked: true, like_count: countRow?.count || 0 });
          });
        });
      }
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Pievienot/noņemt grāmatzīmi ierakstam
app.post('/api/posts/:id/bookmark', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const postId = req.params.id;
    const userId = decoded.id;

    db.get('SELECT id FROM post_bookmarks WHERE post_id = ? AND user_id = ?', [postId, userId], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row) {
        db.run('DELETE FROM post_bookmarks WHERE post_id = ? AND user_id = ?', [postId, userId], function(err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ bookmarked: false });
        });
      } else {
        db.run('INSERT INTO post_bookmarks (post_id, user_id) VALUES (?, ?)', [postId, userId], function(err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ bookmarked: true });
        });
      }
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/posts/:id/comments', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  let userId = null;
  if (token) {
    try { userId = jwt.verify(token, JWT_SECRET).id; } catch (e) {}
  }

  db.all(`
    SELECT comments.*, users.name,
    (SELECT COUNT(*) FROM comment_likes WHERE comment_likes.comment_id = comments.id) as like_count
    FROM comments 
    JOIN users ON comments.user_id = users.id 
    WHERE comments.post_id = ? 
    ORDER BY comments.date ASC
  `, [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!userId) {
      return res.json({ comments: rows.map(r => ({ ...r, liked: false })) });
    }

    db.all('SELECT comment_id FROM comment_likes WHERE user_id = ?', [userId], (err2, likes) => {
      const likedSet = new Set((likes || []).map(l => l.comment_id));
      const commentsWithStatus = rows.map(r => ({
        ...r,
        liked: likedSet.has(r.id)
      }));
      res.json({ comments: commentsWithStatus });
    });
  });
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { content, parent_id } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!content || typeof content !== 'string' || content.trim().length === 0 || content.length > 10000) {
      return res.status(400).json({ error: 'Comment content is required (max 10000 chars)' });
    }
    db.run('INSERT INTO comments (post_id, user_id, content, date, parent_id) VALUES (?, ?, ?, datetime("now"), ?)', 
      [req.params.id, decoded.id, content.trim(), parent_id || null], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Patīk / atcelt patīk komentāram
app.post('/api/comments/:id/like', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const commentId = req.params.id;
    const userId = decoded.id;

    db.get('SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row) {
        db.run('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId], function(err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          db.get('SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = ?', [commentId], (err3, countRow) => {
            res.json({ liked: false, like_count: countRow?.count || 0 });
          });
        });
      } else {
        db.run('INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)', [commentId, userId], function(err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          db.get('SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = ?', [commentId], (err3, countRow) => {
            res.json({ liked: true, like_count: countRow?.count || 0 });
          });
        });
      }
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Administrators: dzēst ierakstu
app.delete('/api/admin/posts/:id', authenticateToken, requireAdmin, (req, res) => {
  const postId = req.params.id;
  // Vispirms dzēst saistītos datus (komentārus, patīk, grāmatzīmes)
  db.run('DELETE FROM comments WHERE post_id = ?', [postId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.run('DELETE FROM post_likes WHERE post_id = ?', [postId], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      db.run('DELETE FROM post_bookmarks WHERE post_id = ?', [postId], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        // Visbeidzot dzēst ierakstu
        db.run('DELETE FROM posts WHERE id = ?', [postId], function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Post not found' });
          }
          res.json({ message: 'Post deleted' });
        });
      });
    });
  });
});

// Izaicinājumi
app.get('/api/challenges', (req, res) => {
  db.all('SELECT * FROM challenges', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ challenges: rows });
  });
});

app.post('/api/user-challenges', (req, res) => {
  const { challenge_id } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.run('INSERT INTO user_challenges (user_id, challenge_id, completed) VALUES (?, ?, 1)', [decoded.id, challenge_id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Izglītība
app.put('/api/user', (req, res) => {
  const { name, password } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let updateFields = [];
    let values = [];
    if (name) {
      updateFields.push('name = ?');
      values.push(name);
    }
    if (password) {
      const passwordError = validatePassword(password);
      if (passwordError) return res.status(400).json({ error: passwordError });
      const hashedPassword = bcrypt.hashSync(password, 10);
      updateFields.push('password = ?');
      values.push(hashedPassword);
    }
    if (updateFields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(decoded.id);
    db.run(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, values, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      // Atkārtoti izsniegt JWT, lai klients uzreiz uztvertu jauno vārdu
      db.get('SELECT id, email, name, role FROM users WHERE id = ?', [decoded.id], (e, row) => {
        if (e || !row) return res.json({ message: 'Profile updated' });
        const newToken = jwt.sign(
          { id: row.id, email: row.email, name: row.name, role: row.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        res.json({
          message: 'Profile updated',
          token: newToken,
          user: { id: row.id, email: row.email, name: row.name, role: row.role }
        });
      });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.delete('/api/user', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.run('DELETE FROM users WHERE id = ?', [decoded.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Account deleted' });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Administratora maršruti
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT id, name, email, role, blocked, created_at FROM users ORDER BY id ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/api/admin/users/:id/block', authenticateToken, requireAdmin, (req, res) => {
  const { blocked } = req.body;
  db.run('UPDATE users SET blocked = ? WHERE id = ?', [blocked ? 1 : 0, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User updated' });
  });
});

app.put('/api/admin/users/:id/role', authenticateToken, requireAdmin, (req, res) => {
  const { role } = req.body;
  const allowedRoles = ['admin', 'user'];
  if (!role || !allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Allowed: ' + allowedRoles.join(', ') });
  }
  db.run('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User role updated' });
  });
});

// Dzēst lietotāju (tikai administrators)
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.id;
  // Neļaut izdzēst sevi
  if (parseInt(userId) === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account from admin panel' });
  }
  db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  });
});

app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => {
  db.all(`
    SELECT o.*, u.name as user_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Allowed: ' + allowedStatuses.join(', ') });
  }
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Order status updated' });
  });
});

app.delete('/api/admin/orders/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM orders WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Order deleted' });
  });
});

// Izglītības ierakstu galapunkts
app.get('/api/education', (req, res) => {
  db.all('SELECT * FROM education_posts ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Attēla augšupielādes galapunkts
app.post('/api/upload', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ url: imageUrl, filename: req.file.filename });
});

// Produktu CRUD administratoram
app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, category, stock, image_url, lifecycle_info } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 500) {
    return res.status(400).json({ error: 'Product name is required (max 500 chars)' });
  }
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return res.status(400).json({ error: 'Price must be a non-negative number' });
  }
  const numStock = parseInt(stock) || 0;
  if (numStock < 0) {
    return res.status(400).json({ error: 'Stock must be non-negative' });
  }
  db.run(
    'INSERT INTO products (name, description, price, category, stock, image_url, lifecycle_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name.trim(), description || '', numPrice, category || '', numStock, image_url || '', lifecycle_info || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, category, stock, image_url, lifecycle_info } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 500) {
    return res.status(400).json({ error: 'Product name is required (max 500 chars)' });
  }
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return res.status(400).json({ error: 'Price must be a non-negative number' });
  }
  const numStock = parseInt(stock) || 0;
  if (numStock < 0) {
    return res.status(400).json({ error: 'Stock must be non-negative' });
  }
  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, image_url = ?, lifecycle_info = ? WHERE id = ?',
    [name.trim(), description || '', numPrice, category || '', numStock, image_url || '', lifecycle_info || '', req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Product updated' });
    }
  );
});

app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product deleted' });
  });
});

// Iegūt lietotāja statistiku
app.get('/api/user/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  // Iegūt dažādu lietotāja statistiku
  const queries = {
    // Kopējais pasūtījumu skaits
    ordersCount: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM orders WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Pabeigto izaicinājumu skaits
    challengesCompleted: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user_challenges WHERE user_id = ? AND completed = 1', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Kopējais pievienoto izaicinājumu skaits
    challengesJoined: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user_challenges WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Kopējais reģistrēto aktivitāšu skaits
    activitiesCount: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user_activities WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Kopējais CO2 ietekmējums no aktivitātēm
    totalCo2Saved: new Promise((resolve, reject) => {
      db.get('SELECT COALESCE(SUM(impact), 0) as total FROM user_activities WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.total || 0);
      });
    }),
    // Groza vienumu skaits
    cartCount: new Promise((resolve, reject) => {
      db.get('SELECT COALESCE(SUM(quantity), 0) as count FROM cart WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Foruma ierakstu skaits
    postsCount: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM posts WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Nesenās aktivitātes
    recentActivities: new Promise((resolve, reject) => {
      db.all('SELECT * FROM user_activities WHERE user_id = ? ORDER BY date DESC LIMIT 5', [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    }),
    // Lietotāja izveides datums
    userCreatedAt: new Promise((resolve, reject) => {
      db.get('SELECT created_at FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.created_at || null);
      });
    }),
    // Kopējā iztērētā nauda
    totalSpent: new Promise((resolve, reject) => {
      db.get('SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.total || 0);
      });
    })
  };
  
  Promise.all(Object.values(queries))
    .then(results => {
      const keys = Object.keys(queries);
      const stats = {};
      keys.forEach((key, index) => {
        stats[key] = results[index];
      });
      
      // Aprēķināt eko punktus, balstoties uz aktivitātēm
      // 10 punkti par aktivitāti + 50 punkti par pabeigtu izaicinājumu + 5 punkti par pasūtījumu
      stats.ecoPoints = (stats.activitiesCount * 10) + (stats.challengesCompleted * 50) + (stats.ordersCount * 5);
      
      // Aprēķināt sēriju (secīgas dienas ar aktivitātēm)
      stats.streak = calculateStreak(stats.recentActivities);
      
      // Aprēķināt līmeni, balstoties uz eko punktiem
      stats.level = Math.floor(stats.ecoPoints / 100) + 1;
      stats.currentXP = stats.ecoPoints % 100;
      stats.nextLevelXP = 100;
      
      res.json(stats);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Palīgfunkcija sērijas aprēķināšanai
function calculateStreak(activities) {
  if (!activities || activities.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Iegūt unikālos datumus
  const dates = [...new Set(activities.map(a => {
    const d = new Date(a.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }))].sort((a, b) => b - a);
  
  if (dates.length === 0) return 0;
  
  // Pārbaudīt, vai pēdējā aktivitāte ir šodien vai vakar
  const mostRecent = dates[0];
  const diffDays = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) return 0; // Sērija pārtraukta
  
  streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = Math.floor((dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Iegūt globālo vietnes statistiku (publiska)
app.get('/api/stats/global', (req, res) => {
  const queries = {
    totalUsers: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    totalCo2Saved: new Promise((resolve, reject) => {
      db.get('SELECT COALESCE(SUM(impact), 0) as total FROM user_activities', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.total || 0);
      });
    }),
    totalProducts: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    totalOrders: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM orders', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    totalForumPosts: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM posts', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    totalActivities: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user_activities', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    totalChallengesCompleted: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user_challenges WHERE completed = 1', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    })
  };
  
  Promise.all(Object.values(queries))
    .then(results => {
      const keys = Object.keys(queries);
      const stats = {};
      keys.forEach((key, index) => {
        stats[key] = results[index];
      });
      
      // Aprēķināt iestādīto koku ekvivalentu (1 koks absorbē ~21 kg CO2 gadā, tāpēc novērtējam 1 koku uz 20 kg ietaupītā CO2)
      stats.treesPlanted = Math.floor(stats.totalCo2Saved / 20);
      
      res.json(stats);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Paziņojumu API
app.get('/api/notifications', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30',
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

app.put('/api/notifications/read-all', authenticateToken, (req, res) => {
  db.run('UPDATE notifications SET read = 1 WHERE user_id = ?', [req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  db.run('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  Port ${port} is already in use.`);
    console.error(`  Kill the other process first, or set a different port:\n`);
    console.error(`    Windows:  netstat -ano | findstr :${port}`);
    console.error(`              taskkill /PID <PID> /F\n`);
    console.error(`    Mac/Linux: lsof -i :${port}`);
    console.error(`               kill -9 <PID>\n`);
    process.exit(1);
  }
  throw err;
});