// ===== GLOBAL CONFIGURATION =====
// Stores the Google Sheets Web App URL and WhatsApp number for synchronized ordering.
// Hardcode your values here to share them globally with all customers and devices.
const DEFAULT_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxAnO4WXLMHAPO6wd3lbi3NOD9WA_ym8BfRUeFXI4VX5RBI3J7r4atIqQ7xyN2p43oEIg/exec";
const DEFAULT_WHATSAPP_NUMBER = "07361808431";
const DEFAULT_RECAPTCHA_SITE_KEY = "YOUR_RECAPTCHA_SITE_KEY_HERE";

window.GLOBAL_CONFIG = {
  googleSheetUrl: localStorage.getItem('shaws_google_sheet_url') || DEFAULT_GOOGLE_SHEET_URL || "",
  whatsappNumber: localStorage.getItem('shaws_whatsapp_number') || DEFAULT_WHATSAPP_NUMBER || "",
  recaptchaSiteKey: localStorage.getItem('shaws_recaptcha_site_key') || DEFAULT_RECAPTCHA_SITE_KEY || ""
};
