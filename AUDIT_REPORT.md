# Comprehensive Audit Report — Eco Pakalpojumi 2026

**Date:** 2025  
**Stack:** Vue 3 + Pinia + Vue Router 4 + vue-i18n 9 / Express.js + SQLite3  

---

## Legend

| Priority | Meaning |
|----------|---------|
| 🔴 HIGH | Broken functionality, security flaw, or data loss risk |
| 🟡 MEDIUM | Half-implemented feature, misleading UI, or significant UX issue |
| 🟢 LOW | Polish, minor inconsistency, or improvement opportunity |

---

## 1. BROKEN FEATURES / BUGS

### 1.1 🔴 Challenges page has no route — completely unreachable
- **File:** `src/router.js` (all routes) + `src/components/Challenges.vue`
- **Issue:** `Challenges.vue` (1 642 lines) exists but **no route** is defined in `router.js`. Users cannot navigate to it. Navbar and mobile menu also have **no link** to Challenges.
- **Fix:** Add `{ path: '/challenges', component: () => import('./components/Challenges.vue') }` and a navbar link.

### 1.2 🔴 Duplicate feature cards on Home page
- **File:** `src/components/Home.vue` ~lines 78-104
- **Issue:** There are **two** identical "Education Hub" cards rendered. The second card uses the same `t('home.educationHub')` title and `t('home.educationHubDesc')` description but its `router-link` points to `/footprint`. This is clearly a copy-paste bug — the second card should be the "Footprint Tracker" card (which appears correctly below it), resulting in **three** cards where there should be two distinct ones.
- **Fix:** Remove the duplicated Education Hub card or replace its content with unique Footprint Tracker content.

### 1.3 🔴 "Forgot Password" link goes nowhere
- **File:** `src/components/Login.vue` ~line 77
- **Issue:** `<a href="#">Forgot password?</a>` — no handler, no route, no modal. Clicking it scrolls to page top.
- **Fix:** Implement a password-reset flow (email token) or remove the link.

### 1.4 🔴 Promo codes hardcoded on the client side (security)
- **File:** `src/components/Cart.vue` — promo discount logic
- **Issue:** Discount codes `ECO10` (10%), `GREEN20` (20%), `PLANET15` (15%) are validated entirely in the frontend. Anyone can inspect the source to discover them, and the discount is never re-validated server-side at checkout (`POST /api/checkout` calculates total from DB prices only). This means the discount is **never actually applied** to the order total.
- **Fix:** Move promo-code validation to `POST /api/checkout` and store codes in the database.

### 1.5 🔴 Login/Register uses `window.location.href` instead of `router.push`
- **File:** `src/components/Login.vue` ~lines 366, 321-325  
- **File:** `src/components/Register.vue` ~lines 482, 476
- **Issue:** After successful email login: `window.location.href = '/products'`; After Google login: `window.location.href = '/products?welcome=true'`. This causes a **full page reload**, discarding any in-memory state and defeating SPA navigation. The register component inconsistently uses `this.$router.push('/login')` for email register but `window.location.href` for Google callback.
- **Fix:** Use `this.$router.push('/products')` everywhere.

### 1.6 🔴 Admin "self-delete" guard uses wrong property name
- **File:** `backend/server.cjs` ~line 1053 (`DELETE /api/admin/users/:id`)
- **Issue:** Guard checks `parseInt(userId) === req.user.userId` but `authenticateToken` middleware puts decoded JWT fields as `req.user.id` (not `req.user.userId`). The self-delete protection **never triggers**.
- **Fix:** Change to `req.user.id`.

### 1.7 🟡 JWT expiry mismatch — register vs login
- **File:** `backend/server.cjs`
- **Issue:** Login token: `expiresIn: '24h'` (line ~453). Google OAuth callback token: **no expiry set** (line ~463: `jwt.sign({ ... }, JWT_SECRET)` — token never expires). Register endpoint returns no token at all (user must login separately). The `stores/auth.js` stores token but never checks expiry client-side.
- **Fix:** Standardise to a consistent expiry (e.g., `7d`) for all token-issuing paths and add client-side expiry checking.

### 1.8 🟡 Profile update triggers `location.reload()` — breaks SPA
- **File:** `src/components/Profile.vue` (update profile handler)
- **Issue:** After successful PUT `/api/user`, the page does `location.reload()`. This loses any in-memory state and causes a flash.
- **Fix:** Re-fetch user data via the auth store instead.

