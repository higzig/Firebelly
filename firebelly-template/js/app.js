// =============================================================================
// Firebelly Minisite Template — App Logic
// Reads from FIREBELLY config (config.js) and renders all dynamic content.
// All user-visible content from config is HTML-escaped before insertion.
// Event handling uses delegation / addEventListener — no inline onclick in markup.
// =============================================================================

// ---------------------------------------------------------------------------
// Cart state
// ---------------------------------------------------------------------------
var cart = [];

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  renderHero();
  renderSchedule();
  renderStats();
  renderMenu();
  renderPickupTimes();
  renderEvents();
  renderReviews();
  renderInstagramGrid();
  renderSocialLinks();
  renderDesktopSidebar();
  renderOrder();
  bindEvents();
});

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

// Escape config strings before innerHTML insertion to prevent markup breakage.
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatPrice(n) {
  return '€' + n.toFixed(2).replace(/\.00$/, '');
}

function stars(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function buildWhatsAppUrl(phone, message) {
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
}

// Parse "HH:MM" → minutes since midnight.
function parseTime(str) {
  var p = str.split(':');
  return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
}

// Format "HH:MM" → "4:30pm".
function formatHour(str) {
  var p = str.split(':');
  var h = parseInt(p[0], 10);
  var m = parseInt(p[1], 10);
  var suffix = h >= 12 ? 'pm' : 'am';
  var h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
  return h12 + (m > 0 ? ':' + String(m).padStart(2, '0') : '') + suffix;
}

// ---------------------------------------------------------------------------
// Trading status
// Returns one of:
//   { state: 'open_now',      entry }
//   { state: 'opening_later', entry, opensAt }   — today but before start
//   { state: 'closed_today',  entry }             — today but after end time
//   { state: 'no_service',    entry: null }        — no schedule entry today
// ---------------------------------------------------------------------------
function getTradingStatus() {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var now = new Date();
  var todayName = days[now.getDay()];
  var entry = FIREBELLY.schedule.find(function (s) { return s.day === todayName && s.isOpen; });

  if (!entry) return { state: 'no_service', entry: null };

  var nowMin   = now.getHours() * 60 + now.getMinutes();
  var startMin = parseTime(entry.startTime);
  var endMin   = parseTime(entry.endTime);

  if (nowMin < startMin)  return { state: 'opening_later', entry: entry, opensAt: entry.startTime };
  if (nowMin >= endMin)   return { state: 'closed_today',  entry: entry };
  return { state: 'open_now', entry: entry };
}

function isOrderingOpen() {
  return getTradingStatus().state === 'open_now';
}

// Return today's entry only when open (used by hero badge and WhatsApp location).
function getTodayEntry() {
  var ts = getTradingStatus();
  return ts.state === 'open_now' ? ts.entry : null;
}

// Return upcoming (non-today) schedule entries sorted by days-from-today.
function getUpcomingEntries() {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var todayIdx = new Date().getDay();
  var todayName = days[todayIdx];
  return FIREBELLY.schedule
    .filter(function (s) { return s.day !== todayName; })
    .sort(function (a, b) {
      var ad = (days.indexOf(a.day) - todayIdx + 7) % 7;
      var bd = (days.indexOf(b.day) - todayIdx + 7) % 7;
      return ad - bd;
    });
}

var WA_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.523 5.834L.044 23.956l6.278-1.652A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.626 0 11.999 0zm.001 21.818a9.818 9.818 0 01-5.001-1.366l-.358-.213-3.724.979 1.001-3.638-.234-.373A9.789 9.789 0 012.182 12c0-5.413 4.405-9.818 9.818-9.818 5.413 0 9.818 4.405 9.818 9.818 0 5.414-4.405 9.818-9.818 9.818z"/></svg>';

var MAP_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';

// ---------------------------------------------------------------------------
// Event binding (replaces all inline onclick)
// ---------------------------------------------------------------------------
function bindEvents() {
  // Menu tab switching
  document.getElementById('menuTabs').addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-cat]');
    if (btn) switchTab(btn, btn.dataset.cat);
  });

  // Menu add-to-cart
  document.getElementById('menuList').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action="add"]');
    if (btn && !btn.disabled) addToCart(btn.dataset.id, btn);
  });

  // Cart quantity changes (event delegation — orderBody is re-rendered)
  document.getElementById('orderBody').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'qty-minus') changeQty(btn.dataset.id, -1);
    if (btn.dataset.action === 'qty-plus')  changeQty(btn.dataset.id,  1);
  });

  // WhatsApp order button
  document.getElementById('whatsappBtn').addEventListener('click', sendWhatsApp);

  // Nav scroll-to buttons (bottom bar Order button)
  document.querySelectorAll('[data-scroll-to]').forEach(function (el) {
    el.addEventListener('click', function () {
      scrollToSection(el.dataset.scrollTo);
    });
  });
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
function renderHero() {
  var b  = FIREBELLY.business;
  var h  = FIREBELLY.hero;
  var ts = getTradingStatus();

  document.getElementById('heroBg').style.backgroundImage =
    'linear-gradient(to bottom,rgba(26,15,5,.2) 0%,rgba(26,15,5,.7) 60%,rgba(26,15,5,.97) 100%),url(' + h.image + ')';

  var badgeText, badgeClass;
  if (ts.state === 'open_now') {
    badgeText  = '<span class="dot"></span>Open now — ' + esc(ts.entry.venue);
    badgeClass = 'hero-badge';
  } else if (ts.state === 'opening_later') {
    badgeText  = '<span class="dot dot--soon"></span>Opening at ' + formatHour(ts.entry.startTime) + ' — ' + esc(ts.entry.venue);
    badgeClass = 'hero-badge hero-badge--soon';
  } else {
    badgeText  = '<span class="dot dot--closed"></span>Not trading today';
    badgeClass = 'hero-badge hero-badge--closed';
  }
  var badgeEl = document.getElementById('heroBadge');
  badgeEl.innerHTML  = badgeText;
  badgeEl.className  = badgeClass;

  // Two-line title with line break and italic second line
  document.getElementById('heroTitle').innerHTML =
    esc(b.titleLine1) + '<br><em>' + esc(b.titleLine2) + '</em>';
  document.getElementById('heroSub').textContent = b.tagline;
}

