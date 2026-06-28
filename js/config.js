// ===== GLOBAL CONFIGURATION =====
// Stores the Google Sheets Web App URL and WhatsApp number for synchronized ordering.
// Hardcode your values here to share them globally with all customers and devices.
const DEFAULT_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbziabGZ85CEfyngAAuj0E0QM8GxcDcslhRRFK9fsf8mlM139HS7gJucqS0hUo6EpOURgw/exec";
const DEFAULT_WHATSAPP_NUMBER = "07361808431";
const DEFAULT_RECAPTCHA_SITE_KEY = "6LeCpjotAAAAAGUKeMrrGxMQhKQmw0F7rqGTUU4n";

window.GLOBAL_CONFIG = {
  googleSheetUrl: localStorage.getItem('shaws_google_sheet_url') || DEFAULT_GOOGLE_SHEET_URL || "",
  whatsappNumber: localStorage.getItem('shaws_whatsapp_number') || DEFAULT_WHATSAPP_NUMBER || "",
  recaptchaSiteKey: localStorage.getItem('shaws_recaptcha_site_key') || DEFAULT_RECAPTCHA_SITE_KEY || ""
};
