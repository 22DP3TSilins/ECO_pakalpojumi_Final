<template>
  <div id="app" :class="theme">
    <Navbar @theme-changed="updateTheme" />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-brand">
          <span class="footer-logo">EP</span>
          <span class="footer-name">Eco Pakalpojumi</span>
        </div>
        <div class="footer-links">
          <router-link to="/products">Products</router-link>
          <router-link to="/forum">Community</router-link>
          <router-link to="/education">Learn</router-link>
        </div>
        <p class="footer-copy">&copy; 2026 Eco Pakalpojumi. Building a sustainable future.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      theme: localStorage.getItem('theme') || 'light'
    }
  },
  watch: {
    '$route'(to, from) {
      // Route changed, component will re-render
    }
  },
  mounted() {
    // Set initial theme
    const currentTheme = localStorage.getItem('theme') || 'light'
    this.theme = currentTheme
    document.documentElement.setAttribute('data-theme', currentTheme)
  },
  methods: {
    updateTheme(newTheme) {
      this.theme = newTheme
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* Professional Color Palette */
  --primary: #0d7c5f;
  --primary-light: #10a37f;
  --primary-dark: #095c47;
  --primary-subtle: rgba(13, 124, 95, 0.08);
  
  --bg-color: #fafafa;
  --bg-secondary: #f5f5f5;
  --text-color: #1a1a1a;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  
  --nav-bg: rgba(255, 255, 255, 0.95);
  --card-bg: #ffffff;
  --border-color: #e5e7eb;
  --border-light: #f3f4f6;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.12);
  
  --radius-sm: 6px;
  --radius: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  --transition: all 0.2s ease;
  --transition-slow: all 0.3s ease;
}

.dark {
  --primary: #10a37f;
  --primary-light: #1ab98f;
  --primary-dark: #0d7c5f;
  --primary-subtle: rgba(16, 163, 127, 0.12);
  
  --bg-color: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --text-color: #f5f5f5;
  --text-secondary: #a1a1a1;
  --text-muted: #737373;
  
  --nav-bg: rgba(15, 15, 15, 0.95);
  --card-bg: #1a1a1a;
  --border-color: #2a2a2a;
  --border-light: #222222;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.4);
  --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.5);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background: var(--bg-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  line-height: 1.6;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-color);
}

h1 { font-size: 2.5rem; letter-spacing: -0.02em; }
h2 { font-size: 1.875rem; letter-spacing: -0.01em; }
h3 { font-size: 1.25rem; }

p {
  color: var(--text-secondary);
}

a {
  color: var(--primary);
  text-decoration: none;
  transition: var(--transition);
}

a:hover {
  color: var(--primary-light);
}

/* Buttons */
button {
  font-family: inherit;
  cursor: pointer;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
}

/* Main Content */
.main-content {
  flex: 1;
}

/* Footer */
.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 48px 0 32px;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.footer-logo {
  width: 40px;
  height: 40px;
  background: var(--primary);
  color: white;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.footer-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.footer-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.footer-links a:hover {
  color: var(--primary);
}

.footer-copy {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* Container utility */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Card utility */
.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: var(--transition);
}

.card:hover {
  box-shadow: var(--shadow);
}

/* Input styles */
input, textarea, select {
  font-family: inherit;
  font-size: 0.95rem;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--card-bg);
  color: var(--text-color);
  transition: var(--transition);
  width: 100%;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-subtle);
}

input::placeholder, textarea::placeholder {
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 768px) {
  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
  
  .footer-links {
    flex-wrap: wrap;
    gap: 16px 24px;
  }
  
  .footer-container {
    padding: 0 16px;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Selection */
::selection {
  background: var(--primary-subtle);
  color: var(--primary-dark);
}
</style>