// ---------------------------------------------------------------------------
// Schedule
// ---------------------------------------------------------------------------
function renderSchedule() {
  var ts       = getTradingStatus();
  var upcoming = getUpcomingEntries();
  var todayEl  = document.getElementById('scheduleToday');
  var upcomEl  = document.getElementById('scheduleUpcoming');

  if (ts.state === 'no_service') {
    todayEl.innerHTML =
      '<div class="location-now location-now--closed">' +
        '<div class="loc-status loc-status--off">Not trading today</div>' +
        '<p class="loc-detail">Check our next stop below.</p>' +
      '</div>';
  } else {
    var e = ts.entry;
    var statusLabel, statusClass;
    if (ts.state === 'open_now') {
      statusLabel = 'Open now';  statusClass = '';
    } else if (ts.state === 'opening_later') {
      statusLabel = 'Opening at ' + formatHour(e.startTime);  statusClass = 'loc-status--soon';
    } else {
      statusLabel = 'Closed for today';  statusClass = 'loc-status--off';
    }

    var waMsg = 'Hi! I’d like to pre-order from ' +
      FIREBELLY.business.titleLine1 + ' ' + FIREBELLY.business.titleLine2 + ' tonight.';

    todayEl.innerHTML =
      '<div class="location-now' + (ts.state === 'closed_today' ? ' location-now--closed' : '') + '">' +
        '<div class="loc-status ' + statusClass + '"><span class="dot' +
          (ts.state === 'open_now' ? '' : ts.state === 'opening_later' ? ' dot--soon' : ' dot--closed') +
          '"></span>' + statusLabel + '</div>' +
        '<p class="loc-name">' + esc(e.venue) + '</p>' +
        '<p class="loc-detail">' + esc(e.address) + (e.hours ? ' · ' + esc(e.hours) : '') + '</p>' +
        '<div class="loc-actions">' +
          (e.mapsUrl
            ? '<a href="' + e.mapsUrl + '" target="_blank" rel="noopener" class="loc-btn loc-btn--dir">' + MAP_ICON + ' Directions</a>'
            : '') +
          (ts.state === 'open_now' || ts.state === 'opening_later'
            ? '<a href="' + buildWhatsAppUrl(FIREBELLY.business.whatsapp, waMsg) + '" target="_blank" rel="noopener" class="loc-btn loc-btn--wa">' + WA_ICON + ' Quick pre-order</a>'
            : '') +
        '</div>' +
      '</div>';
  }

  if (upcoming.length > 0) {
    upcomEl.innerHTML = upcoming.slice(0, 3).map(function (s) {
      return '<div class="location-next">' +
        '<div class="loc-next-info">' +
          '<p class="loc-next-label">Next up — ' + esc(s.day) + '</p>' +
          '<p class="loc-next-name">' + esc(s.venue) + '</p>' +
          '<p class="loc-next-time">' + esc(s.hours) + '</p>' +
        '</div>' +
        (s.mapsUrl
          ? '<a href="' + s.mapsUrl + '" target="_blank" rel="noopener" class="loc-next-arrow" aria-label="Directions to ' + esc(s.venue) + '">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></a>'
          : '') +
      '</div>';
    }).join('');
  }
}

