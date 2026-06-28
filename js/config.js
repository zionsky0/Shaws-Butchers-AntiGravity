// ===== GLOBAL CONFIGURATION =====
// Stores the Google Sheets Web App URL and WhatsApp number for synchronized ordering.
// Hardcode your values here to share them globally with all customers and devices.
const DEFAULT_GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwvjda-m8iuUPg_Y39LRpbuAOVDprZhL4pnqLf-sXQtsDVuDWe9geHb56oAisFV3c8pMg/exec";
const DEFAULT_WHATSAPP_NUMBER = "07361808431";

window.GLOBAL_CONFIG = {
  googleSheetUrl: localStorage.getItem('shaws_google_sheet_url') || DEFAULT_GOOGLE_SHEET_URL || "https://script.google.com/macros/s/AKfycbwvjda-m8iuUPg_Y39LRpbuAOVDprZhL4pnqLf-sXQtsDVuDWe9geHb56oAisFV3c8pMg/exec",
  whatsappNumber: localStorage.getItem('shaws_whatsapp_number') || DEFAULT_WHATSAPP_NUMBER || ""
};
