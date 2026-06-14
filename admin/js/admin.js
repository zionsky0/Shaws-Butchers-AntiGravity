// ===== SHAW'S BUTCHERS - Admin Panel JavaScript =====

(() => {
  // ==================== STORAGE KEYS ====================
  const KEYS = {
    PASSWORD: 'shaws_admin_pass',
    SESSION: 'shaws_admin_session',
    PRODUCTS: 'shaws_admin_products',
    ORDERS: 'shaws_orders',
    DARK_MODE: 'shaws_admin_dark',
  };

  const DEFAULT_PASSWORD = 'shaws2024';

  // ==================== DEFAULT PRODUCTS ====================
  // These match the hardcoded products on the website
  const DEFAULT_PRODUCTS = [
    // BEEF
    { id: 'braising-steak', name: 'Braising Steak', category: 'beef', price: 15.52, unit: '/kg', description: 'A long slow cooking process, but a gorgeous cut of meat which makes a flavourful, tender dish.', image: '../images/beef_braising_steak.jpg', badge: '', available: true, soldOut: false },
    { id: 'stewing-steak', name: 'Stewing Steak', category: 'beef', price: 15.52, unit: '/kg', description: 'Succulent, lean and chopped — ideal for stew on those cold winter days.', image: '../images/beef_stewing_steak.jpg', badge: '', available: true, soldOut: false },
    { id: 'topside', name: 'Topside', category: 'beef', price: 19.36, unit: '/kg', description: 'Topside of beef is a large, lean cut joint, excellent for roasting, taken from the hind quarter of the animal.', image: '../images/beef_topside.jpg', badge: '', available: true, soldOut: false },
    { id: 'sirloin-steak', name: 'Sirloin Steak', category: 'beef', price: 30.00, unit: '/kg', description: 'Lovely cut of meat, with a slight rind that brings out the flavour.', image: '../images/beef_sirloin_steak.jpg', badge: 'Popular', available: true, soldOut: false },
    { id: 'fillet-steak', name: 'Fillet Steak', category: 'beef', price: 42.34, unit: '/kg', description: 'Fillet is a cut of meat taken from the smaller end of the tenderloin — the most tender and lean cut of beef.', image: '../images/beef_fillett_steak.jpg', badge: 'Premium', available: true, soldOut: false },
    { id: 'rump-steak', name: 'Rump Steak', category: 'beef', price: 19.26, unit: '/kg', description: 'A very tender, lean piece of steak known for its marbling — thin veins of fat that run through the meat.', image: '../images/beef_rump_steak.jpg', badge: '', available: true, soldOut: false },
    { id: 'minced-beef', name: 'Minced Beef', category: 'beef', price: 14.00, unit: '/kg', description: 'Succulent fresh mince beef, made on the premises daily. Prices are per kilo.', image: '../images/beef_minced_beef.png', badge: '', available: true, soldOut: false },
    { id: 'beef-burgers', name: 'Beef Burgers', category: 'beef', price: 1.40, unit: '/each', description: 'Made fresh daily, on the premises — our famous handmade beef burgers.', image: '../images/beef_beef_burgers.jpg', badge: 'Handmade', available: true, soldOut: false },
    // LAMB
    { id: 'lamb-mint-burgers', name: 'Lamb & Mint Burgers', category: 'lamb', price: 1.50, unit: '/each', description: 'Made freshly on our premises, with our good quality produce and seasoning.', image: '../images/lamb_lamb_and_mint_burgers.jpg', badge: '', available: true, soldOut: true },
    { id: 'lamb-chump-chops', name: 'Lamb Chump Chops', category: 'lamb', price: 6.77, unit: '/kg', description: 'A cut from the lower back where the top of the leg meets the loin — tender and flavourful.', image: '../images/lamb_lamb_chump_chops.jpg', badge: '', available: true, soldOut: false },
    { id: 'lamb-leg-steaks', name: 'Lamb Leg Steaks', category: 'lamb', price: 27.10, unit: '/kg', description: 'A prime cut steak, cut from the centre of the leg of lamb — lean and delicious.', image: '../images/lamb_lamb_leg_steaks.jpg', badge: '', available: true, soldOut: false },
    { id: 'diced-lamb', name: 'Diced Lamb', category: 'lamb', price: 16.50, unit: '/kg', description: 'Ideal for stews, curries and casseroles. Benefits from slow cooking.', image: '../images/lamb_lamb_leg_steaks.jpg', badge: '', available: true, soldOut: false },
    { id: 'breast-of-lamb', name: 'Breast of Lamb', category: 'lamb', price: 10.00, unit: '/kg', description: 'A belly cut with higher fat content. When slow cooked, much of the fat is released.', image: '../images/lamb_leg_of_lamb.jpg', badge: '', available: true, soldOut: false },
    { id: 'lamb-chops', name: 'Lamb Chops', category: 'lamb', price: 19.86, unit: '/kg', description: 'Lamb loin chops cut from the saddle area, containing a T-shaped bone.', image: '../images/lamb_lamb_chops.jpg', badge: 'Popular', available: true, soldOut: false },
    { id: 'leg-of-lamb', name: 'Leg of Lamb', category: 'lamb', price: 0, unit: '/kg', description: 'A beautiful tender and flavourful cut. Please contact us for pricing.', image: '../images/lamb_leg_of_lamb.jpg', badge: 'Premium', available: true, soldOut: false },
    { id: 'minted-lamb-chops', name: 'Minted Lamb Chops', category: 'lamb', price: 19.86, unit: '/kg', description: 'Our gorgeous loin chops sprinkled with flavour.', image: '../images/lamb_minted_lamb_chops.jpg', badge: '', available: true, soldOut: false },
    { id: 'minted-lamb-steaks', name: 'Minted Lamb Steaks', category: 'lamb', price: 27.10, unit: '/kg', description: 'Boneless lamb chops sprinkled with flavour.', image: '../images/lamb_minted_lamb_steaks.jpg', badge: '', available: true, soldOut: false },
    // PORK
    { id: 'pork-ribs', name: 'Pork Ribs', category: 'pork', price: 12.80, unit: '/kg', description: 'Pork meat and bones cut into useable pieces — tender and well marbled.', image: '../images/pork_spare_rib_chops.jpg', badge: '', available: true, soldOut: false },
    { id: 'belly-pork', name: 'Belly Pork', category: 'pork', price: 11.80, unit: '/kg', description: 'A boneless fatty cut from the belly of the pig. One of the most versatile cuts.', image: '../images/pork_pork_steaks.jpg', badge: '', available: true, soldOut: false },
    { id: 'spare-rib-chops', name: 'Spare Rib Chops', category: 'pork', price: 11.65, unit: '/kg', description: 'Cut from the shoulder of the pig, with a bone — rich, flavourful and tender.', image: '../images/pork_spare_rib_chops.jpg', badge: '', available: true, soldOut: false },
    { id: 'pork-steaks', name: 'Pork Steaks', category: 'pork', price: 11.80, unit: '/kg', description: 'Cut from the shoulder of the pig — should be slowly cooked for best results.', image: '../images/pork_pork_steaks.jpg', badge: '', available: true, soldOut: false },
    { id: 'pork-apple-burgers', name: 'Pork & Apple Burgers', category: 'pork', price: 1.40, unit: '/each', description: 'Made fresh on a daily basis from our finest pork and seasonings.', image: '../images/pork_pork_and_apple_burgers.jpg', badge: 'Handmade', available: true, soldOut: false },
    { id: 'pork-chops', name: 'Pork Chops', category: 'pork', price: 11.93, unit: '/kg', description: 'A loin cut of pork — very lean in comparison to other cuts.', image: '../images/pork_pork_chops.jpg', badge: '', available: true, soldOut: false },
    // CHICKEN
    { id: 'whole-chicken', name: 'Whole Chicken', category: 'chicken', price: 8.00, unit: '/each', description: 'Fresh whole, grain-fed chickens — perfect for a traditional roast dinner.', image: '../images/chicken_whole_chicken.jpg', badge: '', available: true, soldOut: false },
    { id: 'chicken-fillets', name: 'Chicken Fillets', category: 'chicken', price: 11.65, unit: '/kg', description: 'A breast of the chicken, sliced up fillet style — versatile and lean.', image: '../images/chicken_chicken_fillets.jpg', badge: 'Popular', available: true, soldOut: false },
    { id: 'salt-pepper-chicken', name: 'Salt & Pepper Chicken Fillets', category: 'chicken', price: 11.65, unit: '/kg', description: 'Chicken fillets marinated in our delicious salt and pepper seasoning.', image: '../images/chicken_salt_and_pepper_chicken_fillets.jpg', badge: 'Flavoured', available: true, soldOut: false },
    { id: 'chinese-chicken-fillet', name: 'Chinese Chicken Fillet', category: 'chicken', price: 11.65, unit: '/kg', description: 'Chicken fillets in a delicious Chinese glaze — full of flavour.', image: '../images/chicken_chicken_fillets.jpg', badge: 'Flavoured', available: true, soldOut: false },
    { id: 'chinese-chicken-stir-fry', name: 'Chinese Chicken Stir Fry', category: 'chicken', price: 8.00, unit: '/each', description: 'Back by popular demand! With onions, mushrooms, peppers, chicken fillets and Chinese glaze.', image: '../images/chicken_chinese_chicken_stir_fry.jpg', badge: 'Popular', available: true, soldOut: false },
    // BACON & GAMMON
    { id: 'bacon-ribs', name: 'Bacon Ribs', category: 'bacon', price: 8.83, unit: '/kg', description: 'Chopped to order — please specify when ordering.', image: '../images/bacon_bacon_ribs.jpg', badge: '', available: true, soldOut: false },
    { id: 'bacon-chops', name: 'Bacon Chops', category: 'bacon', price: 11.56, unit: '/kg', description: 'Sliced how you like them — thick or thin, just let us know.', image: '../images/bacon_bacon_chops.jpg', badge: '', available: true, soldOut: false },
    { id: 'back-bacon', name: 'Back Bacon', category: 'bacon', price: 13.00, unit: '/kg', description: 'Classic back bacon rashers — a breakfast staple.', image: '../images/bacon_back_bacon.jpg', badge: 'Popular', available: true, soldOut: false },
    { id: 'smoked-back-bacon', name: 'Smoked Back Bacon', category: 'bacon', price: 13.00, unit: '/kg', description: 'Rich, smoky flavour — perfect for those who prefer a deeper taste.', image: '../images/bacon_smoked_back_bacon.jpg', badge: '', available: true, soldOut: false },
    { id: 'streaky-bacon', name: 'Streaky Bacon', category: 'bacon', price: 13.00, unit: '/kg', description: 'Thin, crispy strips with the perfect balance of meat and fat.', image: '../images/bacon_back_bacon.jpg', badge: '', available: true, soldOut: false },
    { id: 'gammon-joint', name: 'Gammon Joint', category: 'bacon', price: 12.05, unit: '/kg', description: 'Our gammons are rolled to the size you want.', image: '../images/bacon_gammon_joint.jpg', badge: 'Popular', available: true, soldOut: false },
    { id: 'gammon-steak', name: 'Gammon Steak', category: 'bacon', price: 12.05, unit: '/kg', description: 'Our succulent gammon steaks — very meaty, sliced to order.', image: '../images/bacon_gammon_steak.jpg', badge: '', available: true, soldOut: false },
    { id: 'gammon-shank', name: 'Gammon Shank', category: 'bacon', price: 5.00, unit: '/each', description: 'Perfect for pea and ham soup — hearty and full of flavour.', image: '../images/bacon_gammon_shank.jpg', badge: '', available: true, soldOut: false },
    // SAUSAGES (made on premises — no individual products listed on real site)
    { id: 'handmade-sausages', name: 'Handmade Sausages', category: 'sausage', price: 0, unit: '', description: 'All sausages made fresh on the premises daily. Pop in or call for availability.', image: '../images/pork_pork_and_apple_burgers.jpg', badge: 'Handmade', available: true, soldOut: false },
    // EGGS
    { id: 'free-range-eggs', name: 'Free Range Eggs', category: 'eggs', price: 2.20, unit: '/each', description: 'Our fabulous large free range eggs fresh from the farm.', image: '../images/eggs_free_range.jpg', badge: 'Free Range', available: true, soldOut: false },
    { id: 'duck-eggs', name: 'Duck Eggs', category: 'eggs', price: 3.90, unit: '/each', description: 'Fresh duck eggs — rich and flavourful.', image: '../images/eggs_duck.jpg', badge: '', available: true, soldOut: true },
    // OTHER
    { id: 'beef-dripping-pot', name: 'Beef Dripping Pot', category: 'other', price: 4.00, unit: '/each', description: 'Traditional beef dripping — ideal for roast potatoes and Yorkshire puddings.', image: '../images/other_beef_dripping.jpg', badge: '', available: true, soldOut: true },
    { id: 'black-pudding', name: 'Black Pudding Slices/Stick', category: 'other', price: 9.55, unit: '/kg', description: 'Traditional black pudding — available as slices or a whole stick.', image: '../images/other_black_pudding.jpg', badge: '', available: true, soldOut: false },
    { id: 'bury-black-pudding', name: 'Bury Black Pudding', category: 'other', price: 9.50, unit: '/kg', description: 'The famous Bury black pudding — a Lancashire favourite.', image: '../images/other_bury_black_pudding.jpg', badge: '', available: true, soldOut: false },
    { id: 'bbq-sauce', name: 'Barbeque Sauce', category: 'other', price: 1.40, unit: '/each', description: 'Our barbeque sauce — perfect for grilling and dipping.', image: '../images/other_bbq_sauce.jpg', badge: '', available: true, soldOut: false },
    { id: 'chinese-sauce', name: 'Chinese Sauce', category: 'other', price: 1.40, unit: '/each', description: 'Delicious Chinese-style sauce for marinades and stir fries.', image: '../images/other_chinese_sauce.jpg', badge: '', available: true, soldOut: false },
    { id: 'salt-pepper-seasoning', name: 'Salt and Pepper Seasoning', category: 'other', price: 2.80, unit: '/each', description: 'Our popular salt and pepper seasoning — great on chicken, chips and more.', image: '../images/other_salt_pepper_seasoning.jpg', badge: 'Popular', available: true, soldOut: false },
    { id: 'pearl-barley', name: 'Pearl Barley', category: 'other', price: 1.50, unit: '/each', description: 'Pearl barley — perfect for soups and stews.', image: '../images/other_pearl_barley.jpg', badge: '', available: true, soldOut: true },
    { id: 'red-split-lentils', name: 'Red Split Lentils', category: 'other', price: 1.85, unit: '/each', description: 'Red split lentils — ideal for soups, dahls and stews.', image: '../images/other_pearl_barley.jpg', badge: '', available: true, soldOut: true },
    { id: 'yellow-split-peas', name: 'Yellow Split Peas', category: 'other', price: 1.85, unit: '/each', description: 'Yellow split peas — great for traditional pea soup.', image: '../images/other_yellow_split_peas.jpg', badge: '', available: true, soldOut: false },
    { id: 'green-split-peas', name: 'Green Split Peas', category: 'other', price: 1.50, unit: '/each', description: 'Green split peas — perfect for soups and side dishes.', image: '../images/other_yellow_split_peas.jpg', badge: '', available: true, soldOut: true },
    { id: 'broth-mix', name: 'Broth Mix', category: 'other', price: 1.85, unit: '/each', description: 'Broth mix — a traditional mix for hearty homemade broth.', image: '../images/other_pearl_barley.jpg', badge: '', available: true, soldOut: true },
    // SPECIAL OFFER BUNDLES
    { id: 'mixed-grill-pack', name: 'Mixed Grill Pack', category: 'specials', price: 23.00, unit: '', description: '6 eggs, 2 gammon, 2 rump steak, 2 pork steaks, 6 sausage, 2 chicken fillets.', image: '../images/specials_mixed_grill.jpg', badge: 'Bundle', available: true, soldOut: false },
    { id: 'breakfast-pack', name: 'Breakfast Pack Bundle', category: 'specials', price: 13.00, unit: '', description: '1lb sausage, 1lb bacon, half doz eggs, black pudding.', image: '../images/specials_breakfast.jpg', badge: 'Bundle', available: true, soldOut: false },
    { id: 'family-pack', name: 'Family Pack', category: 'specials', price: 45.00, unit: '', description: '1lb stew, 8 sausage, 4 chicken fillets, 1lb mince, 4 burgers, 4 pork steaks, 2 gammon steaks. Worth £65!', image: '../images/specials_family_pack.jpg', badge: 'Best Value', available: true, soldOut: false },
    { id: 'pensioners-special', name: 'Pensioners Special', category: 'specials', price: 15.00, unit: '', description: '2 sausage, 2 bacon, 1 chop, 1 chicken fillet, 1 burger, ½lb stew, ½lb mince.', image: '../images/specials_pensioners.png', badge: 'Bundle', available: true, soldOut: false },
    // SEASONAL
    { id: 'bonfire-night-special', name: 'Bonfire Night Special', category: 'seasonal', price: 7.00, unit: '', description: 'Mini hot dogs winter warmer. 6 pork sausage cut into 4, drizzled with honey and mustard glaze, garlic, chopped tomato, topped with cheese and jalapenos.', image: '../images/seasonal_bonfire.jpg', badge: 'Seasonal', available: true, soldOut: false },
    { id: 'autumn-bundle', name: 'Autumn Bundle', category: 'seasonal', price: 23.00, unit: '', description: '500g Mince, 500g stew steak, 2 chicken fillets, 1 ham shank. Was £30.', image: '../images/seasonal_autumn.jpg', badge: 'Reduced', available: true, soldOut: true },
  ];

  // ==================== HELPERS ====================
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

  const getPassword = () => localStorage.getItem(KEYS.PASSWORD) || DEFAULT_PASSWORD;

  const getProducts = () => {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  };

  const saveProducts = (products) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  };

  const loadProducts = () => {
    let products = getProducts();
    if (!products) {
      products = DEFAULT_PRODUCTS;
      saveProducts(products);
    }
    return products;
  };

  const getOrders = () => {
    try {
      const data = localStorage.getItem(KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  };

  const saveOrders = (orders) => {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  };

  const generateProductId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  };

  const formatDateTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
  };

  const CATEGORY_LABELS = {
    beef: 'Beef',
    lamb: 'Lamb',
    pork: 'Pork',
    chicken: 'Chicken',
    bacon: 'Bacon & Gammon',
    sausage: 'Sausages',
    eggs: 'Eggs',
    other: 'Other',
    specials: 'Special Offer Bundles',
    seasonal: 'Seasonal',
    christmas: 'Christmas'
  };

  // ==================== TOAST ====================
  let toastTimer;
  const showToast = (msg) => {
    const toast = $('#toast');
    const toastMsg = $('#toast-msg');
    toastMsg.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 3000);
  };

  // ==================== AUTH ====================
  const checkAuth = () => {
    return sessionStorage.getItem(KEYS.SESSION) === 'true' || localStorage.getItem(KEYS.SESSION) === 'true';
  };

  const login = (password, rememberMe) => {
    if (password === getPassword()) {
      if (rememberMe) {
        localStorage.setItem(KEYS.SESSION, 'true');
      } else {
        sessionStorage.setItem(KEYS.SESSION, 'true');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(KEYS.SESSION);
    localStorage.removeItem(KEYS.SESSION);
    showLogin();
  };

  const showLogin = () => {
    $('#login-screen').hidden = false;
    $('#app').hidden = true;
  };

  const showApp = () => {
    $('#login-screen').hidden = true;
    $('#app').hidden = false;
    initDashboard();
  };

  // ==================== NAVIGATION ====================
  let currentPage = 'dashboard';

  const navigateTo = (page) => {
    currentPage = page;
    // Hide all pages
    $$('.page').forEach(p => p.hidden = true);
    $(`#page-${page}`).hidden = false;
    // Update sidebar
    $$('.sidebar-link[data-page]').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });
    // Update topbar title
    $('#topbar-title').textContent = page.charAt(0).toUpperCase() + page.slice(1);
    // Close mobile sidebar
    closeMobileSidebar();
    // Refresh page data
    switch (page) {
      case 'dashboard': renderDashboard(); break;
      case 'orders': renderOrders(); break;
      case 'products': renderProducts(); break;
    }
  };

  // ==================== MOBILE SIDEBAR ====================
  let sidebarOverlay;

  const openMobileSidebar = () => {
    $('#sidebar').classList.add('open');
    if (!sidebarOverlay) {
      sidebarOverlay = document.createElement('div');
      sidebarOverlay.className = 'sidebar-overlay';
      sidebarOverlay.addEventListener('click', closeMobileSidebar);
      document.body.appendChild(sidebarOverlay);
    }
    sidebarOverlay.classList.add('show');
  };

  const closeMobileSidebar = () => {
    $('#sidebar').classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('show');
  };

  // ==================== DASHBOARD ====================
  const initDashboard = () => {
    renderDashboard();
    renderProducts();
    renderOrders();
    updateOrdersBadge();
  };

  const renderDashboard = () => {
    const products = loadProducts();
    const orders = getOrders();
    const pending = orders.filter(o => o.status === 'pending');
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    $('#stat-total-orders').textContent = orders.length;
    $('#stat-pending-orders').textContent = pending.length;
    $('#stat-revenue').textContent = `£${revenue.toFixed(2)}`;
    $('#stat-total-products').textContent = products.length;

    // Recent orders
    const recentContainer = $('#dashboard-recent-orders');
    if (orders.length === 0) {
      recentContainer.innerHTML = '<p class="empty-text">No orders yet. Orders from the website will appear here.</p>';
    } else {
      const recent = orders.slice(-5).reverse();
      recentContainer.innerHTML = recent.map(order => `
        <div class="recent-order-row" data-order-id="${order.id}">
          <div class="recent-order-info">
            <span class="recent-order-name">${order.customer?.name || 'Unknown'}</span>
            <span class="recent-order-date">${formatDateTime(order.date)}</span>
          </div>
          <span class="order-status order-status--${order.status}">${order.status}</span>
          <span class="recent-order-amount">£${(order.total || 0).toFixed(2)}</span>
        </div>
      `).join('');

      recentContainer.querySelectorAll('.recent-order-row').forEach(row => {
        row.addEventListener('click', () => openOrderDetail(row.dataset.orderId));
      });
    }
  };

  const updateOrdersBadge = () => {
    const orders = getOrders();
    const pending = orders.filter(o => o.status === 'pending').length;
    const badge = $('#orders-badge');
    if (pending > 0) {
      badge.textContent = pending;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  };

  // ==================== PRODUCTS ====================
  let productFilter = 'all';
  let productSearch = '';

  const renderProducts = () => {
    const products = loadProducts();
    const container = $('#products-list');

    let filtered = products;
    if (productFilter !== 'all') {
      filtered = filtered.filter(p => p.category === productFilter);
    }
    if (productSearch) {
      const q = productSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = '<p class="empty-text">No products found.</p>';
      return;
    }

    const imgPath = (src) => {
      if (!src) return '';
      if (src.startsWith('data:')) return src;
      if (src.startsWith('../')) return src;
      if (src.startsWith('images/')) return '../' + src;
      return src;
    };

    container.innerHTML = `
      <div class="products-table-header">
        <span></span>
        <span>Product</span>
        <span>Category</span>
        <span>Price</span>
        <span>Unit</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      ${filtered.map(p => {
        let statusClass = 'status-available';
        let statusText = 'Available';
        if (p.soldOut) { statusClass = 'status-soldout'; statusText = 'Sold Out'; }
        else if (!p.available) { statusClass = 'status-unavailable'; statusText = 'Hidden'; }

        const img = imgPath(p.image);

        return `
        <div class="product-row" data-id="${p.id}">
          ${img
            ? `<img src="${img}" alt="${p.name}" class="product-row-thumb" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="product-row-thumb-placeholder" style="display:none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`
            : `<div class="product-row-thumb-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`
          }
          <div class="product-row-name">${p.name}${p.badge ? ` <small>🏷️ ${p.badge}</small>` : ''}${p.description ? `<small>${p.description}</small>` : ''}</div>
          <span class="product-row-cat">${CATEGORY_LABELS[p.category] || p.category}</span>
          <span class="product-row-price">${p.price > 0 ? `£${p.price.toFixed(2)}` : 'Contact'}</span>
          <span class="product-row-price"><small>${p.unit}</small></span>
          <span class="status-badge ${statusClass}">${statusText}</span>
          <div class="product-row-actions">
            <button class="action-btn edit-product-btn" data-id="${p.id}" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-btn action-btn--danger delete-product-btn" data-id="${p.id}" title="Delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>`;
      }).join('')}
    `;

    // Attach listeners
    container.querySelectorAll('.edit-product-btn').forEach(btn => {
      btn.addEventListener('click', () => openProductModal(btn.dataset.id));
    });
    container.querySelectorAll('.delete-product-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
  };

  const deleteProduct = (id) => {
    const products = loadProducts();
    const product = products.find(p => p.id === id);
    if (!product) return;
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
    renderProducts();
    renderDashboard();
    showToast(`"${product.name}" deleted`);
  };

  // ==================== PRODUCT MODAL ====================
  let editingProductId = null;
  let currentPhotoData = null;

  const openProductModal = (id = null) => {
    const modal = $('#product-modal');
    const form = $('#product-form');
    form.reset();
    currentPhotoData = null;

    const preview = $('#photo-preview');
    const previewImg = preview.querySelector('img');
    if (previewImg) previewImg.remove();
    preview.classList.remove('has-image');
    $('#remove-photo-btn').hidden = true;

    if (id) {
      editingProductId = id;
      const products = loadProducts();
      const product = products.find(p => p.id === id);
      if (!product) return;
      $('#modal-title').textContent = 'Edit Product';
      $('#pf-name').value = product.name;
      $('#pf-category').value = product.category;
      $('#pf-price').value = product.price;
      $('#pf-unit').value = product.unit;
      $('#pf-desc').value = product.description || '';
      $('#pf-badge').value = product.badge || '';
      $('#pf-available').checked = product.available !== false;
      $('#pf-soldout').checked = product.soldOut === true;

      if (product.image) {
        currentPhotoData = product.image;
        const img = document.createElement('img');
        img.src = product.image.startsWith('data:') ? product.image :
                  (product.image.startsWith('../') ? product.image : '../' + product.image);
        preview.appendChild(img);
        preview.classList.add('has-image');
        $('#remove-photo-btn').hidden = false;
      }
    } else {
      editingProductId = null;
      $('#modal-title').textContent = 'Add Product';
    }

    modal.hidden = false;
  };

  const closeProductModal = () => {
    $('#product-modal').hidden = true;
    editingProductId = null;
    currentPhotoData = null;
  };

  const handleProductSave = (e) => {
    e.preventDefault();
    const form = $('#product-form');
    const formData = new FormData(form);

    const name = formData.get('name').trim();
    const category = formData.get('category');
    const price = parseFloat(formData.get('price')) || 0;
    const unit = formData.get('unit');
    const description = formData.get('description')?.trim() || '';
    const badge = formData.get('badge')?.trim() || '';
    const available = $('#pf-available').checked;
    const soldOut = $('#pf-soldout').checked;

    const products = loadProducts();

    if (editingProductId) {
      // Edit existing
      const idx = products.findIndex(p => p.id === editingProductId);
      if (idx === -1) return;
      products[idx] = {
        ...products[idx],
        name,
        category,
        price,
        unit,
        description,
        badge,
        available,
        soldOut,
        image: currentPhotoData || products[idx].image
      };
      showToast(`"${name}" updated`);
    } else {
      // Add new
      const id = generateProductId(name);
      if (products.find(p => p.id === id)) {
        alert('A product with a very similar name already exists. Please use a different name.');
        return;
      }
      products.push({
        id,
        name,
        category,
        price,
        unit,
        description,
        badge,
        available,
        soldOut,
        image: currentPhotoData || ''
      });
      showToast(`"${name}" added`);
    }

    saveProducts(products);
    closeProductModal();
    renderProducts();
    renderDashboard();
  };

  // Photo upload
  const handlePhotoUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Please use an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentPhotoData = e.target.result;
      const preview = $('#photo-preview');
      let img = preview.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        preview.appendChild(img);
      }
      img.src = currentPhotoData;
      preview.classList.add('has-image');
      $('#remove-photo-btn').hidden = false;
    };
    reader.readAsDataURL(file);
  };

  // ==================== ORDERS ====================
  let orderFilter = 'all';
  let orderSearch = '';

  const renderOrders = () => {
    const orders = getOrders();
    const container = $('#orders-list');

    let filtered = orders;
    if (orderFilter !== 'all') {
      filtered = filtered.filter(o => o.status === orderFilter);
    }
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      filtered = filtered.filter(o =>
        (o.customer?.name || '').toLowerCase().includes(q) ||
        (o.customer?.phone || '').toLowerCase().includes(q) ||
        (o.customer?.email || '').toLowerCase().includes(q) ||
        (o.customer?.address || '').toLowerCase().includes(q) ||
        (o.customer?.postcode || '').toLowerCase().includes(q) ||
        (o.id || '').toLowerCase().includes(q)
      );
    }

    // Sort newest first
    filtered = filtered.slice().reverse();

    if (filtered.length === 0) {
      container.innerHTML = '<p class="empty-text">No orders found. When customers place orders on the website, they\'ll appear here.</p>';
      return;
    }

    container.innerHTML = filtered.map(order => `
      <div class="order-card" data-order-id="${order.id}">
        <span class="order-id">#${order.id}</span>
        <div class="order-info">
          <span class="order-customer">${order.customer?.name || 'Unknown'}</span>
          <div class="order-meta">
            <span>📅 Collect: ${formatDate(order.customer?.collectionDate || order.date)}</span>
            <span>📞 ${order.customer?.phone || 'N/A'}</span>
            <span>${order.items?.length || 0} items</span>
          </div>
        </div>
        <span class="order-total">£${(order.total || 0).toFixed(2)}</span>
        <span class="order-status order-status--${order.status}">${order.status}</span>
      </div>
    `).join('');

    container.querySelectorAll('.order-card').forEach(card => {
      card.addEventListener('click', () => openOrderDetail(card.dataset.orderId));
    });

    updateOrdersBadge();
  };

  const openOrderDetail = (orderId) => {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    navigateTo('orders');

    const modal = $('#order-modal');
    $('#order-modal-title').textContent = `Order #${order.id}`;

    const body = $('#order-modal-body');
    body.innerHTML = `
      <div class="order-detail-grid">
        <div class="order-detail-card">
          <h4>Customer</h4>
          <p>
            <strong>${order.customer?.name || 'Unknown'}</strong><br>
            📞 <a href="tel:${order.customer?.phone}">${order.customer?.phone || 'N/A'}</a><br>
            ${order.customer?.email ? `✉️ <a href="mailto:${order.customer.email}">${order.customer.email}</a><br>` : ''}
            ${order.customer?.address ? `📍 ${order.customer.address}${order.customer.postcode ? `, ${order.customer.postcode}` : ''}` : ''}
          </p>
        </div>
        <div class="order-detail-card">
          <h4>Order Info</h4>
          <p>
            <strong>Ordered:</strong> ${formatDateTime(order.date)}<br>
            <strong>Collection:</strong> ${formatDate(order.customer?.collectionDate || '')}<br>
            ${order.customer?.notes ? `<strong>Notes:</strong> ${order.customer.notes}` : ''}
          </p>
        </div>
      </div>

      <table class="order-items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th style="text-align:right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map(item => `
            <tr>
              <td>${item.name}</td>
              <td>£${(item.price || 0).toFixed(2)} ${item.unit || ''}</td>
              <td>${item.qty}</td>
              <td style="text-align:right">£${((item.price || 0) * item.qty).toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="3">Estimated Total</td>
            <td style="text-align:right">£${(order.total || 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    `;

    const footer = $('#order-modal-footer');
    footer.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.75rem;flex:1;flex-wrap:wrap">
        <label style="font-weight:600;font-size:0.85rem;">Status:</label>
        <select class="order-status-select" id="order-status-change" data-id="${order.id}">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
          <option value="collected" ${order.status === 'collected' ? 'selected' : ''}>Collected</option>
        </select>
        <button class="btn btn-primary btn-sm" id="save-order-status">Update Status</button>
      </div>
      <button class="btn btn-danger btn-sm" id="delete-order-btn" data-id="${order.id}">Delete Order</button>
    `;

    // Save status
    footer.querySelector('#save-order-status').addEventListener('click', () => {
      const newStatus = footer.querySelector('#order-status-change').value;
      const orders = getOrders();
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx !== -1) {
        orders[idx].status = newStatus;
        saveOrders(orders);
        showToast(`Order #${orderId} updated to "${newStatus}"`);
        renderOrders();
        renderDashboard();
        closeOrderModal();
      }
    });

    // Delete
    footer.querySelector('#delete-order-btn').addEventListener('click', () => {
      if (!confirm('Are you sure you want to delete this order?')) return;
      const orders = getOrders();
      const updated = orders.filter(o => o.id !== orderId);
      saveOrders(updated);
      showToast(`Order #${orderId} deleted`);
      renderOrders();
      renderDashboard();
      closeOrderModal();
    });

    modal.hidden = false;
  };

  const closeOrderModal = () => {
    $('#order-modal').hidden = true;
  };

  // ==================== SETTINGS ====================
  const handlePasswordChange = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const current = formData.get('current');
    const newPass = formData.get('newPass');
    const confirm = formData.get('confirm');

    if (current !== getPassword()) {
      alert('Current password is incorrect.');
      return;
    }
    if (newPass !== confirm) {
      alert('New passwords do not match.');
      return;
    }
    if (newPass.length < 4) {
      alert('Password must be at least 4 characters.');
      return;
    }

    localStorage.setItem(KEYS.PASSWORD, newPass);
    form.reset();
    showToast('Password updated successfully');
  };

  const exportData = () => {
    const data = {
      products: loadProducts(),
      orders: getOrders(),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shaws-butchers-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported');
  };

  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.products && Array.isArray(data.products)) {
          saveProducts(data.products);
        }
        if (data.orders && Array.isArray(data.orders)) {
          saveOrders(data.orders);
        }
        renderProducts();
        renderOrders();
        renderDashboard();
        showToast('Data imported successfully');
      } catch {
        alert('Invalid JSON file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (!confirm('⚠️ This will delete ALL products, orders, and settings. Are you sure?')) return;
    if (!confirm('This cannot be undone. Type "yes" to confirm.')) return;
    localStorage.removeItem(KEYS.PRODUCTS);
    localStorage.removeItem(KEYS.ORDERS);
    localStorage.removeItem(KEYS.PASSWORD);
    showToast('All data has been reset');
    initDashboard();
  };

  // ==================== DARK MODE ====================
  const initDarkMode = () => {
    const stored = localStorage.getItem(KEYS.DARK_MODE);
    let isDark;
    if (stored !== null) {
      // User has explicitly chosen
      isDark = stored === 'true';
    } else {
      // Auto-detect system preference
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    // Update toggle icons
    updateDarkModeIcons(isDark);

    // Listen for system theme changes (only if user hasn't set a preference)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem(KEYS.DARK_MODE) === null) {
          const dark = e.matches;
          if (dark) {
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.removeAttribute('data-theme');
          }
          updateDarkModeIcons(dark);
        }
      });
    }
  };

  const toggleDarkMode = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newMode = !isDark;
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(KEYS.DARK_MODE, newMode);
    updateDarkModeIcons(newMode);
  };

  const updateDarkModeIcons = (isDark) => {
    document.querySelectorAll('.icon-moon').forEach(el => el.style.display = isDark ? 'none' : '');
    document.querySelectorAll('.icon-sun').forEach(el => el.style.display = isDark ? '' : 'none');
    document.querySelectorAll('.dark-mode-label').forEach(el => el.textContent = isDark ? 'Light Mode' : 'Dark Mode');
  };

  // ==================== INIT ====================
  const init = () => {
    // Dark mode — apply immediately before anything renders
    initDarkMode();

    // Auth
    if (checkAuth()) {
      showApp();
    } else {
      showLogin();
    }

    // Login form
    $('#login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = $('#login-pass').value;
      const remember = $('#login-remember')?.checked;
      if (login(pass, remember)) {
        showApp();
      } else {
        $('#login-error').hidden = false;
        $('#login-pass').value = '';
        $('#login-pass').focus();
      }
    });

    // Logout
    $('#logout-btn').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });

    // Sidebar navigation
    $$('.sidebar-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.page);
      });
    });

    // Dark mode toggles
    const dmToggle = $('#dark-mode-toggle');
    const dmToggleMobile = $('#dark-mode-toggle-mobile');
    if (dmToggle) dmToggle.addEventListener('click', toggleDarkMode);
    if (dmToggleMobile) dmToggleMobile.addEventListener('click', toggleDarkMode);

    // Dashboard "View All" links
    $$('[data-goto]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.goto);
      });
    });

    // Quick actions
    $$('.quick-action-btn[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'add-product') { navigateTo('products'); openProductModal(); }
        if (action === 'view-orders') navigateTo('orders');
      });
    });

    // Mobile sidebar toggle
    $('#sidebar-toggle').addEventListener('click', openMobileSidebar);

    // Product filters
    $$('#page-products .filter-btn[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#page-products .filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        productFilter = btn.dataset.cat;
        renderProducts();
      });
    });

    // Product search
    $('#products-search').addEventListener('input', (e) => {
      productSearch = e.target.value.trim();
      renderProducts();
    });

    // Order filters
    $$('#page-orders .filter-btn[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#page-orders .filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        orderFilter = btn.dataset.filter;
        renderOrders();
      });
    });

    // Order search
    $('#orders-search').addEventListener('input', (e) => {
      orderSearch = e.target.value.trim();
      renderOrders();
    });

    // Add product button
    $('#add-product-btn').addEventListener('click', () => openProductModal());

    // Product modal
    $('#modal-close').addEventListener('click', closeProductModal);
    $('#modal-cancel').addEventListener('click', closeProductModal);
    $('#product-form').addEventListener('submit', handleProductSave);
    $('#product-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeProductModal();
    });

    // Photo upload
    const photoPreview = $('#photo-preview');
    const photoInput = $('#pf-photo');

    photoPreview.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', (e) => {
      if (e.target.files[0]) handlePhotoUpload(e.target.files[0]);
    });

    // Photo drag & drop
    photoPreview.addEventListener('dragover', (e) => {
      e.preventDefault();
      photoPreview.style.borderColor = '#8B1A1A';
    });
    photoPreview.addEventListener('dragleave', () => {
      photoPreview.style.borderColor = '';
    });
    photoPreview.addEventListener('drop', (e) => {
      e.preventDefault();
      photoPreview.style.borderColor = '';
      if (e.dataTransfer.files[0]) handlePhotoUpload(e.dataTransfer.files[0]);
    });

    // Remove photo
    $('#remove-photo-btn').addEventListener('click', () => {
      currentPhotoData = null;
      const preview = $('#photo-preview');
      const img = preview.querySelector('img');
      if (img) img.remove();
      preview.classList.remove('has-image');
      $('#remove-photo-btn').hidden = true;
      $('#pf-photo').value = '';
    });

    // Order modal
    $('#order-modal-close').addEventListener('click', closeOrderModal);
    $('#order-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeOrderModal();
    });

    // Settings
    $('#change-password-form').addEventListener('submit', handlePasswordChange);
    $('#export-data-btn').addEventListener('click', exportData);
    $('#reset-data-btn').addEventListener('click', resetData);
    $('#import-data-btn').addEventListener('click', () => $('#import-file').click());
    $('#import-file').addEventListener('change', (e) => {
      if (e.target.files[0]) importData(e.target.files[0]);
      e.target.value = '';
    });



    // Poll for new orders every 30 seconds
    setInterval(() => {
      if (checkAuth()) {
        updateOrdersBadge();
        if (currentPage === 'orders') renderOrders();
        if (currentPage === 'dashboard') renderDashboard();
      }
    }, 30000);
  };

  document.addEventListener('DOMContentLoaded', init);
})();