// ---------------------------------------------------------------------------
// Stats strip
// ---------------------------------------------------------------------------
function renderStats() {
  document.getElementById('statsStrip').innerHTML =
    FIREBELLY.stats.map(function (s) {
      return '<div class="why-item">' +
        '<span class="why-num">' + esc(s.value) + '</span>' +
        '<span class="why-label">' + esc(s.label) + '</span>' +
      '</div>';
    }).join('');
}

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------
function renderItemBadges(item) {
  var html = '';
  if (item.tags.indexOf('popular') !== -1) html += '<span class="item-badge badge-popular">★ Signature</span>';
  if (item.tags.indexOf('special') !== -1) html += '<span class="item-badge badge-special">❖ Special</span>';
  if (item.tags.indexOf('veg')     !== -1) html += '<span class="item-badge badge-veg">V</span>';
  if (item.tags.indexOf('spicy')   !== -1) html += '<span class="item-badge badge-spicy">Spicy</span>';
  if (item.glutenFreeAvail)                html += '<span class="item-badge badge-gf">GF avail</span>';
  return html ? '<div class="item-badges">' + html + '</div>' : '';
}

function renderMenu() {
  var cfg  = FIREBELLY.menu;
  var ts   = getTradingStatus();
  var open = ts.state === 'open_now';

  // Closed-state label for add buttons
  var closedLabel = ts.state === 'opening_later'
    ? 'Opens ' + formatHour(ts.entry.startTime)
    : 'Not ordering today';

  // Optional closed banner above items when not open
  var closedBanner = open ? '' :
    '<div class="menu-closed-banner">' +
      (ts.state === 'opening_later'
        ? 'Pre-ordering opens at <strong>' + formatHour(ts.entry.startTime) + '</strong> — browse the menu below.'
        : 'Not taking orders today. Browse the menu and come back next time.') +
    '</div>';

  // Tabs
  document.getElementById('menuTabs').innerHTML = cfg.categories.map(function (cat, i) {
    return '<button class="menu-tab' + (i === 0 ? ' active' : '') + '" ' +
      'data-cat="' + esc(cat.id) + '" role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '">' +
      esc(cat.label) + '</button>';
  }).join('');

  // Item panels
  document.getElementById('menuList').innerHTML = cfg.categories.map(function (cat, i) {
    var items = cfg.items.filter(function (it) { return it.category === cat.id; });
    return '<div class="menu-panel' + (i === 0 ? ' active' : '') + '" id="cat-' + esc(cat.id) + '" role="tabpanel">' +
      (i === 0 ? closedBanner : '') +
      items.map(function (item) {
        var soldOut = item.soldOut;
        var addControl;
        if (soldOut) {
          addControl = '<span class="sold-out-label">Sold out</span>';
        } else if (open) {
          addControl = '<button class="add-btn" data-action="add" data-id="' + esc(item.id) + '" ' +
            'aria-label="Add ' + esc(item.name) + ' to order">+ Add</button>';
        } else {
          addControl = '<button class="add-btn add-btn--closed" disabled ' +
            'aria-label="Ordering closed">' + esc(closedLabel) + '</button>';
        }
        return '<div class="menu-item' + (soldOut ? ' is-soldout' : '') + '">' +
          '<img class="menu-item-img" src="' + item.image + '" alt="' + esc(item.name) + '" width="54" height="54" loading="lazy">' +
          '<div class="menu-item-body">' +
            '<span class="menu-item-name">' + esc(item.name) + '</span>' +
            renderItemBadges(item) +
            '<p class="menu-item-desc">' + esc(item.desc) + '</p>' +
            (item.allergens ? '<p class="menu-item-allergens">Contains: ' + esc(item.allergens) + '</p>' : '') +
          '</div>' +
          '<div class="menu-item-right">' +
            '<span class="menu-item-price">' + formatPrice(item.price) + '</span>' +
            addControl +
          '</div>' +
        '</div>';
      }).join('') +
      (cat.id !== 'sides' ? '<p class="menu-note-bar">Gluten-free base available. Ask us about allergens.</p>' : '') +
    '</div>';
  }).join('');
}

