// ===== GLOBAL CONFIGURATION =====
// Stores the Google Sheets Web App URL and WhatsApp number for synchronized ordering.
window.GLOBAL_CONFIG = {
  googleSheetUrl: localStorage.getItem('shaws_google_sheet_url') || "",
  whatsappNumber: localStorage.getItem('shaws_whatsapp_number') || ""
};
