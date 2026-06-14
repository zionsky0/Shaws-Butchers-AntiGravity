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
              <input type="text" class="form-input" name="name" required>
            </div>
            <div class="form-group">
              <label>Phone Number <span class="required">*</span></label>
              <input type="tel" class="form-input" name="phone" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-input" name="email">
            </div>
            <div class="form-group">
              <label>Address <span class="required">*</span></label>
              <input type="text" class="form-input" name="address" required placeholder="E.g. 39 Church Street">
            </div>
            <div class="form-group">
              <label>Postcode <span class="required">*</span></label>
              <input type="text" class="form-input" name="postcode" required placeholder="E.g. WA7 1LX">
            </div>
            <div class="form-group">
              <label>Collection Date <span class="required">*</span></label>
              <input type="date" class="form-input" name="date" required>
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

    // Set min date to tomorrow
    const dateInput = basketContainer.querySelector('input[name="date"]');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
      dateInput.value = tomorrow.toISOString().split('T')[0];
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

    // Checkout form
    const form = basketContainer.querySelector('#checkout-form');
    form?.addEventListener('submit', handleCheckout);
  };

  // ---------- Checkout ----------
  const handleCheckout = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Save order to localStorage for admin panel
    const orderId = Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
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

    try {
      const existingOrders = JSON.parse(localStorage.getItem('shaws_orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('shaws_orders', JSON.stringify(existingOrders));

      // Sync to Firebase if active
      if (window.FirebaseSync && window.FirebaseSync.active) {
        window.FirebaseSync.addOrder(order);
      }
    } catch (e) {
      console.warn('Could not save order', e);
    }

    // Show success
    const basketContainer = document.querySelector('.basket-page-content');
    basketContainer.innerHTML = `
      <div class="basket-success">
        <div class="basket-success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h2>Order Submitted!</h2>
        <p>Thank you, <strong>${data.name}</strong>! Your order has been received.</p>
        <div class="basket-success-details">
          <h4>Order Details</h4>
          <div class="basket-success-items">
            ${items.map(item => `
              <div class="basket-success-item">
                <span>${item.qty}x ${item.name}</span>
                <span>£${(item.price * item.qty).toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="basket-success-item basket-success-total">
              <span>Estimated Total</span>
              <strong>£${getTotal().toFixed(2)}</strong>
            </div>
          </div>
          <p><strong>Collection Date:</strong> ${new Date(data.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
        </div>
        <p class="basket-success-notice">We'll confirm your order shortly. Final prices may vary slightly depending on weight. If you have any questions, call us on <a href="tel:01928561869">01928 561869</a>.</p>
        <div class="basket-success-actions">
          <a href="index.html" class="btn btn--primary">Back to Home</a>
          <a href="beef.html" class="btn btn--outline">Continue Shopping</a>
        </div>
      </div>
    `;

    clear();
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
