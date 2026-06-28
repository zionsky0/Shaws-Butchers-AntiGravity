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
// Google Apps Script for Shaw's Butchers
// Deployed as a Web App to handle order creations, status updates, and deletions securely.

var ADMIN_PASSWORD = "YOUR_SECURE_ADMIN_PASSWORD_HERE"; // Set your strong admin password here
var RECAPTCHA_SECRET = "YOUR_RECAPTCHA_SECRET_KEY_HERE"; // For storefront bot protection

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Exact Spreadsheet Column Mapping (1-based index)
    const COL_ORDER_ID = 1;      // Column A
    const COL_DATE = 2;          // Column B
    const COL_NAME = 3;          // Column C
    const COL_PHONE = 4;         // Column D
    const COL_EMAIL = 5;         // Column E
    const COL_ADDRESS = 6;       // Column F
    const COL_POSTCODE = 7;      // Column G
    const COL_COLL_DATE = 8;     // Column H
    const COL_COLL_TIME = 9;     // Column I
    const COL_ITEMS = 10;        // Column J
    const COL_TOTAL = 11;        // Column K
    const COL_NOTES = 12;        // Column L
    const COL_STATUS = 13;       // Column M
    
    if (action === "create") {
      // 1. Verify storefront order submission with Google reCAPTCHA (only if secret key is configured)
      const token = data.recaptchaToken;
      if (RECAPTCHA_SECRET && RECAPTCHA_SECRET !== "YOUR_RECAPTCHA_SECRET_KEY_HERE" && RECAPTCHA_SECRET !== "") {
        const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
        const response = UrlFetchApp.fetch(verificationUrl, {
          method: "post",
          payload: {
            secret: RECAPTCHA_SECRET,
            response: token
          }
        });
        const verification = JSON.parse(response.getContentText());
        if (!verification.success || verification.score < 0.5) {
          return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Bot verification failed" }))
                               .setMimeType(ContentService.MimeType.JSON);
        }
      }

      const order = data.order;
      const customer = order.customer || {};
      
      // Format items cleanly as plain text list
      const itemsList = (order.items || []).map(item => 
        `${item.name} (${item.qty}x${item.price.toFixed(2)}${item.unit || ''})`
      ).join("\n");
      
      // Append a new row to the spreadsheet matching your columns exactly
      sheet.appendRow([
        order.id,
        order.date,
        customer.name || "Unknown",
        customer.phone || "",
        customer.email || "",
        customer.address || "",
        customer.postcode || "",
        customer.collectionDate || "",
        customer.collectionTime || "",
        itemsList,
        order.total,
        customer.notes || "",
        order.status
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Order logged successfully" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === "updateStatus") {
      // 2. Enforce admin password verification for status updates
      if (data.password !== ADMIN_PASSWORD) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized" }))
                             .setMimeType(ContentService.MimeType.JSON);
      }

      const id = data.id;
      const status = data.status;
      const rows = sheet.getDataRange().getValues();
      let foundRowIndex = -1;
      
      for (let i = 1; i < rows.length; i++) { // Skip header row
        if (rows[i][COL_ORDER_ID - 1].toString() === id.toString()) {
          foundRowIndex = i + 1; // 1-based sheet row index
          break;
        }
      }
      
      if (foundRowIndex !== -1) {
        // Update status column (Column M)
        sheet.getRange(foundRowIndex, COL_STATUS).setValue(status);
        
        // Retrieve values for email notification
        const customerName = rows[foundRowIndex - 1][COL_NAME - 1];
        const customerEmail = rows[foundRowIndex - 1][COL_EMAIL - 1];
        const collectionDateRaw = rows[foundRowIndex - 1][COL_COLL_DATE - 1];
        const collectionTimeRaw = rows[foundRowIndex - 1][COL_COLL_TIME - 1];
        const totalRaw = rows[foundRowIndex - 1][COL_TOTAL - 1];
        
        // Handle dates formatting for email
        let collDateStr = collectionDateRaw;
        try {
          if (collectionDateRaw instanceof Date) {
            collDateStr = collectionDateRaw.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
          }
        } catch(e) {}
        
        // Format time cleanly (handling Google Sheets 1899 date string shift)
        let collTimeStr = collectionTimeRaw.toString();
        if (collTimeStr.includes('T') || (collectionTimeRaw instanceof Date)) {
          try {
            const timeDate = new Date(collectionTimeRaw);
            let hours = timeDate.getHours();
            const minutes = String(timeDate.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            collTimeStr = `${hours}:${minutes} ${ampm}`;
          } catch(e) {}
        }
        
        const totalVal = typeof totalRaw === 'number' ? totalRaw.toFixed(2) : totalRaw;
        
        // Send email automatically if marked "ready" and customer provided a valid email
        if (status.toLowerCase() === "ready" && customerEmail && customerEmail.includes("@")) {
          sendOrderReadyEmail(customerEmail, customerName, id, collDateStr, collTimeStr, totalVal);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Status updated successfully" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Order ID not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === "delete") {
      // 3. Enforce admin password verification for order deletions
      if (data.password !== ADMIN_PASSWORD) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized" }))
                             .setMimeType(ContentService.MimeType.JSON);
      }

      const id = data.id;
      const rows = sheet.getDataRange().getValues();
      let foundRowIndex = -1;
      
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][COL_ORDER_ID - 1].toString() === id.toString()) {
          foundRowIndex = i + 1;
          break;
        }
      }
      
      if (foundRowIndex !== -1) {
        sheet.deleteRow(foundRowIndex);
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Order deleted successfully" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Order ID not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET handler to return all orders from sheet (Polled by admin dashboard)
function doGet(e) {
  try {
    // 4. Enforce admin password verification for administrative reads (GET)
    var password = e.parameter.password;
    if (password !== ADMIN_PASSWORD) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    const orders = [];
    
    // Exact Spreadsheet Column Mapping (0-based JS index)
    const COL_ORDER_ID = 0;      // Column A
    const COL_DATE = 1;          // Column B
    const COL_NAME = 2;          // Column C
    const COL_PHONE = 3;         // Column D
    const COL_EMAIL = 4;         // Column E
    const COL_ADDRESS = 5;       // Column F
    const COL_POSTCODE = 6;      // Column G
    const COL_COLL_DATE = 7;     // Column H
    const COL_COLL_TIME = 8;     // Column I
    const COL_ITEMS = 9;         // Column J
    const COL_TOTAL = 10;        // Column K
    const COL_NOTES = 11;        // Column L
    const COL_STATUS = 12;       // Column M
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[COL_ORDER_ID]) continue;
      
      // Parse items back into array structure
      const itemsText = row[COL_ITEMS] || "";
      const items = [];
      if (itemsText) {
        const lines = itemsText.split("\n");
        lines.forEach(line => {
          if (line) {
            const nameMatch = line.match(/^([^(]+)/);
            const qtyMatch = line.match(/\((\d+)x/);
            const priceMatch = line.match(/x([\d.]+)/);
            const unitMatch = line.match(/x[\d.]+(\/[a-z]+)?\)/);
            
            const name = nameMatch ? nameMatch[1].trim() : line;
            const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
            const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
            const unit = unitMatch && unitMatch[1] ? unitMatch[1] : "";
            
            items.push({ name, qty, price, unit });
          }
        });
      }
      
      orders.push({
        id: row[COL_ORDER_ID].toString(),
        date: row[COL_DATE],
        status: row[COL_STATUS] || "pending",
        customer: {
          name: row[COL_NAME],
          phone: row[COL_PHONE],
          email: row[COL_EMAIL],
          address: row[COL_ADDRESS],
          postcode: row[COL_POSTCODE],
          collectionDate: row[COL_COLL_DATE],
          collectionTime: row[COL_COLL_TIME],
          notes: row[COL_NOTES]
        },
        items: items,
        total: parseFloat(row[COL_TOTAL]) || 0
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify(orders))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to generate and send a premium email notification
function sendOrderReadyEmail(toEmail, customerName, orderId, collectionDate, collectionTime, total) {
  const subject = `Your Shaw's Butchers Order is Ready! (Order #${orderId})`;
  
  // HTML Template for premium email layout
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <!-- Header -->
      <div style="background-color: #8B1A1A; padding: 2rem; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 1.8rem; font-weight: bold; letter-spacing: 1px;">Shaw's Family Butchers</h1>
        <p style="margin: 0.5rem 0 0; opacity: 0.85; font-size: 0.95rem;">Premium Quality Cuts & Family Values</p>
      </div>
      
      <!-- Body -->
      <div style="padding: 2.5rem 2rem; background-color: #ffffff; color: #374151; line-height: 1.6;">
        <h2 style="color: #8B1A1A; margin-top: 0; font-size: 1.4rem; border-bottom: 2px solid #f3f4f6; padding-bottom: 0.75rem;">Your Order is Ready for Collection!</h2>
        
        <p>Hi <strong>${customerName}</strong>,</p>
        <p>Great news! Our butchers have finished preparing, wrapping, and indexing your order. It is now safely stored in our chillers and ready for you to pick up.</p>
        
        <!-- Summary Box -->
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 1.25rem; margin: 1.5rem 0;">
          <h3 style="margin-top: 0; color: #111827; font-size: 1.05rem; font-weight: bold; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem;">Collection Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem;">
            <tr>
              <td style="padding: 0.4rem 0; color: #6b7280; font-weight: 500; width: 130px;">Order ID:</td>
              <td style="padding: 0.4rem 0; color: #111827; font-weight: 700;">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 0.4rem 0; color: #6b7280; font-weight: 500;">Collection Date:</td>
              <td style="padding: 0.4rem 0; color: #111827; font-weight: bold;">${collectionDate}</td>
            </tr>
            <tr>
              <td style="padding: 0.4rem 0; color: #6b7280; font-weight: 500;">Collection Time:</td>
              <td style="padding: 0.4rem 0; color: #111827; font-weight: bold;">${collectionTime}</td>
            </tr>
            <tr>
              <td style="padding: 0.4rem 0; color: #6b7280; font-weight: 500; border-top: 1px dashed #e5e7eb; padding-top: 0.5rem;">Estimated Total:</td>
              <td style="padding: 0.4rem 0; color: #8B1A1A; font-weight: 900; font-size: 1.1rem; border-top: 1px dashed #e5e7eb; padding-top: 0.5rem;">£${total}</td>
            </tr>
          </table>
        </div>
        
        <p style="background-color: #fffbeb; border-left: 4px solid #F59E0B; padding: 1rem; border-radius: 4px; color: #92400e; font-size: 0.9rem; margin: 1.5rem 0;">
          📌 <strong>Address:</strong> Visit us at our shop to pick up and complete payment.<br>
          📞 Need to make changes? Call us directly on <strong>01928 561869</strong>.
        </p>
        
        <p style="margin-bottom: 0;">Thanks for choosing Shaw's Family Butchers!</p>
        <p style="margin-top: 0.25rem;"><strong>The Shaw's Family</strong></p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f3f4f6; padding: 1.5rem; text-align: center; font-size: 0.8rem; color: #9ca3af; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0;">Shaw's Family Butchers, Runcorn, UK</p>
        <p style="margin: 0.25rem 0 0;">This is an automated notification. Please do not reply directly to this email.</p>
      </div>
    </div>
  `;
  
  // Plain text fallback
  const textBody = `Hi ${customerName},\n\n` +
    `Good news! Your order is ready for pickup at Shaw's Family Butchers.\n\n` +
    `Collection details:\n` +
    `- Order ID: #${orderId}\n` +
    `- Date: ${collectionDate}\n` +
    `- Time: ${collectionTime}\n` +
    `- Total: £${total}\n\n` +
    `If you need to make changes, call us on 01928 561869.\n\n` +
    `Thanks for choosing Shaw's Family Butchers!`;
    
  MailApp.sendEmail({
    to: toEmail,
    subject: subject,
    body: textBody,
    htmlBody: htmlBody
  });
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
