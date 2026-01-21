<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <span class="hero-badge">{{ t('home.heroTitle') }}</span>
        <h1>Eco Pakalpojumi</h1>
        <p class="hero-subtitle">
          {{ t('home.heroSubtitle') }}
        </p>
        <div class="hero-actions">
          <router-link to="/products" class="hero-btn primary">
            {{ t('home.shopProducts') }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </router-link>
          <router-link to="/calculator" class="hero-btn secondary">
            {{ t('home.calculateFootprint') }}
          </router-link>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-value">{{ formatNumber(globalStats.totalUsers) }}+</span>
            <span class="stat-text">{{ t('home.activeUsers') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="hero-stat">
            <span class="stat-value">{{ formatNumber(globalStats.totalCo2Saved) }}</span>
            <span class="stat-text">{{ t('home.co2Saved') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="hero-stat">
            <span class="stat-value">{{ formatNumber(globalStats.treesPlanted) }}</span>
            <span class="stat-text">{{ t('home.treesPlanted') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <div class="section-header">
        <h2>{{ t('home.whyChooseUs') }}</h2>
        <p>{{ t('home.joinThousands') }}</p>
      </div>
      <div class="features-grid">
        <router-link to="/products" class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <h3>{{ t('home.sustainableProducts') }}</h3>
          <p>{{ t('home.sustainableProductsDesc') }}</p>
          <span class="feature-link">{{ t('home.browseProducts') }} →</span>
        </router-link>

        <router-link to="/calculator" class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
          </div>
          <h3>{{ t('home.carbonCalculator') }}</h3>
          <p>{{ t('home.carbonCalculatorDesc') }}</p>
          <span class="feature-link">{{ t('home.tryCalculator') }} →</span>
        </router-link>

        <router-link to="/forum" class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3>{{ t('home.communityForum') }}</h3>
          <p>{{ t('home.communityForumDesc') }}</p>
          <span class="feature-link">{{ t('home.joinDiscussion') }} →</span>
        </router-link>

        <router-link to="/challenges" class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          </div>
          <h3>{{ t('home.ecoChallenges') }}</h3>
          <p>{{ t('home.ecoChallengesDesc') }}</p>
          <span class="feature-link">{{ t('home.viewChallenges') }} →</span>
        </router-link>

        <router-link to="/education" class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          </div>
          <h3>{{ t('home.educationHub') }}</h3>
          <p>{{ t('home.educationHubDesc') }}</p>
          <span class="feature-link">{{ t('home.startLearning') }} →</span>
        </router-link>

        <router-link to="/footprint" class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <h3>{{ t('home.footprintTracker') }}</h3>
          <p>{{ t('home.footprintTrackerDesc') }}</p>
          <span class="feature-link">{{ t('home.trackProgress') }} →</span>
        </router-link>
      </div>
    </div>

    <!-- Impact Section -->
    <div class="impact-section">
      <div class="section-header">
        <h2>{{ t('home.ourImpact') }}</h2>
        <p>{{ t('home.impactSubtitle') }}</p>
      </div>
      <div class="impact-grid">
        <div class="impact-card">
          <div class="impact-value">{{ globalStats.treesPlanted.toLocaleString() }}</div>
          <div class="impact-label">{{ t('home.treesPlantedImpact') }}</div>
          <div class="impact-bar">
            <div class="bar-fill" :style="{ width: Math.min((globalStats.treesPlanted / 5000) * 100, 100) + '%' }"></div>
          </div>
        </div>

        <div class="impact-card">
          <div class="impact-value">{{ Math.floor(globalStats.totalActivities / 10) }} t</div>
          <div class="impact-label">{{ t('home.plasticDiverted') }}</div>
          <div class="impact-bar">
            <div class="bar-fill" :style="{ width: Math.min((globalStats.totalActivities / 1000) * 100, 100) + '%' }"></div>
          </div>
        </div>

        <div class="impact-card">
          <div class="impact-value">{{ formatNumber(globalStats.totalCo2Saved * 2) }} kWh</div>
          <div class="impact-label">{{ t('home.cleanEnergy') }}</div>
          <div class="impact-bar">
            <div class="bar-fill" :style="{ width: Math.min((globalStats.totalCo2Saved / 50000) * 100, 100) + '%' }"></div>
          </div>
        </div>

        <div class="impact-card">
          <div class="impact-value">{{ globalStats.totalCo2Saved.toLocaleString() }} kg</div>
          <div class="impact-label">{{ t('home.co2SavedImpact') }}</div>
          <div class="impact-bar">
            <div class="bar-fill" :style="{ width: Math.min((globalStats.totalCo2Saved / 100000) * 100, 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="how-section">
      <div class="section-header">
        <h2>{{ t('home.howItWorks') }}</h2>
        <p>{{ t('home.howItWorksSubtitle') }}</p>
      </div>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>{{ t('home.stepCalculate') }}</h3>
          <p>{{ t('home.stepCalculateDesc') }}</p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h3>{{ t('home.stepTakeAction') }}</h3>
          <p>{{ t('home.stepTakeActionDesc') }}</p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h3>{{ t('home.stepTrackProgress') }}</h3>
          <p>{{ t('home.stepTrackProgressDesc') }}</p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="cta-section">
      <div class="cta-content">
        <h2>{{ t('home.readyToMakeDifference') }}</h2>
        <p>{{ t('home.ctaSubtitle') }}</p>
        <div class="cta-actions">
          <router-link to="/register" class="cta-btn primary">
            {{ t('home.getStartedFree') }}
          </router-link>
          <router-link to="/education" class="cta-btn secondary">
            {{ t('home.learnMore') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="testimonials-section">
      <div class="section-header">
        <h2>{{ t('home.testimonials') }}</h2>
        <p>{{ t('home.testimonialsSubtitle') }}</p>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="quote">"{{ t('home.testimonial1') }}"</div>
          <div class="author">
            <div class="avatar">👩</div>
            <div class="author-info">
              <span class="name">Anna K.</span>
              <span class="role">Eko Karotāja kopš 2024</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="quote">"{{ t('home.testimonial2') }}"</div>
          <div class="author">
            <div class="avatar">👨</div>
            <div class="author-info">
              <span class="name">Jānis M.</span>
              <span class="role">150 izaicinājumi pabeigti</span>
            </div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="quote">"{{ t('home.testimonial3') }}"</div>
          <div class="author">
            <div class="avatar">👩‍🦰</div>
            <div class="author-info">
              <span class="name">Līga B.</span>
              <span class="role">Foruma moderatore</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'HomePage',
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
      }
    }
  },
  async mounted() {
    try {
      const response = await fetch('http://localhost:3000/api/stats/global')
      if (response.ok) {
        const data = await response.json()
        this.globalStats = data
      }
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
    }
  }
}
</script>

<style scoped>
.home-page {
  background: var(--bg-color);
}

/* Hero Section */
.hero-section {
  padding: 120px 24px 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.hero-content {
  max-width: 640px;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  padding: 8px 16px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 24px;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 16px;
  letter-spacing: -0.03em;
  color: var(--text-color);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.hero-btn {
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-btn.primary {
  background: var(--primary);
  color: white;
}

.hero-btn.primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.hero-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.hero-btn.secondary:hover {
  background: var(--border-color);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.hero-stat {
  text-align: center;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
}

.stat-text {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.section-header p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Features Section */
.features-section {
  padding: 80px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  background: var(--card-bg);
  padding: 28px;
  border-radius: var(--radius-lg);
  text-decoration: none;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.feature-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: var(--primary-subtle);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--primary);
}

.feature-icon svg {
  width: 24px;
  height: 24px;
}

.feature-card h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.feature-card p {
  margin: 0 0 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.9rem;
}

.feature-link {
  color: var(--primary);
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Impact Section */
.impact-section {
  padding: 80px 24px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.impact-grid {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.impact-card {
  background: var(--card-bg);
  padding: 24px;
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid var(--border-color);
}

.impact-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 12px;
  background: var(--primary-subtle);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}

.impact-icon svg {
  width: 22px;
  height: 22px;
}

.impact-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 4px;
}

.impact-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.impact-bar {
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width 1s ease;
}

/* How It Works Section */
.how-section {
  padding: 80px 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.step-card {
  background: var(--card-bg);
  padding: 28px 24px;
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid var(--border-color);
  position: relative;
}

.step-number {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 28px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
}

.step-icon {
  width: 48px;
  height: 48px;
  margin: 8px auto 16px;
  background: var(--primary-subtle);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}

.step-icon svg {
  width: 24px;
  height: 24px;
}

.step-card h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
}

.step-card p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.875rem;
}

/* CTA Section */
.cta-section {
  padding: 80px 24px;
  background: var(--bg-color);
}

.cta-content {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
}

.cta-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}

.cta-content p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 28px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cta-btn.primary {
  background: var(--primary);
  color: white;
}

.cta-btn.primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.cta-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.cta-btn.secondary:hover {
  background: var(--border-color);
}

/* Testimonials Section */
.testimonials-section {
  padding: 80px 24px;
  max-width: 1000px;
  margin: 0 auto;
  border-top: 1px solid var(--border-color);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.testimonial-card {
  background: var(--card-bg);
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.quote {
  font-size: 0.95rem;
  color: var(--text-color);
  line-height: 1.7;
  margin-bottom: 16px;
  position: relative;
  padding-left: 16px;
  border-left: 2px solid var(--primary);
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: var(--primary-subtle);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.role {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 100px 20px 60px;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-stats {
    gap: 20px;
  }

  .stat-divider {
    display: none;
  }

  .features-section,
  .impact-section,
  .how-section,
  .cta-section,
  .testimonials-section {
    padding: 60px 20px;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2rem;
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
    font-size: 1.5rem;
  }

  .features-grid,
  .impact-grid,
  .steps-grid,
  .testimonials-grid {
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