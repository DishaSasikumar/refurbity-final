// Product search with similar-item suggestions.
// Requires PRODUCT_DATABASE from products.js to be loaded first.

(function () {
  const searchInput = document.querySelector('.search-field');
  const searchBtn = document.querySelector('.search-btn');
  if (!searchInput || typeof PRODUCT_DATABASE === 'undefined') return;

  // Build the results overlay once, reused on every search.
  const overlay = document.createElement('div');
  overlay.id = 'search-results-overlay';
  overlay.className = 'search-results-overlay';
  overlay.innerHTML = `
    <div class="search-results-panel">
      <div class="search-results-header">
        <h2 class="search-results-title" id="search-results-title">Results</h2>
        <button class="search-results-close" id="search-results-close" aria-label="Close search results">&times;</button>
      </div>
      <div class="search-results-body" id="search-results-body"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const resultsBody = overlay.querySelector('#search-results-body');
  const resultsTitle = overlay.querySelector('#search-results-title');
  const closeBtn = overlay.querySelector('#search-results-close');

  function closeResults() {
    overlay.classList.remove('open');
  }
  closeBtn.addEventListener('click', closeResults);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeResults();
  });

  function formatPrice(n) {
    return '₹' + n.toLocaleString('en-IN');
  }

  function renderProductCard(product) {
    const safeImg = product.img.startsWith('static') ? product.img : product.img;
    return `
      <div class="search-product-card">
        <img src="${safeImg}" alt="${product.name}" class="search-product-img" loading="lazy">
        <div class="search-product-info">
          <p class="search-product-name">${product.name}</p>
          <p class="search-product-price">${formatPrice(product.price)}</p>
          <span class="search-product-category">${product.category}</span>
          <div class="search-product-actions">
            <button class="search-btn-cart" onclick="searchAddToCart(${JSON.stringify(product.name)}, ${product.price}, ${JSON.stringify(safeImg)})">🛒 Add to Cart</button>
            <button class="search-btn-buy" onclick="searchBuyNow(${JSON.stringify(product.name)}, ${product.price}, ${JSON.stringify(safeImg)})">⚡ Buy Now</button>
          </div>
        </div>
      </div>
    `;
  }

  function runSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      closeResults();
      return;
    }

    const exactMatches = PRODUCT_DATABASE.filter(p =>
      p.name.toLowerCase().includes(q)
    );

    let html = '';

    if (exactMatches.length > 0) {
      resultsTitle.textContent = `Results for "${query}"`;
      html += '<div class="search-product-grid">';
      exactMatches.forEach(p => { html += renderProductCard(p); });
      html += '</div>';

      // Similar products: same category as the matches, excluding the matches themselves
      const matchedCategories = [...new Set(exactMatches.map(p => p.category))];
      const matchedNames = new Set(exactMatches.map(p => p.name));
      const similar = PRODUCT_DATABASE.filter(p =>
        matchedCategories.includes(p.category) && !matchedNames.has(p.name)
      ).slice(0, 8);

      if (similar.length > 0) {
        html += '<h3 class="search-section-label">You might also like</h3>';
        html += '<div class="search-product-grid">';
        similar.forEach(p => { html += renderProductCard(p); });
        html += '</div>';
      }
    } else {
      resultsTitle.textContent = `No exact matches for "${query}"`;
      // Fall back to fuzzy: split query into words, match any word against name or category
      const words = q.split(/\s+/).filter(Boolean);
      const fuzzy = PRODUCT_DATABASE.filter(p => {
        const haystack = (p.name + ' ' + p.category).toLowerCase();
        return words.some(w => haystack.includes(w));
      }).slice(0, 12);

      if (fuzzy.length > 0) {
        html += '<h3 class="search-section-label">You might be looking for</h3>';
        html += '<div class="search-product-grid">';
        fuzzy.forEach(p => { html += renderProductCard(p); });
        html += '</div>';
      } else {
        html += '<p class="search-no-results">No products found. Try a different search term.</p>';
      }
    }

    resultsBody.innerHTML = html;
    overlay.classList.add('open');
  }

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSearch(searchInput.value);
    }
  });

  if (searchBtn) {
    searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      runSearch(searchInput.value);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeResults();
  });
})();

// Helper: Add to cart from search results
function searchAddToCart(name, price, img) {
  if (typeof addToCart === 'function') {
    addToCart({ name, price, img });
  } else {
    // Fallback: use cart stored in localStorage
    const cart = JSON.parse(localStorage.getItem('refurbity-cart') || '[]');
    const existing = cart.find(i => i.name === name);
    if (existing) { existing.qty = (existing.qty || 1) + 1; }
    else { cart.push({ name, price, img, qty: 1 }); }
    localStorage.setItem('refurbity-cart', JSON.stringify(cart));
    const countEl = document.getElementById('item-count');
    if (countEl) countEl.textContent = cart.reduce((s, i) => s + (i.qty || 1), 0);
  }
  showCartToast(name);
}

// Helper: Buy Now from search results
function searchBuyNow(name, price, img) {
  searchAddToCart(name, price, img);
  // Redirect to cart page if available
  const cartLink = document.querySelector('a[href*="Cart"], a[href*="cart"]');
  if (cartLink) { window.location.href = cartLink.href; }
}

function showCartToast(name) {
  const toast = document.createElement('div');
  toast.className = 'search-cart-toast';
  toast.textContent = `✓ "${name.length > 30 ? name.slice(0,30)+'…' : name}" added to cart`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);
  setTimeout(() => { toast.classList.remove('visible'); setTimeout(() => toast.remove(), 300); }, 2500);
}
