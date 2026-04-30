<template>
  <div id="app" :class="theme">
    <Navbar v-if="!isAdminRoute" @theme-changed="updateTheme" />
    <main class="main-content" :class="{ 'admin-main': isAdminRoute }">
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <footer v-if="!isAdminRoute" class="app-footer">
      <div class="footer-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z" />
        </svg>
      </div>
      <div class="footer-container">
        <div class="footer-grid">
          <div class="footer-brand-col">
            <div class="footer-brand">
              <span class="footer-logo">
                <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
                  <path d="M16 2C9 2 4 8 4 14c0 4 2 7.5 5 9.5C11 25 13.5 28 16 30c2.5-2 5-5 7-6.5 3-2 5-5.5 5-9.5 0-6-5-12-12-12z" fill="currentColor" opacity="0.15"/>
                  <path d="M16 6c-2 0-6 3-6 8s3 8 6 10c3-2 6-5 6-10s-4-8-6-8z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                  <path d="M16 10v10M12 14c2 2 6 2 8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
              <span class="footer-name">Eco Pakalpojumi</span>
            </div>
            <p class="footer-desc">Building a sustainable future, one step at a time. Join our community of eco-conscious individuals.</p>
          </div>
          <div class="footer-links-col">
            <h4 class="footer-heading">Explore</h4>
            <div class="footer-links">
              <router-link to="/products">Products</router-link>
              <router-link to="/footprint">Footprint</router-link>
              <router-link to="/challenges">Challenges</router-link>
            </div>
          </div>
          <div class="footer-links-col">
            <h4 class="footer-heading">Community</h4>
            <div class="footer-links">
              <router-link to="/forum">Forum</router-link>
              <router-link to="/education">Learn</router-link>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-copy">&copy; 2026 Eco Pakalpojumi. Building a sustainable future.</p>
          <div class="footer-eco-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <span>Eco-friendly by design</span>
          </div>
        </div>
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
      theme: localStorage.getItem('theme') || 'light',
      transitionName: 'page-fade'
    }
  },
  computed: {
    isAdminRoute() {
      return this.$route.path === '/admin'
    }
  },
  watch: {
    '$route'(to, from) {
      // Use special transition for admin page
      if (to.path === '/admin' || from.path === '/admin') {
        this.transitionName = 'admin-transition'
        return
      }
      // Determine transition direction
      const routeOrder = ['/', '/products', '/footprint', '/challenges', '/forum', '/education', '/profile', '/admin']
      const toIndex = routeOrder.indexOf(to.path)
      const fromIndex = routeOrder.indexOf(from.path)
      this.transitionName = toIndex > fromIndex ? 'page-slide-left' : 'page-slide-right'
    }
  },
  mounted() {
    const currentTheme = localStorage.getItem('theme') || 'light'
    this.theme = currentTheme
    document.documentElement.setAttribute('data-theme', currentTheme)

    // Scroll-reveal observer
    this.setupScrollReveal()
  },
  methods: {
    updateTheme(newTheme) {
      this.theme = newTheme
    },
    setupScrollReveal() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

      const observeNewElements = () => {
        document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
          observer.observe(el)
        })
      }

      // Observe elements after initial render + transition settle
      this.$nextTick(() => {
        observeNewElements()
        // Fallback for transition-delayed mounts
        setTimeout(observeNewElements, 400)
      })

      // Re-observe on route change (after transition completes)
      this.$watch('$route', () => {
        this.$nextTick(() => {
          setTimeout(observeNewElements, 100)
          setTimeout(observeNewElements, 450)
        })
      })

      // Watch for dynamically added .reveal elements
      const mutationObserver = new MutationObserver(() => {
        observeNewElements()
      })
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  /* Eco Color Palette */
  --primary: #0d7c5f;
  --primary-light: #10a37f;
  --primary-dark: #095c47;
  --primary-subtle: rgba(13, 124, 95, 0.08);
  
  --accent: #34d399;
  --accent-warm: #f59e0b;
  --accent-earth: #92400e;
  
  --gradient-eco: linear-gradient(135deg, #0d7c5f 0%, #10a37f 50%, #34d399 100%);
  --gradient-hero: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 25%, #f0fdf4 50%, #dcfce7 100%);
  --gradient-hero-dark: linear-gradient(135deg, #0a1f1a 0%, #0f2922 25%, #0d1f18 50%, #112e24 100%);
  --gradient-card: linear-gradient(145deg, var(--card-bg) 0%, rgba(13, 124, 95, 0.02) 100%);
  
  --bg-color: #fafbfc;
  --bg-secondary: #f0f4f3;
  --text-color: #1a1a1a;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  
  --nav-bg: rgba(255, 255, 255, 0.85);
  --card-bg: #ffffff;
  --border-color: #e5e7eb;
  --border-light: #f3f4f6;
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 12px 40px rgba(13, 124, 95, 0.12);
  --shadow-glow: 0 0 40px rgba(13, 124, 95, 0.15);
  
  --radius-sm: 8px;
  --radius: 12px;
  --radius-md: 14px;
  --radius-lg: 18px;
  --radius-xl: 28px;
  --radius-full: 9999px;
  
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dark {
  --primary: #10a37f;
  --primary-light: #1ab98f;
  --primary-dark: #0d7c5f;
  --primary-subtle: rgba(16, 163, 127, 0.12);
  
  --accent: #34d399;
  --gradient-hero: var(--gradient-hero-dark);
  --gradient-card: linear-gradient(145deg, var(--card-bg) 0%, rgba(16, 163, 127, 0.04) 100%);
  
  --bg-color: #0c0f0e;
  --bg-secondary: #151a18;
  --text-color: #f5f5f5;
  --text-secondary: #a1a1a1;
  --text-muted: #737373;
  
  --nav-bg: rgba(12, 15, 14, 0.88);
  --card-bg: #1a1f1d;
  --border-color: #2a2f2d;
  --border-light: #222725;
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.45);
  --shadow-hover: 0 12px 40px rgba(16, 163, 127, 0.15);
  --shadow-glow: 0 0 40px rgba(16, 163, 127, 0.12);
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
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-color);
  letter-spacing: -0.02em;
}