---

## 2. MISSING / HALF-IMPLEMENTED FUNCTIONALITY

### 2.1 🔴 GitHub login is a stub
- **File:** `src/components/Login.vue` ~line 338 (`githubLogin()`)  
- **File:** `src/components/Register.vue` ~line 496 (`githubSignup()`)
- **Issue:** Both methods just set `this.error = 'GitHub login coming soon!'`. The buttons are rendered and look functional but do nothing useful.
- **Fix:** Either implement GitHub OAuth or remove the buttons.

### 2.2 🔴 Terms of Service / Privacy Policy links go nowhere
- **File:** `src/components/Register.vue` ~line 135
- **Issue:** `<a href="#">Terms of Service</a>` and `<a href="#">Privacy Policy</a>` — no pages, no modals, no content. Users must accept terms to register but cannot read them.
- **Fix:** Create actual pages or modals with content.

### 2.3 🔴 Notifications system is empty shell
- **File:** `src/components/Navbar.vue` ~line 637
- **Issue:** `notifications = ref([])` with comment `// Will be populated from backend in future`. Bell icon, badge, dropdown, and "Mark all read" button are fully rendered but the array is always empty. No backend endpoint exists for notifications.
- **Fix:** Implement a notifications table and endpoint, or hide the bell icon.

### 2.4 🟡 Education content is 100% hardcoded — backend table unused
- **File:** `src/components/Education.vue` — `allContent` computed property
- **File:** `backend/server.cjs` — `GET /api/education` endpoint exists, `education_posts` table exists
- **Issue:** Education.vue has 9 articles/videos/guides hardcoded in a computed property. It **never calls** the `/api/education` endpoint. The backend route and table exist but are unused. The Navbar global search *does* query `/api/education`, but if the DB table is empty, education search always returns nothing.
- **Fix:** Seed the `education_posts` table and fetch from the API, or if hardcoded content is intentional, make the Navbar search filter the hardcoded data too.

### 2.5 🟡 Challenges data is entirely hardcoded — backend data ignored
- **File:** `src/components/Challenges.vue` ~lines 340-530 (`challenges` computed)
- **Issue:** 8 challenges are hardcoded in a computed property. `fetchChallenges()` is called on mount and hits `GET /api/challenges`, but the fetched data is only `console.log`'d — never merged into the displayed data. Join/progress/complete actions only mutate local state and are lost on page refresh.
- **Fix:** Use the backend `challenges` + `user_challenges` tables for persistence.

### 2.6 🟡 Admin Settings tab is purely decorative
- **File:** `src/components/Admin.vue` lines 529-584
- **Issue:** "Store Settings" and "Notification" toggles are plain HTML with no `v-model`, no data binding, and no save handler. The "Save Changes" button does nothing (no `@click`).
- **Fix:** Either wire up to backend settings or mark as "Coming Soon".

### 2.7 🟡 Admin Education/Services management stubs
- **File:** `src/components/Admin.vue` ~line 1367-1372
- **Issue:** `openEducationModal()` and `openServiceModal()` just call `alert('...coming soon!')`.
- **Fix:** Implement or remove the Quick Action buttons that call them.

### 2.8 🟡 Admin "View Order Details" uses `alert()`
- **File:** `src/components/Admin.vue` ~line 1327
- **Issue:** `viewOrderDetails(order)` displays data via `alert()` — no modal, no order items listed, no styled view.
- **Fix:** Create a proper order-detail modal that also shows `order_items`.

### 2.9 🟡 Admin "View Post" uses `alert()`
- **File:** `src/components/Admin.vue` ~line 1345
- **Issue:** `viewPost(post)` uses `alert()` to show truncated content.
- **Fix:** Open a modal or navigate to the forum post.

### 2.10 🟡 Phone number collected but never stored
- **File:** `src/components/Register.vue` — phone field with Latvian validation  
- **File:** `backend/server.cjs` — `POST /api/auth/register`
- **Issue:** The register form collects and validates a phone number, but the register handler only destructures `{ name, email, password }`. The phone field is **silently discarded**. The `users` table has no `phone` column.
- **Fix:** Add a `phone` column to the users table and include it in the INSERT.

