<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Left Panel - Form -->
      <div class="form-panel">
        <div class="form-container">
          <div class="form-header">
            <h2>{{ t('register.title') }}</h2>
            <p>{{ t('register.subtitle') }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="success-message">
            <svg class="success-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>{{ success }}</span>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <svg class="error-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ error }}</span>
            <button class="error-close" @click="error = ''">×</button>
          </div>

          <!-- Register Form -->
          <form @submit.prevent="register" class="register-form">
            <div class="input-group">
              <label for="name">{{ t('register.fullName') }}</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input 
                  id="name"
                  v-model="user.name" 
                  type="text" 
                  name="name"
                  autocomplete="name"
                  :placeholder="t('register.namePlaceholder')"
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <label for="email">{{ t('register.email') }}</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input 
                  id="email"
                  v-model="user.email" 
                  type="email" 
                  name="email"
                  autocomplete="email"
                  autocapitalize="none"
                  spellcheck="false"
                  :placeholder="t('register.emailPlaceholder')"
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <label for="password">{{ t('register.password') }}</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  id="password"
                  v-model="user.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  name="new-password"
                  autocomplete="new-password"
                  :placeholder="t('register.passwordPlaceholder')"
                  required
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <!-- Password Strength Indicator -->
              <div class="password-strength" v-if="user.password">
                <div class="strength-bar">
                  <div 
                    class="strength-fill" 
                    :style="{ width: passwordStrength.percent + '%' }"
                    :class="passwordStrength.level"
                  ></div>
                </div>
                <span class="strength-text" :class="passwordStrength.level">
                  {{ t('register.strength.' + passwordStrength.level.replace('-', '')) }}
                </span>
              </div>
              <div class="password-requirements">
                <span :class="{ met: hasMinLength }">✓ {{ t('register.requirements.minLength') }}</span>
                <span :class="{ met: hasUpperCase }">✓ {{ t('register.requirements.uppercase') }}</span>
                <span :class="{ met: hasLowerCase }">✓ {{ t('register.requirements.lowercase') }}</span>
                <span :class="{ met: hasNumber }">✓ {{ t('register.requirements.number') }}</span>
              </div>
            </div>

            <div class="input-group">
              <label for="confirmPassword">{{ t('register.confirmPassword') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">🔐</span>
                <input 
                  id="confirmPassword"
                  v-model="confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  name="confirm-password"
                  autocomplete="new-password"
                  :placeholder="t('register.confirmPlaceholder')"
                  required
                  :class="{ 'password-match': passwordsMatch && confirmPassword, 'password-mismatch': !passwordsMatch && confirmPassword }"
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <svg v-if="!showConfirmPassword" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <span v-if="confirmPassword && !passwordsMatch" class="match-error">
                {{ t('register.passwordsDontMatch') }}
              </span>
              <span v-if="confirmPassword && passwordsMatch" class="match-success">
                ✓ {{ t('register.passwordsMatch') }}
              </span>
            </div>

            <!-- Terms Checkbox -->
            <label class="terms-checkbox">
              <input type="checkbox" v-model="acceptTerms" required>
              <span class="checkbox-mark"></span>
              <span>{{ t('register.agreeToTerms') }} <a href="#">{{ t('register.termsOfService') }}</a> {{ t('register.and') }} <a href="#">{{ t('register.privacyPolicy') }}</a></span>
            </label>

            <button type="submit" class="register-btn" :disabled="loading || !isFormValid">
              <span v-if="loading" class="btn-loading">
                <span class="spinner"></span>
                {{ t('register.creatingAccount') }}
              </span>
              <span v-else class="btn-content">
                <span>{{ t('register.createAccount') }}</span>
                <span class="btn-arrow">→</span>
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span>{{ t('register.orSignUpWith') }}</span>
          </div>

          <!-- Social Login -->
          <div class="social-login" style="grid-template-columns: 1fr">
            <div id="google-signup-btn" class="google-btn-wrapper"></div>
          </div>

          <!-- Login Link -->
          <div class="login-prompt">
            <p>{{ t('register.alreadyHaveAccount') }} 
              <router-link to="/login" class="login-link">
                {{ t('register.signInHere') }}
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Panel - Branding -->
      <div class="branding-panel">
        <div class="branding-shapes">
          <div class="b-shape b-shape-1"></div>
          <div class="b-shape b-shape-2"></div>
          <div class="b-shape b-shape-3"></div>
        </div>
        <div class="brand-content">
          <div class="brand-logo">
            <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
              <path d="M16 4c-2 0-8 4-8 12s5 12 8 14c3-2 8-6 8-14s-6-12-8-12z" stroke="currentColor" stroke-width="1.8" fill="none"/>
              <path d="M16 8v14M12 14c2 3 6 3 8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <h1>{{ t('register.joinMovement') }}</h1>
          <p>{{ t('register.startMakingDifference') }}</p>
          
          <div class="benefits-list">
            <div class="benefit">
              <span class="benefit-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </span>
              <div>
                <h4>{{ t('register.benefits.ecoShopping') }}</h4>
                <p>{{ t('register.benefits.accessProducts') }}</p>
              </div>
            </div>
            <div class="benefit">
              <span class="benefit-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </span>
              <div>
                <h4>{{ t('register.benefits.trackImpact') }}</h4>
                <p>{{ t('register.benefits.monitorFootprint') }}</p>
              </div>
            </div>
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
  name: 'RegisterPage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: ''
      },
      confirmPassword: '',
      error: '',
      success: '',
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      acceptTerms: false,
      googleClientId: '374788513993-g2eej9cpmrv8a7ddgth9fhvn7t1rshkq.apps.googleusercontent.com'
    }
  },
  mounted() {
    // Initialize Google Sign-In
    this.initGoogleSignIn();
  },
  computed: {
    hasMinLength() {
      return this.user.password.length >= 8;
    },
    hasUpperCase() {
      return /[A-Z]/.test(this.user.password);
    },
    hasLowerCase() {
      return /[a-z]/.test(this.user.password);
    },
    hasNumber() {
      return /\d/.test(this.user.password);
    },
    passwordsMatch() {
      return this.user.password === this.confirmPassword && this.user.password.length > 0;
    },
    passwordStrength() {
      let score = 0;
      if (this.hasMinLength) score++;
      if (this.hasUpperCase) score++;
      if (this.hasLowerCase) score++;
      if (this.hasNumber) score++;
      if (this.user.password.length >= 12) score++;
      if (/[!@#$%^&*]/.test(this.user.password)) score++;

      if (score <= 2) return { level: 'weak', text: 'Weak', percent: 25 };
      if (score <= 4) return { level: 'medium', text: 'Medium', percent: 50 };
      if (score <= 5) return { level: 'strong', text: 'Strong', percent: 75 };
      return { level: 'very-strong', text: 'Very Strong', percent: 100 };
    },
    isFormValid() {
      return this.user.name.trim().length >= 2 &&
             this.user.email &&
             this.hasMinLength &&
             this.hasUpperCase &&
             this.hasLowerCase &&
             this.hasNumber &&
             this.passwordsMatch &&
             this.acceptTerms;
    }
  },
  methods: {
    async register() {
      this.error = '';
      this.success = '';

      // Check password confirmation first
      if (this.user.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      // Client-side validation
      if (this.user.name.trim().length < 2) {
        this.error = 'Name must be at least 2 characters long';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.user.email)) {
        this.error = 'Please enter a valid email address';
        return;
      }

      if (this.user.password.length < 8) {
        this.error = 'Password must be at least 8 characters long';
        return;
      }

      if (!this.hasUpperCase) {
        this.error = 'Password must contain at least one uppercase letter';
        return;
      }
      if (!this.hasLowerCase) {
        this.error = 'Password must contain at least one lowercase letter';
        return;
      }
      if (!this.hasNumber) {
        this.error = 'Password must contain at least one number';
        return;
      }

      this.loading = true;

      const authStore = useAuthStore()
      const result = await authStore.register(this.user.name.trim(), this.user.email.trim(), this.user.password, null)

      if (result.success) {
        this.success = result.message + ' Redirecting to login...';
        setTimeout(() => this.$router.push('/login'), 2000);
      } else {
        // Display the specific error from backend
        this.error = result.error || 'Registration failed. Please try again.';
        console.error('Registration error:', result.error);
      }

      this.loading = false;
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
      if (window.google && document.getElementById('google-signup-btn')) {
        window.google.accounts.id.initialize({
          client_id: this.googleClientId,
          callback: this.handleGoogleCallback,
          auto_select: false
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-btn'),
          { 
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
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
            this.success = 'Account created successfully! Redirecting...';
            setTimeout(() => {
              window.location.href = '/products?welcome=true';
            }, 1500);
          } else {
            // User already exists, just log them in
            window.location.href = '/products';
          }
        } else {
          this.error = result.error || 'Google signup failed. Please try again.';
        }
      } catch (err) {
        this.error = 'Google signup failed. Please try again.';
        console.error('Google signup error:', err);
      }
      
      this.loading = false;
    },

  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  padding: 20px;
  animation: pageFadeIn 0.5s ease;
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Register Container */
.register-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 950px;
  width: 100%;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

/* Form Panel */
.form-panel {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  max-height: 95vh;
}

.form-container {
  max-width: 360px;
  width: 100%;
}

.form-header {
  margin-bottom: 24px;
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

/* Messages */
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

.success-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  color: #059669;
  font-size: 0.875rem;
}

.dark .success-message {
  background: rgba(5, 150, 105, 0.1);
  border-color: rgba(5, 150, 105, 0.3);
}

.error-icon, .success-icon {
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

/* Register Form */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group label {
  font-size: 0.8rem;
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
  left: 12px;
  color: var(--text-secondary);
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 11px 12px 11px 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: var(--transition);
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-subtle);
  transform: translateY(-1px);
}

.input-wrapper input::placeholder {
  color: var(--text-secondary);
}

.input-wrapper input.password-match {
  border-color: var(--primary);
}

.input-wrapper input.password-mismatch {
  border-color: #dc2626;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: var(--text-color);
}

/* Password Strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: var(--transition);
}

.strength-fill.weak { background: #dc2626; }
.strength-fill.medium { background: #f59e0b; }
.strength-fill.strong { background: var(--primary); }
.strength-fill.very-strong { background: var(--primary-light); }

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
}

.strength-text.weak { color: #dc2626; }
.strength-text.medium { color: #f59e0b; }
.strength-text.strong { color: var(--primary); }
.strength-text.very-strong { color: var(--primary-light); }

/* Password Requirements */
.password-requirements {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.password-requirements span {
  font-size: 0.7rem;
  color: var(--text-secondary);
  padding: 3px 7px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.password-requirements span.met {
  color: var(--primary);
  background: var(--primary-subtle);
  border-color: transparent;
}

/* Phone input styling */
.phone-valid {
  border-color: var(--primary) !important;
}

.phone-invalid {
  border-color: #dc2626 !important;
}

.phone-hint {
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 4px;
}

.optional {
  font-weight: normal;
  color: var(--text-secondary);
  font-size: 0.85em;
}

/* Match indicators */
.match-error {
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 4px;
}

.match-success {
  font-size: 0.75rem;
  color: var(--primary);
  margin-top: 4px;
}

/* Terms Checkbox */
.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.terms-checkbox input {
  display: none;
}

.terms-checkbox .checkbox-mark {
  width: 18px;
  height: 18px;
  min-width: 18px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  margin-top: 2px;
  background: var(--bg-color);
}

.terms-checkbox input:checked + .checkbox-mark {
  background: var(--gradient-eco, var(--primary));
  border-color: var(--primary);
}

.terms-checkbox input:checked + .checkbox-mark::after {
  content: '✓';
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
}

.terms-checkbox a {
  color: var(--primary);
  text-decoration: none;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

/* Register Button */
.register-btn {
  width: 100%;
  padding: 12px 16px;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 8px;
  position: relative;
  overflow: hidden;
}

.register-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -60%;
  width: 40%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: skewX(-25deg);
  transition: left 0.6s ease;
}

.register-btn:hover:not(:disabled)::after {
  left: 120%;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(46, 204, 113, 0.3);
}

.register-btn:disabled {
  opacity: 0.6;
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

.register-btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(3px);
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
  gap: 15px;
  margin: 16px 0;
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
  color: var(--text-secondary);
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
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
  height: 42px;
}

.social-btn:hover {
  border-color: var(--text-secondary);
  background: var(--bg-color);
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



/* Login Prompt */
.login-prompt {
  text-align: center;
  margin-top: 20px;
}

.login-prompt p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.login-link {
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

/* Branding Shapes */
.branding-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.b-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.b-shape-1 {
  width: 200px;
  height: 200px;
  top: -60px;
  right: -40px;
  animation: floatShape 8s ease-in-out infinite;
}

.b-shape-2 {
  width: 140px;
  height: 140px;
  bottom: -30px;
  left: -30px;
  animation: floatShape 10s ease-in-out infinite reverse;
}

.b-shape-3 {
  width: 80px;
  height: 80px;
  top: 50%;
  right: 20%;
  animation: floatShape 6s ease-in-out infinite 1s;
}

@keyframes floatShape {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(10px, -15px) scale(1.05); }
}

/* Branding Panel */
.branding-panel {
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.brand-content {
  position: relative;
  z-index: 1;
}

.brand-logo {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #ffffff;
}

.branding-panel h1 {
  font-size: 1.75rem;
  font-weight: 600;
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

/* Benefits List */
.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 32px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
}

.benefit-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #ffffff;
  transition: transform 0.3s ease;
}

.benefit:hover .benefit-icon {
  transform: scale(1.1);
}

.benefit-icon svg {
  width: 20px;
  height: 20px;
  stroke: #ffffff;
}

.benefit h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: #ffffff;
}

.benefit p {
  margin: 2px 0 0;
  font-size: 0.8rem;
  opacity: 0.75;
  color: rgba(255, 255, 255, 0.85);
}

/* Mini Testimonial */
.testimonial-mini {
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
}

.testimonial-mini > p {
  margin: 0 0 12px;
  font-style: italic;
  font-size: 0.875rem;
  line-height: 1.5;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.95);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  opacity: 0.85;
  color: rgba(255, 255, 255, 0.9);
}

.author-avatar {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: #ffffff;
}

/* Responsive */
@media (max-width: 900px) {
  .register-container {
    grid-template-columns: 1fr;
    max-width: 440px;
  }

  .branding-panel {
    display: none;
  }

  .form-panel {
    padding: 32px 24px;
  }
}

@media (max-width: 400px) {
  .form-header h2 {
    font-size: 1.25rem;
  }

  .social-login {
    grid-template-columns: 1fr;
  }

  .password-requirements {
    flex-direction: column;
  }
}
</style>