h1 { font-size: 2.75rem; }
h2 { font-size: 2rem; }
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
  font-weight: 600;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.12) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn:hover::after {
  opacity: 1;
}

.btn-primary {
  background: var(--gradient-eco);
  color: white;
  box-shadow: 0 2px 10px rgba(13, 124, 95, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 124, 95, 0.35);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
  transform: translateY(-1px);
}

/* Main Content */
.main-content {
  flex: 1;
}

.main-content.admin-main {
  padding: 0;
}

/* Admin Page Transition */
.admin-transition-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.admin-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.admin-transition-enter-from {
  opacity: 0;
  transform: scale(0.97);
  filter: blur(4px);
}
.admin-transition-leave-to {
  opacity: 0;
  transform: scale(1.02);
  filter: blur(2px);
}

/* Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.page-slide-left-enter-active,
.page-slide-left-leave-active,
.page-slide-right-enter-active,
.page-slide-right-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.page-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.page-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.page-slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Scroll Reveal System */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }

.reveal-scale {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-scale.revealed {
  opacity: 1;
  transform: scale(1);
}

/* Footer */
.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  position: relative;
  overflow: hidden;
}

.footer-wave {
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 60px;
  overflow: hidden;
}

.footer-wave svg {
  width: 100%;
  height: 100%;
  fill: var(--bg-color);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px 32px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

.footer-brand-col {
  max-width: 320px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-logo {
  width: 44px;
  height: 44px;
  background: var(--gradient-eco);
  color: white;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.footer-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-color);
}

.footer-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.footer-heading {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-color);
  margin-bottom: 16px;
}

.footer-links-col .footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.footer-links a:hover {
  color: var(--primary);
  transform: translateX(4px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.footer-copy {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.footer-eco-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 500;
}

/* Container utility */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Card utility */
.card {
  background: var(--gradient-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: var(--transition);
}

.card:hover {
  box-shadow: var(--shadow);
  border-color: rgba(13, 124, 95, 0.2);
}

/* Input styles */
input, textarea, select {
  font-family: inherit;
  font-size: 0.95rem;
  padding: 12px 16px;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--card-bg);
  color: var(--text-color);
  transition: var(--transition);
  width: 100%;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-subtle);
}

input::placeholder, textarea::placeholder {
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 768px) {
  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
  
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .footer-brand-col {
    max-width: none;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .footer-container {
    padding: 60px 16px 24px;
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
  background: rgba(13, 124, 95, 0.15);
  color: var(--primary-dark);
}

/* Floating eco-particles (optional decoration) */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(13, 124, 95, 0.1); }
  50% { box-shadow: 0 0 40px rgba(13, 124, 95, 0.25); }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>