### 2.11 🟡 Cart item checkboxes are non-functional
- **File:** `src/components/Cart.vue` — cart item template
- **Issue:** Each cart item has `<input type="checkbox" checked disabled>` — always checked, always disabled. Appears to be intended for selective checkout but is never wired up.
- **Fix:** Remove the checkbox or implement selective checkout.

### 2.12 🟡 No "Add to Cart" success feedback
- **File:** `src/components/Products.vue` — `addToCart()` method
- **Issue:** After successfully posting to `/api/cart`, there is no toast, snackbar, or visual confirmation. Comment in code acknowledges this: "Success feedback could be added here."
- **Fix:** Add a toast notification on success.

### 2.13 🟡 Avatar stored as base64 in localStorage — not persistent
- **File:** `src/components/Profile.vue` — avatar upload
- **Issue:** User avatar is stored as a base64 string in `localStorage` under `customizations_{userId}`. It is never uploaded to the server. If the user clears browser data or logs in on another device, the avatar is lost.
- **Fix:** Upload avatar via `POST /api/upload` and store the URL in the `users` table.

### 2.14 🟡 Bio stored only in localStorage
- **File:** `src/components/Profile.vue`
- **Issue:** User bio is saved to `localStorage` per user ID. The backend `PUT /api/user` endpoint only accepts `name` and `password`. Bio is lost if browser data is cleared.
- **Fix:** Add a `bio` column to the `users` table.

### 2.15 🟡 User delete doesn't cascade — orphaned data
- **File:** `backend/server.cjs` — `DELETE /api/user` and `DELETE /api/admin/users/:id`
- **Issue:** Deleting a user only removes the `users` row. Associated data in `cart`, `orders`, `order_items`, `user_activities`, `posts`, `comments`, `post_likes`, `post_bookmarks`, `comment_likes`, `user_challenges` is **not cleaned up**, leading to orphaned rows and potential join errors.
- **Fix:** Add cascading deletes or delete associated data before the user row.

---

## 3. SECURITY ISSUES

### 3.1 🔴 JWT secret has insecure fallback
- **File:** `backend/server.cjs` ~line 15
- **Issue:** `const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'`. In production, if the env var is not set, all tokens are signed with a known, guessable secret.
- **Fix:** Require `JWT_SECRET` from environment and throw on startup if missing.

### 3.2 🔴 Google OAuth Client ID exposed in frontend source
- **File:** `src/components/Login.vue`, `src/components/Register.vue`
- **Issue:** Client ID `374788513993-...` is hardcoded. While Google Client IDs are semi-public, the `auth.js` store also sends the credential to the backend which does an HTTPS verification. However, this should still be in an env config / `.env` file.
- **Fix:** Move to `VITE_GOOGLE_CLIENT_ID` env variable.

### 3.3 🟡 Forum POST endpoint doesn't use `authenticateToken` middleware
- **File:** `backend/server.cjs` — `POST /api/posts` ~line 722
- **Issue:** Manually parses `Authorization` header and verifies JWT inside the handler instead of using the `authenticateToken` middleware. Same for `POST /api/posts/:id/like`, `POST /api/posts/:id/bookmark`, `POST /api/user-challenges`. This duplicates logic and may miss edge cases handled by the middleware.
- **Fix:** Use `authenticateToken` middleware consistently.

### 3.4 🟡 No rate limiting on auth endpoints
- **File:** `backend/server.cjs` — login/register routes
- **Issue:** No rate limiting on `POST /api/auth/login` or `POST /api/auth/register`. Brute-force attacks are possible.
- **Fix:** Add `express-rate-limit` middleware.

### 3.5 🟡 CORS not configured
- **File:** `backend/server.cjs`
- **Issue:** No CORS middleware. The frontend at `localhost:5173` may or may not be able to call the backend at `localhost:3000` depending on browser behavior. The `cors` package is not in `package.json`.
- **Fix:** Install and configure `cors` middleware with appropriate origin.

---

## 4. UI/UX ISSUES

### 4.1 🟡 Testimonial roles on Home page are not i18n-ized
- **File:** `src/components/Home.vue` ~lines 210-230
- **Issue:** `<span class="role">Eko Karotāja kopš 2024</span>`, `150 izaicinājumi pabeigti`, `Foruma moderatore` are hardcoded Latvian strings inside the template. When the app is in English, these remain in Latvian.
- **Fix:** Add i18n keys for testimonial roles.