function switchTab(btn, catId) {
  document.querySelectorAll('.menu-tab').forEach(function (t) {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.menu-panel').forEach(function (p) {
    p.classList.remove('active');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  var panel = document.getElementById('cat-' + catId);
  if (panel) panel.classList.add('active');
}

// ---------------------------------------------------------------------------
// Pickup time options
// ---------------------------------------------------------------------------
function renderPickupTimes() {
  var sel = document.getElementById('timeSelect');
  FIREBELLY.pickupTimes.forEach(function (t) {
    var opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  });
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
function renderEvents() {
  var ev = FIREBELLY.events;
  document.getElementById('eventsBg').style.backgroundImage =
    'linear-gradient(to bottom,rgba(26,15,5,.5) 0%,rgba(26,15,5,.88) 100%),url(' + ev.image + ')';
  document.getElementById('eventsDesc').textContent = ev.description;
  document.getElementById('eventsList').innerHTML = ev.types.map(function (t) {
    return '<li class="events-item">' + esc(t) + '</li>';
  }).join('');
  document.getElementById('eventsMeta').innerHTML =
    'Min. ' + esc(String(ev.minGuests)) + ' guests &nbsp;&middot;&nbsp; ' + esc(ev.serviceArea);
  document.getElementById('eventsBtn').href =
    buildWhatsAppUrl(FIREBELLY.business.whatsapp, ev.enquiryMessage);
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
function renderReviews() {
  document.getElementById('reviewsList').innerHTML =
    FIREBELLY.reviews.map(function (r) {
      return '<div class="review-card">' +
        '<div class="review-meta">' +
          '<span class="review-stars" aria-label="' + r.rating + ' out of 5 stars">' + stars(r.rating) + '</span>' +
          '<span class="review-source">' + esc(r.source) + '</span>' +
        '</div>' +
        '<p class="review-text">“' + esc(r.text) + '”</p>' +
        '<p class="review-author">— ' + esc(r.author) + '</p>' +
      '</div>';
    }).join('');
}

// ---------------------------------------------------------------------------
// Instagram grid
// ---------------------------------------------------------------------------
function renderInstagramGrid() {
  document.getElementById('instaGrid').innerHTML =
    FIREBELLY.instagramGrid.map(function (img) {
      return '<a href="' + FIREBELLY.business.instagram.url + '" target="_blank" rel="noopener" class="insta-thumb-wrap" aria-label="View on Instagram">' +
        '<img class="insta-thumb" src="' + img.src + '" alt="' + esc(img.alt) + '" width="200" height="200" loading="lazy">' +
      '</a>';
    }).join('');
}

// ---------------------------------------------------------------------------
// Social links
// ---------------------------------------------------------------------------
function renderSocialLinks() {
  var b = FIREBELLY.business;
  var links = [
    {
      href: b.instagram.url,
      label: b.instagram.handle,
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>'
    },
    {
      href: b.facebook.url,
      label: b.facebook.name,
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>'
    }
  ];
  document.getElementById('socialLinks').innerHTML = links.map(function (l) {
    return '<a href="' + l.href + '" target="_blank" rel="noopener" class="social-link">' +
      l.icon +
      '<span>' + esc(l.label) + '</span>' +
      '<span class="arrow" aria-hidden="true">→</span>' +
    '</a>';
  }).join('');
}

// ---------------------------------------------------------------------------
// Desktop sidebar
// ---------------------------------------------------------------------------
function renderDesktopSidebar() {
  var b  = FIREBELLY.business;
  var ts = getTradingStatus();
  var nameEl = document.getElementById('dsBrandName');
  var statusEl = document.getElementById('dsStatus');
  if (!nameEl) return;

  nameEl.textContent = b.titleLine1 + ' ' + b.titleLine2;

  var taglineEl = document.getElementById('dsBrandTagline');
  if (taglineEl) taglineEl.textContent = b.tagline;

  var statusHtml, statusClass;
  if (ts.state === 'open_now') {
    statusHtml  = '<span class="dot"></span>Open now — ' + esc(ts.entry.venue);
    statusClass = 'ds-status ds-status--open';
  } else if (ts.state === 'opening_later') {
    statusHtml  = '<span class="dot dot--soon"></span>Opening at ' + formatHour(ts.entry.startTime);
    statusClass = 'ds-status ds-status--soon';
  } else {
    statusHtml  = '<span class="dot dot--closed"></span>Not trading today';
    statusClass = 'ds-status ds-status--closed';
  }
  statusEl.innerHTML  = statusHtml;
  statusEl.className  = statusClass;
}

// ---------------------------------------------------------------------------
// Cart — add / change quantity
// ---------------------------------------------------------------------------
function addToCart(itemId, btn) {
  if (!isOrderingOpen()) return;
  var item = FIREBELLY.menu.items.find(function (i) { return i.id === itemId; });
  if (!item || item.soldOut) return;

  var existing = cart.find(function (i) { return i.id === itemId; });
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }

  btn.textContent = 'Added ✓';
  btn.classList.add('added');
  setTimeout(function () {
    btn.textContent = '+ Add';
    btn.classList.remove('added');
  }, 1200);

  renderOrder();
}

function changeQty(itemId, delta) {
  var idx = cart.findIndex(function (i) { return i.id === itemId; });
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderOrder();
}

// ---------------------------------------------------------------------------
// Order panel rendering
// ---------------------------------------------------------------------------
function renderOrder() {
  var body    = document.getElementById('orderBody');
  var badge   = document.getElementById('cartBadge');
  var totalEl = document.getElementById('orderTotal');
  var section = document.getElementById('order');

  var open = isOrderingOpen();
  section.classList.toggle('is-ordering-closed', !open);

  if (!open) {
    var ts       = getTradingStatus();
    var upcoming = getUpcomingEntries();
    var nextStop = upcoming[0];

    badge.textContent = '';
    badge.classList.remove('show');
    totalEl.textContent = '€0';

    var nextMsg = nextStop
      ? 'Next stop: ' + esc(nextStop.venue) + ', ' + esc(nextStop.day) + ' · ' + esc(nextStop.hours)
      : 'Check our schedule for upcoming stops.';

    var reopenMsg = ts.state === 'opening_later'
      ? 'Pre-ordering opens at ' + formatHour(ts.entry.startTime) + ' today.'
      : '';

    body.innerHTML =
      '<div class="order-closed">' +
        '<p class="order-closed-title">Not taking orders right now</p>' +
        (reopenMsg ? '<p class="order-closed-reopen">' + reopenMsg + '</p>' : '') +
        '<p class="order-closed-next">' + nextMsg + '</p>' +
        '<a href="#today" class="order-closed-link">See full schedule →</a>' +
        '<a href="#events" class="order-closed-link order-closed-link--events">Book a private event →</a>' +
      '</div>';
    return;
  }

  var totalQty = cart.reduce(function (s, i) { return s + i.qty; }, 0);
  var totalAmt = cart.reduce(function (s, i) { return s + i.qty * i.price; }, 0);

  badge.textContent = totalQty > 0 ? String(totalQty) : '';
  badge.classList.toggle('show', totalQty > 0);
  totalEl.textContent = formatPrice(totalAmt);

  if (cart.length === 0) {
    body.innerHTML =
      '<div class="order-empty">' +
        '<p>Nothing here yet.</p>' +
        '<a href="#menu" class="order-empty-link">Browse the menu →</a>' +
      '</div>';
    return;
  }

  body.innerHTML = cart.map(function (item) {
    return '<div class="order-line">' +
      '<span class="order-line-name">' + esc(item.name) + '</span>' +
      '<div class="qty-row">' +
        '<button class="qty-btn" data-action="qty-minus" data-id="' + esc(item.id) + '" aria-label="Remove one ' + esc(item.name) + '">−</button>' +
        '<span class="qty-num" aria-label="quantity">' + item.qty + '</span>' +
        '<button class="qty-btn" data-action="qty-plus"  data-id="' + esc(item.id) + '" aria-label="Add one more ' + esc(item.name) + '">+</button>' +
      '</div>' +
      '<span class="order-line-price">' + formatPrice(item.qty * item.price) + '</span>' +
    '</div>';
  }).join('');
}

// ---------------------------------------------------------------------------
// WhatsApp order
// ---------------------------------------------------------------------------
function sendWhatsApp() {
  if (!isOrderingOpen()) {
    alert('We are not taking orders right now. Come back when we’re open!');
    return;
  }
  if (cart.length === 0) {
    alert('Add some items from the menu first!');
    return;
  }
  var time = document.getElementById('timeSelect').value;
  if (!time) {
    alert('Please choose a collection time.');
    return;
  }

  var today    = getTodayEntry();
  var location = today ? today.venue + ', ' + today.address : '';
  var notes    = (document.getElementById('orderNotes').value || '').trim();
  var lines    = cart.map(function (i) { return i.qty + 'x ' + i.name + ' (' + formatPrice(i.qty * i.price) + ')'; });
  var total    = cart.reduce(function (s, i) { return s + i.qty * i.price; }, 0);

  var msg =
    'Hi! I’d like to pre-order from ' + FIREBELLY.business.titleLine1 + ' ' + FIREBELLY.business.titleLine2 + ' 🍕\n\n' +
    lines.join('\n') + '\n\n' +
    'Total: ' + formatPrice(total) + '\n' +
    'Collection time: ' + time + '\n' +
    (location ? 'Location: ' + location + '\n' : '') +
    (notes    ? 'Notes: '    + notes    + '\n' : '') +
    '\nThanks!';

  window.open(buildWhatsAppUrl(FIREBELLY.business.whatsapp, msg), '_blank');
}

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------
function scrollToSection(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
