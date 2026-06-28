// ===== Dynamic Product Sync =====
// Reads admin-managed products from localStorage and updates
// prices, availability, badges and descriptions on shop pages.
// Also appends any NEW products the admin added to the category.

(() => {
  const PRODUCTS_KEY = 'shaws_admin_products';

  const escapeHTML = (str) => {
    if (typeof str !== 'string') return str || '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Detect which category page we're on
  const detectCategory = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('beef')) return 'beef';
    if (path.includes('lamb')) return 'lamb';
    if (path.includes('pork')) return 'pork';
    if (path.includes('chicken')) return 'chicken';
    if (path.includes('sausage')) return 'sausage';
    if (path.includes('bacon')) return 'bacon';
    if (path.includes('eggs')) return 'eggs';
    if (path.includes('other')) return 'other';
    if (path.includes('specials')) return 'specials';
    if (path.includes('seasonal')) return 'seasonal';
    if (path.includes('christmas')) return 'christmas';
    return null;
  };

  const getAdminProducts = () => {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  };

  const normalise = (str) => str.trim().toLowerCase().replace(/['']/g, "'");

  const syncProducts = () => {
    const category = detectCategory();
    if (!category) return; // Not a product page

    const runSync = (allProducts) => {
      if (!allProducts) return;

      const catProducts = allProducts.filter(p => p.category === category);
      if (!catProducts.length) return;

      const grid = document.querySelector('.products-grid');
      if (!grid) return;

      const existingCards = grid.querySelectorAll('.product-card');
      const matchedIds = new Set();

      existingCards.forEach(card => {
        const nameEl = card.querySelector('.product-name');
        if (!nameEl) return;
        const cardName = normalise(nameEl.textContent);

        // Find matching admin product
        const adminProduct = catProducts.find(p => normalise(p.name) === cardName);
        if (!adminProduct) return;

        matchedIds.add(adminProduct.id);

        // Hide if unavailable
        if (!adminProduct.available) {
          card.style.display = 'none';
          return;
        }
        card.style.display = '';

        // Update price
        const priceEl = card.querySelector('.product-price');
        if (priceEl && adminProduct.price > 0) {
          priceEl.innerHTML = `£${adminProduct.price.toFixed(2)} <small>${escapeHTML(adminProduct.unit)}</small>`;
        } else if (priceEl && adminProduct.price === 0) {
          priceEl.innerHTML = `Contact for price`;
        }

        // Update description
        const descEl = card.querySelector('.product-desc');
        if (descEl && adminProduct.description) {
          descEl.textContent = adminProduct.description;
        }

        // Update badge
        const imageWrap = card.querySelector('.product-image');
        let badgeEl = imageWrap?.querySelector('.product-badge');
        if (adminProduct.badge) {
          if (!badgeEl && imageWrap) {
            badgeEl = document.createElement('div');
            badgeEl.className = 'product-badge';
            imageWrap.prepend(badgeEl);
          }
          if (badgeEl) badgeEl.textContent = adminProduct.badge;
        } else if (badgeEl) {
          badgeEl.remove();
        }

        // Update image if admin uploaded one
        if (adminProduct.image && adminProduct.image.startsWith('data:')) {
          const imgEl = card.querySelector('.product-image img');
          if (imgEl) imgEl.src = adminProduct.image;
        }

        // Handle sold out
        const footer = card.querySelector('.product-footer');
        const btn = footer?.querySelector('.btn-add-cart');
        const soldOutSpan = footer?.querySelector('.sold-out-badge');

        if (adminProduct.soldOut) {
          if (btn) btn.style.display = 'none';
          if (!soldOutSpan && footer) {
            const span = document.createElement('span');
            span.className = 'sold-out-badge';
            span.textContent = 'Sold Out';
            span.style.cssText = 'color:#8B1A1A;font-weight:600;font-size:0.9rem;';
            footer.appendChild(span);
          }
        } else {
          if (btn) btn.style.display = '';
          if (soldOutSpan) soldOutSpan.remove();
        }
      });

      // Add new products that don't exist in the static HTML
      const newProducts = catProducts.filter(p => !matchedIds.has(p.id) && p.available && !p.soldOut);

      newProducts.forEach(p => {
        if (p.price <= 0) return; // Skip contact-for-price items without a page presence

        const card = document.createElement('div');
        card.className = 'product-card fade-in';

        const imgSrc = p.image && p.image.startsWith('data:') ? p.image :
                       (p.image || 'images/placeholder.jpg');

        card.innerHTML = `
          <div class="product-image">
            ${p.badge ? `<div class="product-badge">${escapeHTML(p.badge)}</div>` : ''}
            <img src="${imgSrc}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.style.opacity='0.3'">
          </div>
          <div class="product-info">
            <h3 class="product-name">${escapeHTML(p.name)}</h3>
            <p class="product-desc">${escapeHTML(p.description || '')}</p>
            <div class="product-footer">
              <span class="product-price">£${p.price.toFixed(2)} <small>${escapeHTML(p.unit)}</small></span>
              <button class="btn btn--outline btn--sm btn-add-cart">Add to Basket</button>
            </div>
          </div>
        `;

        grid.appendChild(card);

        // Attach cart handler for the new button
        const newBtn = card.querySelector('.btn-add-cart');
        if (newBtn && typeof Cart !== 'undefined') {
          newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Cart.addItem(p.name, p.price, p.unit, p.image || '');

            const originalHTML = newBtn.innerHTML;
            newBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added!`;
            newBtn.classList.add('btn-added');
            newBtn.style.pointerEvents = 'none';

            setTimeout(() => {
              newBtn.innerHTML = originalHTML;
              newBtn.classList.remove('btn-added');
              newBtn.style.pointerEvents = '';
            }, 1500);
          });
        }
      });
    };

    runSync(getAdminProducts());
  };

  document.addEventListener('DOMContentLoaded', syncProducts);
})();
