<template>
  <div class="not-found-page">
    <div class="floating-shape s1"></div>
    <div class="floating-shape s2"></div>
    <div class="floating-shape s3"></div>
    <div class="not-found-card">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          <path d="M15 9l-6 6M9 9l6 6"/>
        </svg>
      </div>
      <h1>404</h1>
      <p>Page not found</p>
      <p class="sub-text">The page you're looking for doesn't exist or has been moved.</p>
      <button class="back-home-btn" @click="$router.push('/')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>
        Go Home
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage'
}
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  animation: pageFadeIn 0.5s ease;
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: var(--primary-subtle, rgba(46, 204, 113, 0.08));
  animation: floatShape 8s ease-in-out infinite;
}

.floating-shape.s1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
}

.floating-shape.s2 {
  width: 150px;
  height: 150px;
  bottom: 15%;
  right: 15%;
  animation-delay: -3s;
}

.floating-shape.s3 {
  width: 100px;
  height: 100px;
  top: 60%;
  left: 60%;
  animation-delay: -5s;
}

@keyframes floatShape {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.not-found-card {
  text-align: center;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl, 16px);
  padding: 3rem 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  min-width: 320px;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-subtle, rgba(46, 204, 113, 0.1));
  border-radius: 50%;
  color: var(--primary);
}

.error-icon svg {
  width: 32px;
  height: 32px;
}

.not-found-card h1 {
  margin: 0 0 0.5rem;
  font-size: 4rem;
  font-weight: 700;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.not-found-card p {
  margin: 0 0 0.5rem;
  color: var(--text-color);
  font-size: 1.25rem;
  font-weight: 600;
}

.sub-text {
  color: var(--text-secondary) !important;
  font-size: 0.9rem !important;
  font-weight: 400 !important;
  margin-bottom: 1.5rem !important;
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.back-home-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: skewX(-25deg);
  transition: left 0.5s ease;
}

.back-home-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(46, 204, 113, 0.3);
}

.back-home-btn:hover::after {
  left: 100%;
}
</style>
