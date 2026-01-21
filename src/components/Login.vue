<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Panel - Branding -->
      <div class="branding-panel">
        <div class="brand-content">
          <div class="brand-logo">EP</div>
          <h1>Eco Pakalpojumi</h1>
          <p>{{ t('login.brandTagline') }}</p>
          
          <div class="brand-features">
            <div class="feature">
              <span class="feature-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </span>
              <span>{{ t('login.features.shop') }}</span>
            </div>
            <div class="feature">
              <span class="feature-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </span>
              <span>{{ t('login.features.track') }}</span>
            </div>
            <div class="feature">
              <span class="feature-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              </span>
              <span>{{ t('login.features.challenges') }}</span>
            </div>
            <div class="feature">
              <span class="feature-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
              </span>
              <span>{{ t('login.features.community') }}</span>
            </div>
          </div>

          <div class="brand-stats">
            <div class="stat">
              <span class="stat-number">{{ formatNumber(globalStats.totalUsers) }}+</span>
              <span class="stat-label">{{ t('login.stats.ecoWarriors') }}</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ formatNumber(globalStats.totalCo2Saved) }}</span>
              <span class="stat-label">{{ t('login.stats.co2Saved') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Login Form -->
      <div class="form-panel">
        <div class="form-container">
          <div class="form-header">
            <h2>{{ t('login.welcomeBack') }}</h2>
            <p>{{ t('login.subtitle') }}</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <svg class="error-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ error }}</span>
            <button class="error-close" @click="error = ''">×</button>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="login" class="login-form">
            <div class="input-group">
              <label for="email">{{ t('login.email') }}</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input 
                  id="email"
                  v-model="credentials.email" 
                  type="email" 
                  :placeholder="t('login.emailPlaceholder')"
                  required
                  :class="{ 'has-value': credentials.email }"
                />
              </div>
            </div>

            <div class="input-group">
              <label for="password">{{ t('login.password') }}</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input 
                  id="password"
                  v-model="credentials.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  :placeholder="t('login.passwordPlaceholder')"
                  required
                  :class="{ 'has-value': credentials.password }"
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe">
                <span class="checkbox-mark"></span>
                <span>{{ t('login.rememberMe') }}</span>
              </label>
              <a href="#" class="forgot-link">{{ t('login.forgotPassword') }}</a>
            </div>

            <button type="submit" class="login-btn" :disabled="loading">
              <span v-if="loading" class="btn-loading">
                <span class="spinner"></span>
                {{ t('login.signingIn') }}
              </span>
              <span v-else class="btn-content">
                <span>{{ t('login.signIn') }}</span>
                <svg class="btn-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span>{{ t('login.orContinueWith') }}</span>
          </div>

          <!-- Social Login -->
          <div class="social-login">
            <div id="google-signin-btn" class="google-btn-wrapper"></div>
            <button type="button" class="social-btn github" @click="githubLogin">
              <span class="social-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </span>
              <span>GitHub</span>
            </button>
          </div>

          <!-- Register Link -->
          <div class="register-prompt">
            <p>{{ t('login.noAccount') }} 
              <router-link to="/register" class="register-link">
                {{ t('login.createOne') }}
              </router-link>
            </p>
          </div>

          <!-- Demo Credentials -->
          <div class="demo-hint">
            <svg class="hint-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>{{ t('login.demo') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth.js'
import { useI18n } from 'vue-i18n'

export default {
  name: 'LoginPage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      error: '',
      loading: false,
      showPassword: false,
      rememberMe: false,
      googleClientId: '374788513993-g2eej9cpmrv8a7ddgth9fhvn7t1rshkq.apps.googleusercontent.com',
      globalStats: {
        totalUsers: 0,
        totalCo2Saved: 0
      }
    }
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/products';
    }
    
    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.credentials.email = rememberedEmail;
      this.rememberMe = true;
    }
    
    // Initialize Google Sign-In
    this.initGoogleSignIn();
    
    // Fetch global stats
    this.fetchGlobalStats();
  },
  methods: {
    async fetchGlobalStats() {
      try {
        const response = await fetch('http://localhost:3000/api/stats/global');
        if (response.ok) {
          const data = await response.json();
          this.globalStats = {
            totalUsers: data.totalUsers || 0,
            totalCo2Saved: data.totalCo2Saved || 0
          };
        }
      } catch (error) {
        console.error('Error fetching global stats:', error);
        // Use fallback values if API fails
        this.globalStats = { totalUsers: 150, totalCo2Saved: 2500 };
      }
    },
    formatNumber(num) {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    },
    initGoogleSignIn() {
      // Load Google Identity Services script
      if (!document.getElementById('google-gsi-script')) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.renderGoogleButton();
        document.head.appendChild(script);
      } else if (window.google) {
        this.renderGoogleButton();
      }
    },
    renderGoogleButton() {
      if (window.google && document.getElementById('google-signin-btn')) {
        window.google.accounts.id.initialize({
          client_id: this.googleClientId,
          callback: this.handleGoogleCallback,
          auto_select: false
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { 
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: '100%'
          }
        );
      }
    },
    async handleGoogleCallback(response) {
      this.loading = true;
      this.error = '';
      
      try {
        const authStore = useAuthStore();
        const result = await authStore.googleLogin(response.credential, this.googleClientId);
        
        if (result.success) {
          if (result.isNewUser) {
            // New user created via Google
            window.location.href = '/products?welcome=true';
          } else {
            window.location.href = '/products';
          }
        } else {
          this.error = result.error || 'Google login failed. Please try again.';
        }
      } catch (err) {
        this.error = 'Google login failed. Please try again.';
        console.error('Google login error:', err);
      }
      
      this.loading = false;
    },
    githubLogin() {
      // GitHub OAuth would require backend setup similar to Google
      this.error = 'GitHub login coming soon! Please use Google or email login.';
    },
    async login() {
      this.loading = true;
      this.error = '';

      if (!this.credentials.email.trim()) {
        this.error = 'Please enter your email address';
        this.loading = false;
        return;
      }

      if (!this.credentials.password) {
        this.error = 'Please enter your password';
        this.loading = false;
        return;
      }

      // Remember email if checked
      if (this.rememberMe) {
        localStorage.setItem('rememberedEmail', this.credentials.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const authStore = useAuthStore()
      const result = await authStore.login(this.credentials.email.trim(), this.credentials.password)

      if (result.success) {
        window.location.href = '/products';
      } else {
        this.error = result.error || 'Login failed. Please check your credentials and try again.';
        console.error('Login error:', result.error);
      }

      this.loading = false;
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  padding: 20px;
}

/* Login Container */
.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 900px;
  width: 100%;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

/* Branding Panel */
.branding-panel {
  background: var(--primary);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.brand-content {
  position: relative;
}

.brand-logo {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 20px;
  color: #ffffff;
}

.branding-panel h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.branding-panel > .brand-content > p {
  font-size: 0.95rem;
  opacity: 0.85;
  margin: 0 0 32px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: #ffffff;
}

.feature-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.feature-icon svg {
  width: 18px;
  height: 18px;
  stroke: #ffffff;
}

.brand-stats {
  display: flex;
  gap: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stat {
  text-align: left;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.85);
}

/* Form Panel */
.form-panel {
  padding: 48px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  max-width: 340px;
  width: 100%;
}

.form-header {
  margin-bottom: 28px;
}

.form-header h2 {
  margin: 0 0 6px;
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.form-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  color: #dc2626;
  font-size: 0.875rem;
}

.dark .error-message {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.3);
}

.error-icon {
  flex-shrink: 0;
}

.error-close {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  line-height: 1;
}

.error-close:hover {
  opacity: 1;
}

/* Login Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: var(--text-muted);
}

.input-wrapper input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 0.95rem;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-subtle);
}

.input-wrapper input::placeholder {
  color: var(--text-muted);
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: var(--text-secondary);
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-color);
}

.remember-me input {
  display: none;
}

.checkbox-mark {
  width: 18px;
  height: 18px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remember-me input:checked + .checkbox-mark {
  background: var(--primary);
  border-color: var(--primary);
}

.remember-me input:checked + .checkbox-mark::after {
  content: '✓';
  color: white;
  font-size: 0.7rem;
}

.forgot-link {
  font-size: 0.875rem;
  color: var(--primary);
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* Login Button */
.login-btn {
  width: 100%;
  padding: 14px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  box-shadow: var(--shadow);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-arrow {
  transition: transform 0.2s;
}

.login-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.divider span {
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Social Login */
.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: center;
}

.google-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 42px;
}

.google-btn-wrapper > div {
  width: 100% !important;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  height: 42px;
}

.social-btn:hover {
  background: var(--bg-secondary);
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon svg {
  width: 18px;
  height: 18px;
}

.social-btn.github {
  background: #24292e;
  border-color: #24292e;
  color: white;
}

.social-btn.github:hover {
  background: #2f363d;
  border-color: #2f363d;
}

/* Register Prompt */
.register-prompt {
  text-align: center;
  margin-top: 24px;
}

.register-prompt p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.register-link {
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

/* Demo Hint */
.demo-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 10px 14px;
  background: var(--primary-subtle);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.hint-icon {
  color: var(--primary);
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 420px;
  }

  .branding-panel {
    display: none;
  }

  .form-panel {
    padding: 40px 24px;
  }
}

@media (max-width: 400px) {
  .form-header h2 {
    font-size: 1.3rem;
  }

  .social-login {
    grid-template-columns: 1fr;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>