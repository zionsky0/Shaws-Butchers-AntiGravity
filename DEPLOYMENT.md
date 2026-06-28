# Production Deployment & Security Setup Guide (Google Sheets Setup)

This guide details all necessary step-by-step actions to successfully configure, secure, and deploy the **Shaw's Butchers** storefront and admin system to production using a serverless Google Sheets & Local Storage architecture.

---

## Step 1: Secure the Google Sheets Integration

Since we are not using Firebase, we must secure the Google Sheets Apps Script Web App URL from public script spam and unauthorized administrative reads/writes.

### 1. Storefront Order Spam Mitigation (Google reCAPTCHA v3)
We verify order requests dynamically using reCAPTCHA v3 scores:
1. Include the reCAPTCHA script tag in the `<head>` of [basket.html](file:///Users/zionsky/VSC%20Projects/Shaws%20Butchers%20AntiGravity%20Project/basket.html):
   ```html
   <script src="https://www.google.com/recaptcha/api.js?render=YOUR_RECAPTCHA_SITE_KEY"></script>
   ```
2. Open [js/cart.js](file:///Users/zionsky/VSC%20Projects/Shaws%20Butchers%20AntiGravity%20Project/js/cart.js), search for `YOUR_RECAPTCHA_SITE_KEY` (around line 660), and replace it with your Google reCAPTCHA v3 Site Key.
3. Validate the token in Google Sheets Apps Script before appending the order row (see script template below).

### 2. Admin Panel Security (Secret Password)
Instead of storing password hashes in client repository files, we require the password for GET (fetching orders) and POST (updating order status, deleting orders) actions:
1. The admin logs in via the admin panel. The page verifies the password by fetching `sheetUrl?password=...`.
2. The password is kept in browser `sessionStorage` (or `localStorage` if "Remember Me" is checked) and sent with all subsequent GET (`fetchOrdersFromSheet`) and POST requests.
3. The Apps Script rejects any request that lacks the matching password.

---

## Step 2: Google Sheets Apps Script Security Template

Replace the script in your Google Sheets Apps Script Editor (**Extensions > Apps Script**) with this boilerplate code. Make sure to define a strong `ADMIN_PASSWORD` and register a `RECAPTCHA_SECRET` key from the Google reCAPTCHA admin panel:

```javascript
var ADMIN_PASSWORD = "YOUR_SECURE_ADMIN_PASSWORD_HERE"; // Keep this safe on Google's servers
var RECAPTCHA_SECRET = "YOUR_RECAPTCHA_SECRET_KEY_HERE"; // For storefront bot protection

function doGet(e) {
  var password = e.parameter.password;
  
  // 1. Enforce password verification for administrative GET requests
  if (password !== ADMIN_PASSWORD) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized" }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 2. Fetch and return orders from sheet
  var orders = getOrdersFromSheet(); 
  return ContentService.createTextOutput(JSON.stringify(orders))
                       .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    
    // CASE A: Storefront customer order creation (requires reCAPTCHA v3 verification)
    if (payload.action === "create") {
      var response = UrlFetchApp.fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "post",
        payload: {
          secret: RECAPTCHA_SECRET,
          response: payload.recaptchaToken
        }
      });
      var verification = JSON.parse(response.getContentText());
      if (!verification.success || verification.score < 0.5) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Verification failed" }))
                             .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Save order to spreadsheet...
      writeOrderToSheet(payload.order);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    // CASE B: Administrative sync actions (requires Admin Password verification)
    if (payload.action === "updateStatus" || payload.action === "delete") {
      if (payload.password !== ADMIN_PASSWORD) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized" }))
                             .setMimeType(ContentService.MimeType.JSON);
      }
      
      if (payload.action === "updateStatus") {
        updateOrderStatusInSheet(payload.id, payload.status);
      } else if (payload.action === "delete") {
        deleteOrderFromSheet(payload.id);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Step 3: Deployment Options

Since the application consists of static files only, it can be hosted for free.

### Option A: Local-Only Administration
The owner can open the admin panel offline without publishing it to the internet:
1. Save the `admin` folder on a local device.
2. Double-click [admin/index.html](file:///Users/zionsky/VSC%20Projects/Shaws%20Butchers%20AntiGravity%20Project/admin/index.html) to run it locally in the browser.
3. Note: A local web server (like VS Code Live Server, or `npx http-server`) must be used to bypass CORS restrictions when making requests to Google Sheets.

### Option B: Hosted Securely on a Hidden Path
You can deploy the entire site for free to hosting providers like **Vercel**, **Netlify**, or **GitHub Pages**:
1. Connect your Git repository (public or private) to Vercel/Netlify.
2. Store storefront pages on the root domain (`https://shawsbutchers.net`).
3. Place the admin panel inside a hidden/private subfolder (e.g. `https://shawsbutchers.net/secret-dan-admin/`).
4. Since the URL is private, bots will not find or scan it.

---

## Step 4: Add Admin Panel to Mobile Homescreen (PWA)

To make the admin panel open in fullscreen mode (hiding the browser search bar) with a custom launcher icon:

1. Add these tags inside the `<head>` of [admin/index.html](file:///Users/zionsky/VSC%20Projects/Shaws%20Butchers%20AntiGravity%20Project/admin/index.html):
   ```html
   <!-- Mobile App Configuration -->
   <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
   <meta name="apple-mobile-web-app-title" content="Shaws Admin">
   <link rel="apple-touch-icon" href="../logo.png">
   <link rel="manifest" href="manifest.json">
   ```

2. Create `admin/manifest.json` with this configuration:
   ```json
   {
     "name": "Shaw's Butchers Admin",
     "short_name": "Shaws Admin",
     "start_url": "index.html",
     "display": "standalone",
     "background_color": "#111827",
     "theme_color": "#8B1A1A",
     "icons": [
       {
         "src": "../logo.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

3. Open the hosted hidden URL in Safari (iOS) or Chrome (Android) and tap **Add to Home Screen**.
