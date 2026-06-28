// ===== GLOBAL CONFIGURATION =====
// Stores the Google Sheets Web App URL and WhatsApp number for synchronized ordering.
// Hardcode your values here to share them globally with all customers and devices.
const DEFAULT_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwbfkfKcRJKIVmFwEPK9jdQkTRWFfd_Jsbs_lqRbIr6VtynodEu8GZR9xGifBsoRwdhkw/exec";
const DEFAULT_WHATSAPP_NUMBER = "07361808431";
const DEFAULT_RECAPTCHA_SITE_KEY = "6LeCpjotAAAAAGUKeMrrGxMQhKQmw0F7rqGTUU4n";

const cleanStorageValue = (key, defaultVal) => {
  const val = localStorage.getItem(key);
  if (!val || val.includes("YOUR_")) return defaultVal || "";
  return val;
};

window.GLOBAL_CONFIG = {
  googleSheetUrl: cleanStorageValue('shaws_google_sheet_url', DEFAULT_GOOGLE_SHEET_URL),
  whatsappNumber: cleanStorageValue('shaws_whatsapp_number', DEFAULT_WHATSAPP_NUMBER),
  recaptchaSiteKey: cleanStorageValue('shaws_recaptcha_site_key', DEFAULT_RECAPTCHA_SITE_KEY)
};