### 4.2 🟡 Impact section stats are fake formulas
- **File:** `src/components/Home.vue` ~lines 115-140
- **Issue:** "Plastic Diverted" = `totalActivities / 10` tons, "Clean Energy" = `totalCo2Saved * 2` kWh. These are arbitrary multipliers with no real-world basis, presented as factual stats.
- **Fix:** Either derive from real data or label them clearly as estimates.

### 4.3 🟡 Admin Eco Score hardcoded to "92"
- **File:** `src/components/Admin.vue` — sidebar widget
- **Issue:** The Eco Score sidebar widget always shows "92" — not computed from any data.
- **Fix:** Compute from real metrics or remove.

### 4.4 🟡 Cart "Carbon Cost" always shows "0"
- **File:** `src/components/Cart.vue`
- **Issue:** The order summary displays a "Carbon Cost" line that is always `0`. No calculation exists.
- **Fix:** Calculate based on product lifecycle data or remove.

### 4.5 🟡 Challenges leaderboard data is hardcoded
- **File:** `src/components/Challenges.vue` ~lines 524-530
- **Issue:** Leaderboard shows 5 fake users ("EcoWarrior", "GreenQueen", etc.) with fake scores. One entry is marked `isYou: true` for "Tomass" regardless of who is logged in.
- **Fix:** Fetch from backend or clearly mark as demo data.

### 4.6 🟡 Footprint achievements not persisted
- **File:** `src/components/Footprint.vue`
- **Issue:** Achievements (First Step, Week Warrior, Carbon Cutter, etc.) are computed client-side from activities. They are recalculated on every load but never stored — no backend acknowledgement, no celebration history.
- **Fix:** Store unlocked achievements in a backend table.

### 4.7 🟢 Admin dashboard hardcodes dark theme — ignores app theme
- **File:** `src/components/Admin.vue` ~line 1380
- **Issue:** Admin page CSS uses `background: #0f1117`, `color: #e0e0e0` — a forced dark theme. If the user has light mode selected, the transition from the main app to admin is jarring. No CSS variables from the app theme are used.
- **Fix:** Use the app's CSS custom properties or provide a matching dark/light toggle.

### 4.8 🟢 Admin texts are not i18n-ized
- **File:** `src/components/Admin.vue`
- **Issue:** All admin UI text ("Dashboard", "Edit User", "Save Changes", etc.) is hardcoded English. The i18n locale files have `admin.*` keys, but Admin.vue never calls `t()`.
- **Fix:** Integrate `useI18n()` and use translation keys.

### 4.9 🟢 Eco impact calculations in Cart are arbitrary
- **File:** `src/components/Cart.vue`
- **Issue:** "Trees to Plant" = `subtotal / 10`, "CO₂ Saved" = `subtotal * 0.5` — price-based, not product-based. A €100 luxury item "plants" 10 trees.
- **Fix:** Use product-level eco data (`lifecycle_info` field exists but is unused here).

### 4.10 🟢 Monthly goal in Footprint is hardcoded to 100kg
- **File:** `src/components/Footprint.vue`
- **Issue:** `monthlyGoal` is a fixed value. Users cannot customize their goal.
- **Fix:** Allow users to set their own goal, stored in the backend.

### 4.11 🟢 Register password strength labels not i18n-ized
- **File:** `src/components/Register.vue` ~lines 340-350
- **Issue:** `passwordStrength` computed returns hardcoded English strings: `'Weak'`, `'Medium'`, `'Strong'`, `'Very Strong'`. The i18n keys `register.strength.weak` etc. exist but are unused.
- **Fix:** Use `this.t('register.strength.weak')` etc.

---

## 5. POTENTIAL UPGRADES

### 5.1 🟢 Replace `fetch` with Axios (already installed)
- **File:** `src/utils/axios.js` exists but is **unused**
- **Issue:** Every component uses raw `fetch('http://localhost:3000/...')` with hardcoded URLs. An Axios instance with `baseURL` and request interceptors for auth is set up in `utils/axios.js` but never imported anywhere.
- **Fix:** Use the Axios instance across all components for centralized error handling, auth header injection, and base URL configuration.

