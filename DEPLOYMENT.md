# Production Deployment & Security Setup Guide

This guide details all necessary step-by-step actions to successfully configure, secure, and deploy the **Shaw's Butchers** storefront and admin system to production.

---

## Step 1: Firebase Project Configuration

### 1. Register a verified Admin Email
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project and navigate to **Build > Authentication > Users**.
3. Create an email/password account for **`dan@shawsbutchers.net`**.
4. Make sure this email is verified (either verify via email link or check verification status in the user record using admin tools).

### 2. Connect Your Custom Domain
1. In the Firebase Console, go to **Build > Hosting**.
2. Click **Add custom domain**.
3. Enter your domain details (e.g. `shawsbutchers.net`) and add the generated `TXT` and `A` records to your domain DNS manager (e.g., GoDaddy, Namecheap).
4. Firebase will automatically provision an SSL certificate for your domain within a few hours.

---

## Step 2: Restrict Google Cloud API Keys

By default, Firebase web app API keys are public. You must restrict them in the Google Cloud Console to prevent others from using them on unauthorized domains.

1. Open the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Locate the API key used by your Firebase web app (usually named *Browser key* or *Android/iOS/Web Key*).
3. Click on the key name to edit settings:
   - **Application restrictions**: Select **Websites (HTTP referrers)** and add:
     * `https://shawsbutchers.net/*`
     * `https://*.shawsbutchers.net/*`
     * `http://localhost:*/*` (for local development testing)
   - **API restrictions**: Select **Restrict key** and choose only:
     * *Google Cloud Firestore*
     * *Identity Toolkit API*
     * *Token Service API*
4. Click **Save**.

---

## Step 3: Configure Firebase App Check (Anti-Spam)

App Check enforces that only your actual website can write orders into your Firestore database.

### 1. Generate reCAPTCHA v3 Keys
1. Go to the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin).
2. Register a new site:
   - **Type**: reCAPTCHA v3
   - **Domains**: Add `shawsbutchers.net` and `localhost` (for testing).
3. Copy the **Site Key** and **Secret Key**.

### 2. Add Site Key to the Frontend Code
1. Open [js/firebase-config.js](file:///Users/zionsky/VSC%20Projects/Shaws%20Butchers%20AntiGravity%20Project/js/firebase-config.js).
2. Replace `'YOUR_RECAPTCHA_KEY'` (around line 28) with your reCAPTCHA **Site Key**:
   ```javascript
   new firebase.appCheck.ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
   ```

### 3. Register App Check in Firebase Console
1. Navigate to **Build > App Check** in the Firebase Console.
2. Click **Register** next to your Web App.
3. Select **reCAPTCHA v3** and paste your reCAPTCHA **Secret Key** (Private Key).
4. Save the registration.

---

## Step 4: Disable Local Admin Bypass

To prevent anyone from using the browser console to set the `shaws_admin_session` flag to `true` and accessing local fallback settings, make Firebase sync mandatory.

1. Open [admin/js/admin.js](file:///Users/zionsky/VSC%20Projects/Shaws%20Butchers%20AntiGravity%20Project/admin/js/admin.js).
2. Ensure `window.firebaseEnabled` is forced to `true` in production, or disable/delete the fallback credentials checking around lines 381-395:
   ```javascript
   // Disable local mode fallbacks in production:
   const checkAuth = () => {
     if (window.firebaseEnabled && window.auth) {
       return window.auth.currentUser !== null;
     }
     return false; // Force Firebase authentication check
   };
   ```
3. Remove the fallback password constant line 13:
   `const DEFAULT_PASSWORD = 'shaws2024';` (delete this line).

---

## Step 5: Secure the Google Sheets Integration

The Google Sheets Web App URL is exposed in client-side script [js/config.js](file:///Users/zionsky/VSC%20Projects/Shaws%20Butchers%20AntiGravity%20Project/js/config.js). To prevent someone from spamming rows into your spreadsheet directly:

1. Define a secure webhook token in [js/cart.js](file:///Users/zionsky/VSC%20Projects/Shaws%20Butchers%20AntiGravity%20Project/js/cart.js) when POSTing:
   ```javascript
   fetch(sheetUrl, {
     method: 'POST',
     headers: {
       'X-Sync-Token': 'YOUR_SECRET_TOKEN_HERE'
     },
     body: JSON.stringify({ action: "create", order: order })
   })
   ```
2. Open your Apps Script Editor in Google Sheets and update the `doPost(e)` trigger to check for the validation token:
   ```javascript
   function doPost(e) {
     var headers = e.parameter || {};
     // Or retrieve header token from JSON payload
     var payload = JSON.parse(e.postData.contents);
     if (payload.token !== "YOUR_SECRET_TOKEN_HERE") {
       return ContentService.createTextOutput("Unauthorized").setMimeType(ContentService.MimeType.TEXT);
     }
     // Process order writing code...
   }
   ```

---

## Step 6: Deploy static files to Firebase Hosting

### 1. Initialize Firebase Hosting in root directory
If you haven't initialized hosting, run this inside the repository folder:
```bash
firebase init hosting
```
- Select your Firebase Project.
- Directory name: `.` (representing root directory).
- Single-page application: **No**.
- Overwrite index.html: **No**.

### 2. Deploy Firestore Rules
Update the cloud rules with your locally hardened [firestore.rules](file:///Users/zionsky/VSC%20Projects/Shaws%20Butchers%20AntiGravity%20Project/firestore.rules):
```bash
firebase deploy --only firestore:rules
```

### 3. Deploy Frontend Web App
Deploy the storefront and admin files:
```bash
firebase deploy --only hosting
```
Once deployment completes, the CLI will output your live URL (e.g. `https://shawsbutchers.web.app` or `https://shawsbutchers.firebaseapp.com`).
