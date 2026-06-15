// ===== SHAW'S BUTCHERS - Shopping Basket System =====

const Cart = (() => {
  const STORAGE_KEY = 'shaws_basket';

  // ---------- State ----------
  let items = [];

  // ---------- Helpers ----------
  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const load = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      items = data ? JSON.parse(data) : [];
    } catch {
      items = [];
    }
  };

  const generateId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // ---------- Cart Operations ----------
  const getItems = () => [...items];

  const getCount = () => items.reduce((sum, item) => sum + item.qty, 0);

  const getTotal = () => items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const addItem = (name, price, unit, image) => {
    const id = generateId(name);
    const existing = items.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id, name, price: parseFloat(price), unit, qty: 1, image: image || '' });
    }
    save();
    updateUI();
    showNotification(name);
  };

  const removeItem = (id) => {
    items = items.filter(item => item.id !== id);
    save();
    updateUI();
  };

  const updateQty = (id, qty) => {
    const item = items.find(item => item.id === id);
    if (item) {
      item.qty = Math.max(1, parseInt(qty) || 1);
      save();
      updateUI();
    }
  };

  const incrementQty = (id) => {
    const item = items.find(item => item.id === id);
    if (item) {
      item.qty += 1;
      save();
      updateUI();
    }
  };

  const decrementQty = (id) => {
    const item = items.find(item => item.id === id);
    if (item) {
      if (item.qty <= 1) {
        removeItem(id);
      } else {
        item.qty -= 1;
        save();
        updateUI();
      }
    }
  };

  const clear = () => {
    items = [];
    save();
    updateUI();
  };

  // ---------- UI Updates ----------
  const updateUI = () => {
    updateBadge();
    updateSidebar();
    updateBasketPage();
  };

  const updateBadge = () => {
    const badges = document.querySelectorAll('.cart-badge');
    const count = getCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  };

  // ---------- Notification ----------
  const showNotification = (name) => {
    // Remove existing notification
    const existing = document.querySelector('.cart-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <span><strong>${name}</strong> added to basket</span>
    `;
    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2500);
  };

  // ---------- Sidebar ----------
  const createSidebar = () => {
    if (document.querySelector('.cart-sidebar')) return;

    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'cart-sidebar-overlay';
    sidebarOverlay.addEventListener('click', closeSidebar);

    const sidebar = document.createElement('div');
    sidebar.className = 'cart-sidebar';
    sidebar.innerHTML = `
      <div class="cart-sidebar-header">
        <h3>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Your Basket
        </h3>
        <button class="cart-sidebar-close" aria-label="Close basket">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="cart-sidebar-body"></div>
      <div class="cart-sidebar-footer"></div>
    `;

    document.body.appendChild(sidebarOverlay);
    document.body.appendChild(sidebar);

    sidebar.querySelector('.cart-sidebar-close').addEventListener('click', closeSidebar);
  };

  const openSidebar = () => {
    createSidebar();
    updateSidebar();
    requestAnimationFrame(() => {
      document.querySelector('.cart-sidebar').classList.add('open');
      document.querySelector('.cart-sidebar-overlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  };

  const closeSidebar = () => {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  const updateSidebar = () => {
    const body = document.querySelector('.cart-sidebar-body');
    const footer = document.querySelector('.cart-sidebar-footer');
    if (!body || !footer) return;

    if (items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <p>Your basket is empty</p>
          <a href="beef.html" class="btn btn--primary btn--sm">Start Shopping</a>
        </div>
      `;
      footer.innerHTML = '';
      return;
    }

    body.innerHTML = items.map(item => `
      <div class="cart-sidebar-item" data-id="${item.id}">
        <div class="cart-sidebar-item-info">
          <h4>${item.name}</h4>
          <span class="cart-sidebar-item-price">£${item.price.toFixed(2)} <small>${item.unit}</small></span>
        </div>
        <div class="cart-sidebar-item-controls">
          <div class="qty-controls">
            <button class="qty-btn qty-dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn qty-inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <span class="cart-sidebar-item-subtotal">£${(item.price * item.qty).toFixed(2)}</span>
          <button class="cart-sidebar-item-remove" data-id="${item.id}" aria-label="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    footer.innerHTML = `
      <div class="cart-sidebar-total">
        <span>Total (${getCount()} item${getCount() !== 1 ? 's' : ''})</span>
        <strong>£${getTotal().toFixed(2)}</strong>
      </div>
      <p class="cart-sidebar-notice">Prices are for guidance — final price may vary by weight.</p>
      <a href="basket.html" class="btn btn--primary cart-sidebar-checkout">
        View Basket & Checkout
      </a>
      <button class="btn btn--outline btn--sm cart-sidebar-clear" style="width:100%;margin-top:0.5rem;">Clear Basket</button>
    `;

    // Attach event listeners
    body.querySelectorAll('.qty-dec').forEach(btn => {
      btn.addEventListener('click', () => decrementQty(btn.dataset.id));
    });
    body.querySelectorAll('.qty-inc').forEach(btn => {
      btn.addEventListener('click', () => incrementQty(btn.dataset.id));
    });
    body.querySelectorAll('.cart-sidebar-item-remove').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });
    footer.querySelector('.cart-sidebar-clear')?.addEventListener('click', () => {
      if (confirm('Remove all items from your basket?')) clear();
    });
  };

  // ---------- Basket Page ----------
  const updateBasketPage = () => {
    const basketContainer = document.querySelector('.basket-page-content');
    if (!basketContainer) return;

    if (items.length === 0) {
      basketContainer.innerHTML = `
        <div class="basket-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <h2>Your basket is empty</h2>
          <p>Browse our range and add some products to get started.</p>
          <a href="beef.html" class="btn btn--primary">Browse Our Shop</a>
        </div>
      `;
      return;
    }

    // Load saved customer details to pre-fill the form
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem('shaws_customer_details') || '{}');
    } catch (err) {
      console.warn("Failed to load saved customer details", err);
    }

    basketContainer.innerHTML = `
      <div class="basket-layout">
        <div class="basket-items">
          <div class="basket-table-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span></span>
          </div>
          ${items.map(item => `
            <div class="basket-item" data-id="${item.id}">
              <div class="basket-item-name">
                <h4>${item.name}</h4>
              </div>
              <div class="basket-item-price">£${item.price.toFixed(2)} <small>${item.unit}</small></div>
              <div class="basket-item-qty">
                <div class="qty-controls">
                  <button class="qty-btn qty-dec" data-id="${item.id}">−</button>
                  <span class="qty-value">${item.qty}</span>
                  <button class="qty-btn qty-inc" data-id="${item.id}">+</button>
                </div>
              </div>
              <div class="basket-item-subtotal">£${(item.price * item.qty).toFixed(2)}</div>
              <button class="basket-item-remove" data-id="${item.id}" aria-label="Remove">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          `).join('')}
        </div>
        <div class="basket-summary">
          <h3>Order Summary</h3>
          <div class="basket-summary-row">
            <span>Items (${getCount()})</span>
            <span>£${getTotal().toFixed(2)}</span>
          </div>
          <div class="basket-summary-row basket-summary-total">
            <span>Estimated Total</span>
            <strong>£${getTotal().toFixed(2)}</strong>
          </div>
          <p class="basket-summary-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Prices are for guidance only and may vary slightly depending on weight.
          </p>
          <div class="basket-summary-notice-order">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            We need at least 1 day's notice. Order today and it will be ready tomorrow.
          </div>

          <h3 class="basket-checkout-title">Complete Your Order</h3>
          <form class="basket-checkout-form" id="checkout-form">
            <div class="form-group">
              <label>Full Name <span class="required">*</span></label>
              <input type="text" class="form-input" name="name" required value="${saved.name || ''}">
            </div>
            <div class="form-group">
              <label>Phone Number <span class="required">*</span></label>
              <input type="tel" class="form-input" name="phone" required value="${saved.phone || ''}">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-input" name="email" value="${saved.email || ''}">
            </div>
            <div class="form-group">
              <label>Address <span class="required">*</span></label>
              <input type="text" class="form-input" name="address" required placeholder="E.g. 39 Church Street" value="${saved.address || ''}">
            </div>
            <div class="form-group">
              <label>Postcode <span class="required">*</span></label>
              <input type="text" class="form-input" name="postcode" required placeholder="E.g. WA7 1LX" value="${saved.postcode || ''}">
            </div>
            <div class="form-group">
              <label>Collection Date <span class="required">*</span></label>
              <input type="date" class="form-input" name="date" required>
            </div>
            <div class="form-group">
              <label>Collection Time <span class="required">*</span></label>
              <select class="form-input" name="time" required>
                <option value="">Select a date first</option>
              </select>
            </div>
            <div class="form-group">
              <label>Special Instructions</label>
              <textarea class="form-input" name="notes" rows="3" placeholder="E.g. cut thickness, specific weights, etc."></textarea>
            </div>
            <button type="submit" class="btn btn--primary form-submit">Place Order</button>
          </form>

          <button class="btn btn--outline btn--sm basket-clear-all" style="width:100%;margin-top:1rem;">Clear Basket</button>
        </div>
      </div>
    `;

    // Set min date to tomorrow and handle validation / time options based on hours
    const dateInput = basketContainer.querySelector('input[name="date"]');
    const timeSelect = basketContainer.querySelector('select[name="time"]');
    if (dateInput && timeSelect) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // If tomorrow is Sunday, advance to Monday
      if (tomorrow.getDay() === 0) {
        tomorrow.setDate(tomorrow.getDate() + 1);
      }
      
      const minDateStr = tomorrow.toISOString().split('T')[0];
      dateInput.min = minDateStr;
      dateInput.value = minDateStr;

      const format12Hour = (hour, minutes) => {
        const ampm = hour >= 12 ? 'pm' : 'am';
        let hour12 = hour % 12;
        if (hour12 === 0) hour12 = 12;
        const minStr = minutes === 0 ? '00' : minutes.toString();
        return `${hour12}:${minStr} ${ampm}`;
      };

      const updateTimes = () => {
        const dateVal = dateInput.value;
        if (!dateVal) {
          timeSelect.innerHTML = '<option value="">Select a date first</option>';
          return;
        }
        
        const date = new Date(dateVal);
        const day = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
        
        if (day === 0) {
          timeSelect.innerHTML = '<option value="">Closed on Sundays</option>';
          dateInput.setCustomValidity('Shaw\'s Butchers is closed on Sundays. Please select another day.');
          dateInput.reportValidity();
          return;
        } else {
          dateInput.setCustomValidity('');
        }

        let startHour = 7;
        let endHour = 15; // 3 PM
        if (day === 3 || day === 6) { // Wednesday or Saturday (1 PM)
          endHour = 13;
        }

        let optionsHTML = '<option value="">Select a collection time</option>';
        for (let h = startHour; h <= endHour; h++) {
          if (h === endHour) {
            // Only add :00 for the closing hour
            const timeStr = format12Hour(h, 0);
            optionsHTML += `<option value="${timeStr}">${timeStr}</option>`;
          } else {
            const timeStr1 = format12Hour(h, 0);
            optionsHTML += `<option value="${timeStr1}">${timeStr1}</option>`;
            
            const timeStr2 = format12Hour(h, 30);
            optionsHTML += `<option value="${timeStr2}">${timeStr2}</option>`;
          }
        }
        timeSelect.innerHTML = optionsHTML;
      };

      // Populate times initially
      updateTimes();

      // Update times and validate on date change
      dateInput.addEventListener('change', updateTimes);
    }

    // Event listeners
    basketContainer.querySelectorAll('.qty-dec').forEach(btn => {
      btn.addEventListener('click', () => decrementQty(btn.dataset.id));
    });
    basketContainer.querySelectorAll('.qty-inc').forEach(btn => {
      btn.addEventListener('click', () => incrementQty(btn.dataset.id));
    });
    basketContainer.querySelectorAll('.basket-item-remove').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });
    basketContainer.querySelector('.basket-clear-all')?.addEventListener('click', () => {
      if (confirm('Remove all items from your basket?')) clear();
    });

    // Checkout form listeners
    const form = basketContainer.querySelector('#checkout-form');
    form?.addEventListener('submit', handleCheckout);

    // Save inputs dynamically as the customer types
    form?.addEventListener('input', () => {
      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const details = {
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          postcode: data.postcode || ''
        };
        localStorage.setItem('shaws_customer_details', JSON.stringify(details));
      } catch (err) {
        console.warn("Failed to auto-save customer details", err);
      }
    });
  };

  // ---------- Checkout ----------
  const handleCheckout = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Explicitly save details to local storage
    try {
      const details = {
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        postcode: data.postcode || ''
      };
      localStorage.setItem('shaws_customer_details', JSON.stringify(details));
    } catch (err) {
      console.warn("Failed to save customer details on checkout", err);
    }

    // Generate a user-friendly order ID in the format "beefXXXX" where XXXX is a random 4-digit number
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `beef${orderNum}`;
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'pending',
      customer: {
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        address: data.address || '',
        postcode: data.postcode || '',
        collectionDate: data.date,
        collectionTime: data.time,
        notes: data.notes || ''
      },
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        unit: item.unit,
        qty: item.qty,
        image: item.image || ''
      })),
      total: getTotal()
    };

    // Show submitting spinner / overlay
    const basketContainer = document.querySelector('.basket-page-content');
    basketContainer.innerHTML = `
      <div class="basket-loading" style="text-align: center; padding: 4rem 0;">
        <div class="spinner" style="border: 4px solid #e5e7eb; border-top: 4px solid #8B1A1A; border-radius: 50%; width: 48px; height: 48px; animation: spin 1s linear infinite; margin: 0 auto 1.5rem;"></div>
        <h3 style="color: #111827; margin-bottom: 0.5rem; font-size: 1.25rem;">Submitting Your Order...</h3>
        <p style="color: #4b5563; font-size: 0.95rem;">Please wait while we transmit your details to the shop.</p>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `;

    const sheetUrl = window.GLOBAL_CONFIG && window.GLOBAL_CONFIG.googleSheetUrl;

    const formatCollectionDate = (dateStr) => {
      try {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      } catch (err) {
        return dateStr || 'N/A';
      }
    };

    const showSuccess = () => {
      // Clear cart memory
      clear();

      // Build WhatsApp message if configured
      const waNumber = window.GLOBAL_CONFIG && window.GLOBAL_CONFIG.whatsappNumber;
      let whatsappButton = '';
      if (waNumber) {
        const itemsList = order.items.map(item =>
          `• ${item.name} x${item.qty} — £${(item.price * item.qty).toFixed(2)}`
        ).join('\n');
        const waMessage = encodeURIComponent(
          `🥩 *New Order from Shaw's Butchers*\n\n` +
          `*Order ID:* #${order.id}\n` +
          `*Name:* ${data.name}\n` +
          `*Phone:* ${data.phone}\n` +
          `*Collection:* ${formatCollectionDate(data.date)} at ${data.time}\n\n` +
          `*Items:*\n${itemsList}\n\n` +
          `*Estimated Total:* £${order.total.toFixed(2)}\n\n` +
          (data.notes ? `*Notes:* ${data.notes}\n\n` : '') +
          `Thank you! 🙏`
        );
        const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
        whatsappButton = `
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp" style="background: #25D366; color: #fff; font-weight: 700; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 2rem; border-radius: 9999px; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Send Order via WhatsApp
          </a>
          <p style="font-size: 0.8rem; color: #6b7280; margin-top: 0.75rem;">Tap to send your order details directly to Shaw's Butchers on WhatsApp</p>
        `;
      }

      basketContainer.innerHTML = `
        <div class="basket-success">
          <div class="basket-success-icon" style="color: #10B981; margin-bottom: 1.5rem;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="64" height="64">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 style="color: #065f46; margin-bottom: 0.5rem; font-size: 1.5rem;">Order Submitted!</h2>
          <p>Thank you, <strong>${data.name}</strong>! Your order has been successfully placed.</p>
          
          <div class="basket-success-details" style="margin: 1.5rem 0; text-align: left; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 1.25rem;">
            <h4 style="margin-bottom: 0.75rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; color: #111827; font-weight: 600;">Order Summary</h4>
            <p style="margin-bottom: 0.5rem; font-size: 0.92rem;"><strong>Order ID:</strong> #${order.id}</p>
            <p style="margin-bottom: 0.5rem; font-size: 0.92rem;"><strong>Collection Date:</strong> ${formatCollectionDate(data.date)} at ${data.time}</p>
            <p style="margin-bottom: 0; font-size: 0.92rem;"><strong>Estimated Total:</strong> £${order.total.toFixed(2)}</p>
          </div>
          
          ${whatsappButton ? `<div style="text-align:center; margin: 1.5rem 0;">${whatsappButton}</div>` : ''}
          
          <p class="basket-success-notice" style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 1rem; border-radius: 4px; color: #166534; font-size: 0.92rem; text-align: left;">
            🔔 Your order has been logged. We'll verify the cuts and prepare them for your selected collection day. If you have any immediate changes, call us on <a href="tel:01928561869" style="font-weight: 700; color: #166534; text-decoration: underline;">01928 561869</a>.
          </p>
          
          <div class="basket-success-actions" style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
            <a href="index.html" class="btn btn--primary">Back to Home</a>
            <a href="beef.html" class="btn btn--outline">Continue Shopping</a>
          </div>
        </div>
      `;
    };

    const saveLocal = () => {
      try {
        const existingOrders = JSON.parse(localStorage.getItem('shaws_orders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('shaws_orders', JSON.stringify(existingOrders));
      } catch (err) {
        console.warn('Could not save order locally', err);
      }
    };

    const fallbackToLocal = () => {
      saveLocal();
      showSuccess();
      const successNotice = document.querySelector('.basket-success-notice');
      if (successNotice) {
        successNotice.style.background = '#fffbeb';
        successNotice.style.borderColor = '#d97706';
        successNotice.style.color = '#92400e';
        successNotice.innerHTML = `
          ⚠️ <strong>Connection Notice:</strong> Your order was saved locally on this device, but we encountered an issue transmitting it to our cloud spreadsheet database. Please contact us on <a href="tel:01928561869" style="font-weight:700; color:#92400e; text-decoration:underline;">01928 561869</a> to confirm we received it.
        `;
      }
    };

    const isValidUrl = (str) => {
      try {
        const parsed = new URL(str);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    };

    if (sheetUrl && isValidUrl(sheetUrl)) {
      // Send to Google Sheets Apps Script endpoint
      try {
        fetch(sheetUrl, {
          method: 'POST',
          body: JSON.stringify({
            action: "create",
            order: order
          })
        })
        .then(res => {
          if (!res.ok) throw new Error("HTTP request failed");
          return res.json();
        })
        .then(resData => {
          if (resData.status === "success") {
            saveLocal();
            showSuccess();
          } else {
            throw new Error(resData.message || "Failed to write to sheet");
          }
        })
        .catch(err => {
          console.error("Google Sheet Sync Error (Promise):", err);
          fallbackToLocal();
        });
      } catch (err) {
        console.error("Google Sheet Sync Error (Synchronous):", err);
        fallbackToLocal();
      }
    } else {
      // Demo fallback mode (no URL configured or invalid URL)
      saveLocal();
      setTimeout(showSuccess, 800);
    }
  };

  // ---------- Init ----------
  const init = () => {
    load();
    createSidebar();
    updateUI();

    // Cart icon click
    document.querySelectorAll('.cart-icon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSidebar();
      });
    });

    // "Add to Basket" buttons on product pages
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.product-card');
        if (!card) return;

        const name = card.querySelector('.product-name')?.textContent?.trim();
        const priceEl = card.querySelector('.product-price');
        const priceText = priceEl?.childNodes[0]?.textContent?.trim() || priceEl?.textContent?.trim();
        const price = parseFloat(priceText?.replace('£', '').replace(',', ''));
        const unit = priceEl?.querySelector('small')?.textContent?.trim() || '';
        const image = card.querySelector('.product-image img')?.getAttribute('src') || '';

        if (name && !isNaN(price)) {
          addItem(name, price, unit, image);

          // Button feedback
          const originalHTML = btn.innerHTML;
          const originalClasses = btn.className;
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added!`;
          btn.classList.add('btn-added');
          btn.style.pointerEvents = 'none';

          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('btn-added');
            btn.style.pointerEvents = '';
          }, 1500);
        }
      });
    });
  };

  return { init, addItem, removeItem, updateQty, incrementQty, decrementQty, clear, getItems, getCount, getTotal, openSidebar, closeSidebar };
})();

document.addEventListener('DOMContentLoaded', Cart.init);