### 5.2 🟢 Consolidate auth header construction
- **Issue:** At least 15 places across components manually do `const token = localStorage.getItem('token')` + `headers: { 'Authorization': \`Bearer ${token}\` }`. This should be handled by an Axios interceptor.

### 5.3 🟢 Add server-side search endpoint
- **Issue:** Navbar global search fetches **all** products, **all** posts, and **all** education content, then filters client-side. For any non-trivial dataset, this will be slow.
- **Fix:** Add `GET /api/search?q=...` endpoint with SQL `LIKE` queries.

### 5.4 🟢 Add proper error boundary / global error handler
- **Issue:** API errors are handled inconsistently — some use `alert()`, some set `this.error`, some `console.error` only. No global error interceptor.

### 5.5 🟢 Add loading states for data-fetching components
- **Issue:** Home, Products, Forum, Footprint, and other components fetch data on mount without a loading indicator (skeleton screens, spinners). Cart has a loading state but others don't.

### 5.6 🟢 Add `.env` for configuration
- **Issue:** Backend port, JWT secret fallback, Google Client ID, API base URL are all hardcoded. No `.env` or `.env.example` file exists.
- **Fix:** Create `.env` files for both frontend (Vite) and backend with all configuration values.

### 5.7 🟢 Implement proper order items display
- **Issue:** `GET /api/orders` uses `GROUP_CONCAT` which flattens items into a single string. No endpoint to get individual order items.
- **Fix:** Add `GET /api/orders/:id/items` or return items as a nested array.

---

## 6. BACKEND-SPECIFIC ISSUES

### 6.1 🟡 No input sanitization / XSS protection
- **File:** `backend/server.cjs` — all POST endpoints
- **Issue:** User-supplied content (post titles, comments, product descriptions) is stored and returned as-is. No HTML escaping or sanitization.
- **Fix:** Use a library like `sanitize-html` or `DOMPurify` on the server, and use Vue's default text interpolation (already safe) on the client.

### 6.2 🟡 Excessive `console.log` in production code
- **File:** `backend/server.cjs` — register/login routes
- **Issue:** Debug logging with emojis (`console.log('🔍 REGISTER REQUEST RECEIVED:', req.body)`) including potentially sensitive data.
- **Fix:** Use a proper logger (e.g., `winston` or `pino`) with log levels.

### 6.3 🟡 SQLite `ALTER TABLE` statements run on every server start
- **File:** `backend/server.cjs` ~lines 85-200
- **Issue:** Multiple `ALTER TABLE ... ADD COLUMN` statements wrapped in `try/catch` run on every startup. While they don't break (duplicate column errors are caught), it's noisy and fragile.
- **Fix:** Use a migration system or check column existence before altering.

### 6.4 🟢 `PUT /api/user` doesn't use `authenticateToken` middleware
- **File:** `backend/server.cjs` ~line 1002
- **Issue:** Manually parses token instead of using the middleware, same as the forum endpoints.
- **Fix:** Add `authenticateToken` middleware.

### 6.5 🟢 `DELETE /api/user` doesn't use `authenticateToken` middleware
- **File:** `backend/server.cjs` ~line 1035
- **Fix:** Same as above.

---

## 7. SUMMARY OF 10 MOST CRITICAL FIXES

| # | Issue | Priority | Impact |
|---|-------|----------|--------|
| 1 | Challenges page unreachable (no route) | 🔴 | 1642 lines of dead code |
| 2 | Duplicate Home page feature cards | 🔴 | Visible bug for all users |
| 3 | Promo codes client-side + never applied at checkout | 🔴 | Security + broken feature |
| 4 | Admin self-delete guard broken (`userId` vs `id`) | 🔴 | Admin can accidentally delete self |
| 5 | JWT secret insecure fallback | 🔴 | All tokens compromisable |
| 6 | GitHub login stubs shown as real buttons | 🟡 | Misleading UX |
| 7 | Forgot Password link does nothing | 🔴 | Common user expectation broken |
| 8 | Notifications bell is empty shell | 🟡 | Feature appears broken |
| 9 | Education & Challenges ignore backend data | 🟡 | Content management impossible |
| 10 | Phone, Bio, Avatar not persisted to server | 🟡 | Data loss across sessions |

---

*End of audit report.*
