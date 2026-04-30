<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <!-- Organic decorative shapes -->
      <div class="hero-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="hero-content">
        <span class="hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C9 2 4 7 4 14c0 4 3 8 8 8s8-4 8-8c0-7-5-12-8-12z"/><path d="M12 6v10M9 12c1.5 2 4.5 2 6 0"/></svg>
          {{ t('home.heroTitle') }}
        </span>
        <h1>
          <span class="hero-title-line">Eco</span>
          <span class="hero-title-line accent">Pakalpojumi</span>
        </h1>
        <p class="hero-subtitle">
          {{ t('home.heroSubtitle') }}
        </p>
        <div class="hero-actions">
          <router-link to="/products" class="hero-btn primary">
            {{ t('home.shopProducts') }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </router-link>
          <router-link to="/footprint?tab=calculator" class="hero-btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/></svg>
            {{ t('home.calculateFootprint') }}
          </router-link>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-value">{{ animatedUsers }}+</span>
            <span class="stat-text">{{ t('home.activeUsers') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="hero-stat">
            <span class="stat-value">{{ animatedCo2 }}</span>
            <span class="stat-text">{{ t('home.co2Saved') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="hero-stat">
            <span class="stat-value">{{ animatedTrees }}</span>
            <span class="stat-text">{{ t('home.treesPlanted') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <div class="section-header reveal">
        <span class="section-badge">Features</span>
        <h2>{{ t('home.whyChooseUs') }}</h2>
        <p>{{ t('home.joinThousands') }}</p>
      </div>
      <div class="features-grid">
        <router-link to="/products" class="feature-card reveal reveal-delay-1">
          <div class="feature-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <h3>{{ t('home.sustainableProducts') }}</h3>
          <p>{{ t('home.sustainableProductsDesc') }}</p>
          <span class="feature-link">
            {{ t('home.browseProducts') }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </span>
        </router-link>

        <router-link to="/footprint?tab=calculator" class="feature-card reveal reveal-delay-2">
          <div class="feature-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
          </div>
          <h3>{{ t('home.carbonCalculator') }}</h3>
          <p>{{ t('home.carbonCalculatorDesc') }}</p>
          <span class="feature-link">
            {{ t('home.tryCalculator') }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </span>
        </router-link>

        <router-link to="/forum" class="feature-card reveal reveal-delay-3">
          <div class="feature-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3>{{ t('home.communityForum') }}</h3>
          <p>{{ t('home.communityForumDesc') }}</p>
          <span class="feature-link">
            {{ t('home.joinDiscussion') }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </span>
        </router-link>

        <router-link to="/footprint" class="feature-card reveal reveal-delay-4">
          <div class="feature-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <h3>{{ t('home.footprintTracker') }}</h3>
          <p>{{ t('home.footprintTrackerDesc') }}</p>
          <span class="feature-link">
            {{ t('home.trackProgress') }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </span>
        </router-link>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="how-section">
      <div class="section-header reveal">
        <span class="section-badge">Process</span>
        <h2>{{ t('home.howItWorks') }}</h2>
        <p>{{ t('home.howItWorksSubtitle') }}</p>
      </div>
      <div class="steps-grid">
        <div class="step-card reveal reveal-delay-1">
          <div class="step-number">1</div>
          <div class="step-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/></svg>
          </div>
          <h3>{{ t('home.stepCalculate') }}</h3>
          <p>{{ t('home.stepCalculateDesc') }}</p>
        </div>
        <div class="step-connector reveal reveal-delay-1">
          <svg width="40" height="24" viewBox="0 0 40 24"><path d="M0 12h32m-6-6 6 6-6 6" stroke="var(--primary)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </div>
        <div class="step-card reveal reveal-delay-2">
          <div class="step-number">2</div>
          <div class="step-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C9 2 4 7 4 14c0 4 3 8 8 8s8-4 8-8c0-7-5-12-8-12z"/><path d="M12 6v10"/></svg>
          </div>
          <h3>{{ t('home.stepTakeAction') }}</h3>
          <p>{{ t('home.stepTakeActionDesc') }}</p>
        </div>
        <div class="step-connector reveal reveal-delay-2">
          <svg width="40" height="24" viewBox="0 0 40 24"><path d="M0 12h32m-6-6 6 6-6 6" stroke="var(--primary)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
        </div>
        <div class="step-card reveal reveal-delay-3">
          <div class="step-number">3</div>
          <div class="step-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h3>{{ t('home.stepTrackProgress') }}</h3>
          <p>{{ t('home.stepTrackProgressDesc') }}</p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="cta-section reveal">
      <div class="cta-glow"></div>
      <div class="cta-content">
        <svg class="cta-leaf" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.5"><path d="M12 2C9 2 4 7 4 14c0 4 3 8 8 8s8-4 8-8c0-7-5-12-8-12z"/><path d="M12 6v10M9 12c1.5 2 4.5 2 6 0"/></svg>
        <h2>{{ t('home.readyToMakeDifference') }}</h2>
        <p>{{ t('home.ctaSubtitle') }}</p>
        <div class="cta-actions">
          <router-link to="/register" class="cta-btn primary">
            {{ t('home.getStartedFree') }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </router-link>
          <router-link to="/education" class="cta-btn secondary">
            {{ t('home.learnMore') }}
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import api from '../utils/api.js'

export default {
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      globalStats: {
        totalUsers: 0,
        totalCo2Saved: 0,
        treesPlanted: 0,
        totalActivities: 0
      },
      displayedUsers: 0,
      displayedCo2: 0,
      displayedTrees: 0
    }
  },
  computed: {
    animatedUsers() {
      return this.formatNumber(this.displayedUsers)
    },
    animatedCo2() {
      return this.formatNumber(this.displayedCo2)
    },
    animatedTrees() {
      return this.formatNumber(this.displayedTrees)
    }
  },
  async mounted() {
    try {
      const { data } = await api.get('/api/stats/global')
      this.globalStats = data
      this.animateCounters()
    } catch (error) {
      console.error('Error fetching global stats:', error)
    }
  },
  methods: {
    formatNumber(num) {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    },
    animateCounters() {
      const duration = 1500
      const steps = 40
      const interval = duration / steps

      const targets = {
        users: this.globalStats.totalUsers,
        co2: this.globalStats.totalCo2Saved,
        trees: this.globalStats.treesPlanted
      }

      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = this.easeOutCubic(step / steps)
        this.displayedUsers = Math.round(targets.users * progress)
        this.displayedCo2 = Math.round(targets.co2 * progress)
        this.displayedTrees = Math.round(targets.trees * progress)
        if (step >= steps) clearInterval(timer)
      }, interval)
    },
    easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3)
    }
  }
}
</script>

<style scoped>
.home-page {
  background: var(--bg-color);
  overflow: hidden;
}

/* ===== Hero Section ===== */
.hero-section {
  padding: 130px 24px 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-hero);
  position: relative;
  overflow: hidden;
}

/* Organic floating shapes */
.hero-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(13, 124, 95, 0.12) 0%, transparent 70%);
  top: -100px;
  right: -80px;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, transparent 70%);
  bottom: -60px;
  left: -60px;
  animation: float 10s ease-in-out infinite reverse;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(16, 163, 127, 0.08) 0%, transparent 70%);
  top: 30%;
  left: 15%;
  animation: float 12s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
}

.hero-content {
  max-width: 680px;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: heroFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes heroFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 28px;
  border: 1px solid rgba(13, 124, 95, 0.12);
  backdrop-filter: blur(10px);
}

.hero-content h1 {
  font-size: 4rem;
  font-weight: 800;
  margin: 0 0 20px;
  letter-spacing: -0.04em;
  line-height: 1.05;
}

.hero-title-line {
  display: block;
  color: var(--text-color);
}

.hero-title-line.accent {
  background: var(--gradient-eco);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 56px;
}

.hero-btn {
  padding: 13px 26px;
  border-radius: var(--radius);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.hero-btn.primary {
  background: var(--gradient-eco);
  color: white;
  box-shadow: 0 4px 16px rgba(13, 124, 95, 0.3);
}

.hero-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(13, 124, 95, 0.4);
}

.hero-btn.secondary {
  background: var(--card-bg);
  color: var(--text-color);
  border: 1.5px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.hero-btn.secondary:hover {
  border-color: var(--primary);
  background: var(--primary-subtle);
  color: var(--primary);
  transform: translateY(-2px);
}

/* Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 36px;
  flex-wrap: wrap;
  padding: 24px 32px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  max-width: 520px;
  margin: 0 auto;
}

.hero-stat {
  text-align: center;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border-color);
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  background: var(--gradient-eco);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.stat-text {
  font-size: 0.82rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-top: 2px;
}

/* ===== Section Styles ===== */
.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.section-badge {
  display: inline-block;
  padding: 5px 14px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-color);
  margin: 0 0 10px;
  letter-spacing: -0.03em;
}

.section-header p {
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin: 0;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

/* ===== Features Section ===== */
.features-section {
  padding: 100px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.feature-card {
  background: var(--gradient-card);
  padding: 32px 28px;
  border-radius: var(--radius-lg);
  text-decoration: none;
  border: 1px solid var(--border-color);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-eco);
  transform: scaleX(0);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(13, 124, 95, 0.2);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(-3deg);
}

.feature-icon.green {
  background: rgba(13, 124, 95, 0.1);
  color: #0d7c5f;
}

.feature-icon.blue {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.feature-icon.purple {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.feature-icon.amber {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
}

.feature-card h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 700;
}

.feature-card p {
  margin: 0 0 16px;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.9rem;
}

.feature-link {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.25s ease;
}

.feature-card:hover .feature-link {
  gap: 10px;
}

/* ===== How It Works ===== */
.how-section {
  padding: 100px 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.steps-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.step-connector {
  display: flex;
  align-items: center;
  padding: 0 8px;
  opacity: 0.5;
}

.step-card {
  background: var(--gradient-card);
  padding: 32px 28px;
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid var(--border-color);
  position: relative;
  flex: 1;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: rgba(13, 124, 95, 0.2);
}

.step-number {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: var(--gradient-eco);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 2px 10px rgba(13, 124, 95, 0.3);
}

.step-icon-wrap {
  width: 56px;
  height: 56px;
  margin: 8px auto 16px;
  background: var(--primary-subtle);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.step-card:hover .step-icon-wrap {
  transform: scale(1.08);
  background: rgba(13, 124, 95, 0.15);
}

.step-card h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 700;
}

.step-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.875rem;
}

/* ===== CTA Section ===== */
.cta-section {
  padding: 100px 24px;
  background: var(--bg-color);
  position: relative;
}

.cta-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(13, 124, 95, 0.08) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  border-radius: 50%;
}

.cta-content {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 56px 40px;
  background: var(--gradient-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
}

.cta-leaf {
  margin-bottom: 20px;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.cta-content h2 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  margin: 0 0 12px;
  letter-spacing: -0.03em;
}

.cta-content p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 32px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 13px 26px;
  border-radius: var(--radius);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.cta-btn.primary {
  background: var(--gradient-eco);
  color: white;
  box-shadow: 0 4px 16px rgba(13, 124, 95, 0.3);
}

.cta-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(13, 124, 95, 0.4);
}

.cta-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1.5px solid var(--border-color);
}

.cta-btn.secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .hero-section {
    padding: 110px 20px 70px;
  }

  .hero-content h1 {
    font-size: 2.8rem;
  }

  .hero-stats {
    gap: 20px;
    padding: 20px 24px;
  }

  .stat-divider {
    display: none;
  }

  .features-section,
  .how-section,
  .cta-section {
    padding: 70px 20px;
  }

  .steps-grid {
    flex-direction: column;
    gap: 20px;
  }

  .step-connector {
    display: none;
  }

  .step-card {
    width: 100%;
  }

  .cta-content {
    padding: 40px 24px;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-btn {
    justify-content: center;
  }

  .hero-stats {
    flex-direction: column;
    gap: 16px;
  }

  .section-header h2 {
    font-size: 1.6rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-content h2 {
    font-size: 1.5rem;
  }

  .cta-actions {
    flex-direction: column;
  }

  .cta-btn {
    justify-content: center;
  }
}
</style>