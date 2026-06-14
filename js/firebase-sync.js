import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Helper to check and retrieve the configuration
const getFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem('shaws_firebase_config');
    if (saved) {
      const config = JSON.parse(saved);
      if (config.apiKey && config.projectId) {
        return config;
      }
    }
  } catch (e) {
    console.error("Error loading saved Firebase config:", e);
  }

  // Fallback to the hardcoded config file configuration
  if (window.DEFAULT_FIREBASE_CONFIG && window.DEFAULT_FIREBASE_CONFIG.apiKey) {
    return window.DEFAULT_FIREBASE_CONFIG;
  }
  
  return null;
};

const config = getFirebaseConfig();

window.FirebaseSync = {
  active: false,
  db: null
};

if (config) {
  try {
    const app = initializeApp(config);
    const db = getFirestore(app);

    window.FirebaseSync = {
      active: true,
      db: db,

      // Sync/save an order
      addOrder: async (order) => {
        try {
          await setDoc(doc(db, "shaws_orders", order.id), order);
          console.log(`[FirebaseSync] Order #${order.id} synced successfully.`);
        } catch (e) {
          console.error(`[FirebaseSync] Failed to sync order #${order.id}:`, e);
        }
      },

      // Update status of an order
      updateOrderStatus: async (orderId, status) => {
        try {
          const orderRef = doc(db, "shaws_orders", orderId);
          await updateDoc(orderRef, { status: status });
          console.log(`[FirebaseSync] Order #${orderId} status updated to ${status}.`);
        } catch (e) {
          console.error(`[FirebaseSync] Failed to update order #${orderId} status:`, e);
        }
      },

      // Delete an order
      deleteOrder: async (orderId) => {
        try {
          await deleteDoc(doc(db, "shaws_orders", orderId));
          console.log(`[FirebaseSync] Order #${orderId} deleted successfully.`);
        } catch (e) {
          console.error(`[FirebaseSync] Failed to delete order #${orderId}:`, e);
        }
      },

      // Setup a realtime database listener
      listenToOrders: (onUpdateSuccess) => {
        const q = query(collection(db, "shaws_orders"), orderBy("date", "asc"));
        return onSnapshot(q, (snapshot) => {
          const orders = [];
          snapshot.forEach((doc) => {
            orders.push(doc.data());
          });
          onUpdateSuccess(orders);
        }, (error) => {
          console.error("[FirebaseSync] Error listening to orders collection:", error);
        });
      }
    };

    console.log("Firebase Live Sync loaded successfully.");
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
} else {
  console.log("Firebase is not configured. Running in local-only demo mode.");
}
