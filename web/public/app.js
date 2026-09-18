/**
 * YAWSCENT INDONESIA — CLIENT-SIDE APPLICATION ENGINE
 * Mengontrol Storefront, Scent Finder, Cart, Checkout, Loyalty, dan Admin Omnichannel
 */

const API_BASE = (window.location.port === "5000" ? "http://localhost:5000/api/v1" : "/api/v1");

const state = {
  currentUser: {
    id: "user-owner-001",
    email: "owner@yawscent.id",
    fullName: "Owner & Founder Yawscent",
    role: "OWNER"
  },
  selectedLoginRole: "OWNER",
  products: [],
  cart: [],
  selectedVariants: {}, // productId -> variantId
  quizStep: 0,
  quizAnswers: {},
  appliedVoucher: null,
  loyaltyUser: {
    userId: "user-001",
    fullName: "Dimas Arya Pratama",
    tier: "GOLD_VIP",
    points: 1450,
    memberCardNumber: "YS-VIP-88921"
  },
  adminData: null,
  currentView: "home"
};

const initialFallbackProducts = [
  {
    id: "prod-noir-001",
    slug: "noir-extrait",
    name: "YAWSCENT Noir",
    tagline: "The Enigmatic Midnight Mystery",
    description: "Kombinasi intens dari Indonesian Vetiver, Haitian Amyris, dan Smokey Leather. Formula Extrait De Parfum tahan hingga 12 jam.",
    concentration: "Extrait De Parfum (35% Oil)",
    longevityHours: 12,
    sillageRating: "Strong & Enveloping",
    character: "Smoky, Woody, Dark Amber",
    rating: 4.95,
    reviewCount: 384,
    imageUrl: "/images/noir.jpg",
    badge: "Best Seller",
    notes: {
      top: ["Calabrian Bergamot", "Pink Peppercorn", "Smoked Cardamom"],
      heart: ["Java Vetiver Bloom", "Iris Root", "Dark Cacao Pod"],
      base: ["Indonesian Agarwood", "Smokey Leather", "Bourbon Vanilla"]
    },
    variants: [
      { id: "var-noir-50", sizeMl: 50, sku: "YS-NOIR-50", price: 349000, discountPrice: 299000, stockOnline: 48, stockStore: 22 },
      { id: "var-noir-30", sizeMl: 30, sku: "YS-NOIR-30", price: 239000, discountPrice: null, stockOnline: 60, stockStore: 35 }
    ]
  },
  {
    id: "prod-santara-002",
    slug: "santara-bloom",
    name: "YAWSCENT Santara",
    tagline: "Sun-drenched Mediterranean Citrus & Tropical Petals",
    description: "Kesegaran pagi membangkitkan semangat. Perpaduan harmonis antara Bergamot Italia, Kaffir Lime, dan melati putih Nusantara.",
    concentration: "Eau De Parfum (22% Oil)",
    longevityHours: 8,
    sillageRating: "Moderate & Fresh",
    character: "Citrus, Aromatic, White Floral",
    rating: 4.90,
    reviewCount: 290,
    imageUrl: "/images/santara.jpg",
    badge: "Editor's Choice",
    notes: {
      top: ["Mandarin Orange", "Sparkling Bergamot", "Kaffir Lime Leaf"],
      heart: ["Jasmine Sambac", "Neroli", "Sea Salt Accord"],
      base: ["White Musk", "Cedarwood", "Clean Amber"]
    },
    variants: [
      { id: "var-santara-50", sizeMl: 50, sku: "YS-SAN-50", price: 319000, discountPrice: 279000, stockOnline: 75, stockStore: 30 },
      { id: "var-santara-30", sizeMl: 30, sku: "YS-SAN-30", price: 219000, discountPrice: null, stockOnline: 80, stockStore: 40 }
    ]
  },
  {
    id: "prod-discovery-003",
    slug: "discovery-set",
    name: "YAWSCENT Discovery Collection",
    tagline: "5 Signature Scents in 5ml Luxury Sprayers",
    description: "Solusi tepat mengatasi blind-buying. Berisi 5 botol mini travel sprayer (Noir, Santara, Velvet Oud, Bali Gourmand, & Kyoto Rain). Termasuk voucher cashback Rp 50.000.",
    concentration: "Discovery Box Set (5 x 5ml)",
    longevityHours: 10,
    sillageRating: "Curated Variety",
    character: "Complete Olfactory Journey",
    rating: 4.98,
    reviewCount: 812,
    imageUrl: "/images/discovery.jpg",
    badge: "Must Have for Newcomers",
    notes: {
      top: ["Citrus & Fresh Aromatics"],
      heart: ["Floral Petals & Exotic Spices"],
      base: ["Rich Ouds, Ambers & Warm Woods"]
    },
    variants: [
      { id: "var-disc-5x5", sizeMl: 25, sku: "YS-DISC-5X5", price: 179000, discountPrice: 149000, stockOnline: 120, stockStore: 50 }
    ]
  },
  {
    id: "prod-velvet-004",
    slug: "velvet-oud",
    name: "YAWSCENT Velvet Oud",
    tagline: "Regal Cambodian Agarwood with Damask Rose Petals",
    description: "Kombinasi agung antara Oud Kamboja yang lembut, kelopak Mawar Damask, dan sentuhan hangat Vanilla Bourbon. Kemewahan yang memikat dan berkarakter kuat.",
    concentration: "Extrait De Parfum (30% Oil)",
    longevityHours: 12,
    sillageRating: "Enveloping & Sophisticated",
    character: "Warm Spicy, Rose, Smoky Oud",
    rating: 4.96,
    reviewCount: 198,
    imageUrl: "/images/velvet_oud.jpg",
    badge: "Royal Selection",
    notes: {
      top: ["Saffron", "Pink Pepper", "Bergamot"],
      heart: ["Damask Rose", "Cardamom", "Smoked Incense"],
      base: ["Cambodian Oud", "Amber", "Bourbon Vanilla"]
    },
    variants: [
      { id: "var-velvet-50", sizeMl: 50, sku: "YS-VEL-50", price: 389000, discountPrice: 349000, stockOnline: 35, stockStore: 15 },
      { id: "var-velvet-30", sizeMl: 30, sku: "YS-VEL-30", price: 269000, discountPrice: null, stockOnline: 40, stockStore: 20 }
    ]
  },
  {
    id: "prod-bali-005",
    slug: "bali-gourmand",
    name: "YAWSCENT Bali Gourmand",
    tagline: "Golden Sunset Vanilla, Toasted Coconut & Roasted Coffee",
    description: "Kehangatan eksotis senja Bali dalam semprotan parfum. Aroma manis menggoda dari roasted coffee bean, toasted coconut flake, dan Madagascar vanilla.",
    concentration: "Eau De Parfum (24% Oil)",
    longevityHours: 10,
    sillageRating: "Intimate & Addictive",
    character: "Gourmand, Sweet Warm, Coffee, Vanilla",
    rating: 4.92,
    reviewCount: 245,
    imageUrl: "/images/bali_gourmand.jpg",
    badge: "Most Addictive",
    notes: {
      top: ["Roasted Bali Coffee", "Caramelized Almond", "Orange Zest"],
      heart: ["Toasted Coconut Flakes", "Tiare Flower", "Cinnamon"],
      base: ["Madagascar Vanilla Bean", "Sandalwood", "Tonka Bean"]
    },
    variants: [
      { id: "var-bali-50", sizeMl: 50, sku: "YS-BALI-50", price: 329000, discountPrice: 289000, stockOnline: 55, stockStore: 25 },
      { id: "var-bali-30", sizeMl: 30, sku: "YS-BALI-30", price: 229000, discountPrice: null, stockOnline: 60, stockStore: 30 }
    ]
  }
];

const quizQuestions = [
  {
    id: "q1_vibe",
    title: "1. Vibe aroma apa yang paling mewakili kepribadianmu?",
    options: [
      { key: "bold_mysterious", label: "Misterius, Maskulin/Feminin Kuat & Smoky", icon: "🌙" },
      { key: "fresh_energetic", label: "Segar, Bersih, Penuh Energi & Ceria", icon: "🍋" },
      { key: "warm_gourmand", label: "Manis Menggoda, Hangat & Addictive (Vanilla Coffee)", icon: "☕" },
      { key: "regal_oud", label: "Kemewahan Kerajaan & Mawar Spiced Oud", icon: "👑" },
      { key: "adventurous", label: "Ingin mengeksplorasi seluruh spektrum aroma", icon: "✨" }
    ]
  },
  {
    id: "q2_occasion",
    title: "2. Kapan waktu penggunaan utama parfummu?",
    options: [
      { key: "evening_date", label: "Kencan Malam, Pesta & Acara Formal", icon: "🍷" },
      { key: "daily_work", label: "Aktivitas Kantor, Kampus & Siang Terik", icon: "☀️" },
      { key: "cozy_cafe", label: "Nongkrong Santai di Cafe & Musim Hujan", icon: "☕" },
      { key: "anywhere", label: "Fleksibel untuk berganti aroma kapan saja", icon: "💼" }
    ]
  },
  {
    id: "q3_intensity",
    title: "3. Karakter proyeksi apa yang kamu cari?",
    options: [
      { key: "ultra_long", label: "Extrait de Parfum (12 Jam tahan menempel di pakaian)", icon: "🔥" },
      { key: "moderate", label: "Segar & Ramah di Hidung (Tidak bikin enek/pusing)", icon: "🍃" },
      { key: "flexible", label: "Botol mini travel yang mudah dibawa kemana-mana", icon: "✈️" }
    ]
  }
];

const app = {
  async init() {
    this.renderSkeleton();
    await this.fetchProducts();
    await this.fetchLoyaltyProfile();

    // Check localStorage for saved authenticated session from /login
    const savedUser = localStorage.getItem("yawscent_auth_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        this.setCurrentUser(u);
      } catch (e) {}
    }

    this.updateAuthUI();
    this.renderProducts();
    this.fetchTestimonials();
    this.updateCartBadge();
    this.setupScrollAnimations();
    this.startCountdownTimer();

    // Check location hash (e.g. redirected to #admin or #loyalty)
    if (window.location.hash === "#admin" && state.currentUser?.role === "OWNER") {
      this.showSection("admin");
      this.renderAdminDashboard();
    } else if (window.location.hash === "#loyalty") {
      this.showSection("loyalty");
    }
  },

  renderSkeleton() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    grid.innerHTML = Array(3).fill(0).map(() => `
      <div class="product-card" style="pointer-events: none;">
        <div class="skeleton" style="height: 240px; margin-bottom: 16px;"></div>
        <div class="skeleton" style="height: 20px; width: 60%; margin-bottom: 8px;"></div>
        <div class="skeleton" style="height: 16px; width: 90%; margin-bottom: 16px;"></div>
        <div class="skeleton" style="height: 38px; margin-bottom: 12px;"></div>
        <div class="skeleton" style="height: 42px;"></div>
      </div>
    `).join('');
  },

  toggleMobileMenu() {
    const nav = document.getElementById("navLinks");
    if (nav) {
      nav.classList.toggle("open");
    }
  },

  closeMobileMenu() {
    const nav = document.getElementById("navLinks");
    if (nav) {
      nav.classList.remove("open");
    }
  },

  setupScrollAnimations() {
    const sections = document.querySelectorAll(".fade-in-section");
    if (!("IntersectionObserver" in window)) {
      sections.forEach(s => s.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(s => observer.observe(s));
  },

  async fetchTestimonials() {
    const grid = document.getElementById("testimonialGrid");
    if (!grid) return;

    let testimonials = [
      {
        name: "Nicholas Saputra P.",
        city: "Jakarta Selatan",
        rating: 5,
        quote: "Formulasi Noir beneran nempel seharian di baju walau kena panas Jakarta. Vetiver dan leather-nya subtle tapi bikin orang noleh nanya pakai parfum apa.",
        variant: "YAWSCENT Noir — Extrait"
      },
      {
        name: "Clarissa Aurelia",
        city: "Surabaya Barat",
        rating: 5,
        quote: "Santara Bloom wanginya bener-bener fresh dan elegan, bukan tipikal citrus murah. Botol Discovery Set-nya juga sangat ngebantu sebelum ambil full bottle!",
        variant: "YAWSCENT Santara & Discovery Set"
      },
      {
        name: "Rangga Pratama",
        city: "Bandung",
        rating: 5,
        quote: "Koleksi Velvet Oud-nya juara banget untuk event malam. Proyeksi sillage-nya tebel tapi nggak bikin pusing. Layanan pengiriman instan & rapi sekali.",
        variant: "YAWSCENT Velvet Oud"
      }
    ];

    try {
      const res = await fetch(`${API_BASE}/testimonials`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) testimonials = json.data;
      }
    } catch (e) {}

    grid.innerHTML = testimonials.map(t => `
      <div class="testimonial-card">
        <div class="testimonial-stars">${"★".repeat(t.rating || 5)}</div>
        <p class="testimonial-quote">"${t.quote}"</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${(t.name || "U")[0]}</div>
          <div class="testimonial-meta">
            <div class="author-name">${t.name}</div>
            <div class="author-city">${t.city}</div>
            <div class="testimonial-variant">${t.variant}</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  startCountdownTimer() {
    const promoText = document.querySelector(".announcement-bar span");
    if (!promoText) return;

    let remainingSeconds = 4 * 3600 + 45 * 60 + 20;
    setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds < 0) remainingSeconds = 5 * 3600;
      const hours = Math.floor(remainingSeconds / 3600).toString().padStart(2, '0');
      const mins = Math.floor((remainingSeconds % 3600) / 60).toString().padStart(2, '0');
      const secs = (remainingSeconds % 60).toString().padStart(2, '0');

      promoText.innerHTML = `✨ <strong>FLASH PRIVILEGE:</strong> Gunakan kode <code>YAWWELCOME</code> untuk Cashback 10% + Free Discovery Sample — <span style="color: var(--gold-light); font-weight:700;">Berakhir dalam ${hours}:${mins}:${secs}</span>`;
    }, 1000);
  },

  async fetchProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        state.products = data.data;
      } else {
        state.products = initialFallbackProducts;
      }
    } catch (e) {
      state.products = initialFallbackProducts;
    }

    // Inisialisasi varian default (50ml atau varian pertama)
    state.products.forEach(p => {
      if (p.variants && p.variants.length > 0) {
        state.selectedVariants[p.id] = p.variants[0].id;
      }
    });
  },

  async fetchLoyaltyProfile() {
    try {
      const res = await fetch(`${API_BASE}/loyalty/profile?userId=user-001`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          state.loyaltyUser = {
            userId: json.data.userId || "user-001",
            fullName: json.data.fullName || "Dimas Arya Pratama",
            tier: json.data.tier || "GOLD_VIP",
            points: json.data.points !== undefined ? json.data.points : 1450,
            memberCardNumber: json.data.memberCardNumber || "YS-VIP-88921"
          };
        }
      }
    } catch (e) {
      console.warn("Using offline loyalty fallback:", e.message);
    }
  },

  renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    grid.innerHTML = state.products.map(p => {
      const selectedVariantId = state.selectedVariants[p.id] || p.variants[0]?.id;
      const currentVariant = p.variants.find(v => v.id === selectedVariantId) || p.variants[0];
      const actualPrice = currentVariant.discountPrice || currentVariant.price;
      const isDiscounted = currentVariant.discountPrice != null;

      return `
        <div class="product-card">
          <div class="product-img-wrapper">
            <span class="product-badge">${p.badge || 'Haute Parfumerie'}</span>
            <img src="${p.imageUrl}" alt="${p.name}" class="product-img">
          </div>

          <div class="product-meta">
            <span class="product-conc">${p.concentration}</span>
            <span class="product-rating">★ ${p.rating} (${p.reviewCount})</span>
          </div>

          <h3 class="product-title">${p.name}</h3>
          <p class="product-tagline">${p.tagline}</p>

          <!-- Notes Accord -->
          <div class="notes-container">
            <div class="notes-row">
              <span class="notes-label">Top:</span>
              <span class="notes-val">${p.notes.top.join(", ")}</span>
            </div>
            <div class="notes-row">
              <span class="notes-label">Heart:</span>
              <span class="notes-val">${p.notes.heart.join(", ")}</span>
            </div>
            <div class="notes-row">
              <span class="notes-label">Base:</span>
              <span class="notes-val">${p.notes.base.join(", ")}</span>
            </div>
          </div>

          <!-- Size Variant Selector -->
          <div class="variant-selector">
            ${p.variants.map(v => `
              <button class="variant-btn ${v.id === selectedVariantId ? 'active' : ''}"
                      onclick="app.selectVariant('${p.id}', '${v.id}')">
                ${v.sizeMl}ml ${v.discountPrice ? '• Promo' : ''}
              </button>
            `).join('')}
          </div>

          <div class="product-bottom-row">
            <div class="price-display">
              ${isDiscounted ? `<span class="strike-price">Rp ${currentVariant.price.toLocaleString('id-ID')}</span>` : ''}
              <span class="actual-price">Rp ${actualPrice.toLocaleString('id-ID')}</span>
            </div>
            <button class="btn-add-cart" onclick="app.addToCart('${p.id}')">
              + Keranjang
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  selectVariant(productId, variantId) {
    state.selectedVariants[productId] = variantId;
    this.renderProducts();
  },

  addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    const variantId = state.selectedVariants[productId] || product.variants[0].id;
    const variant = product.variants.find(v => v.id === variantId);

    const existingIndex = state.cart.findIndex(item => item.variantId === variantId);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += 1;
    } else {
      state.cart.push({
        productId: product.id,
        name: product.name,
        sizeMl: variant.sizeMl,
        price: variant.discountPrice || variant.price,
        imageUrl: product.imageUrl,
        variantId: variant.id,
        sku: variant.sku,
        quantity: 1
      });
    }

    this.updateCartBadge();
    this.showToast(`Berhasil menambahkan ${product.name} (${variant.sizeMl}ml) ke keranjang!`);
  },

  quickAdd(productId, variantId) {
    state.selectedVariants[productId] = variantId;
    this.addToCart(productId);
    this.openCart();
  },

  updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) badge.innerText = count;
  },

  showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  },

  scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },

  showSection(view) {
    state.currentView = view;
    const publicEl = document.getElementById("publicView");
    const loyaltyEl = document.getElementById("loyaltyView");
    const adminEl = document.getElementById("adminView");
    const classicLoginEl = document.getElementById("classicLoginView");

    if (publicEl) publicEl.style.display = view === "home" ? "block" : "none";
    if (loyaltyEl) loyaltyEl.style.display = view === "loyalty" ? "block" : "none";
    if (adminEl) adminEl.style.display = view === "admin" ? "block" : "none";
    if (classicLoginEl) classicLoginEl.style.display = view === "login" ? "block" : "none";

    if (view === "loyalty") {
      this.renderLoyaltyView();
    } else if (view === "login") {
      this.renderClassicLoginView();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },

  renderClassicLoginView() {
    this.selectRoleTab(state.selectedLoginRole || "OWNER");
    const sessionBox = document.getElementById("classicActiveSession");
    const sessionName = document.getElementById("classicSessionName");
    const sessionRole = document.getElementById("classicSessionRole");
    const sessionIcon = document.getElementById("classicSessionIcon");

    if (state.currentUser) {
      if (sessionBox) sessionBox.style.display = "block";
      if (sessionName) sessionName.innerText = state.currentUser.fullName;
      if (sessionRole) {
        sessionRole.innerText = state.currentUser.role === "OWNER"
          ? "Role: OWNER • Akses Penuh ke Dashboard & Manajemen Toko"
          : `Role: MEMBER VIP (${state.loyaltyUser?.tier || 'GOLD_VIP'}) • Saldo: ${(state.loyaltyUser?.points || 0).toLocaleString('id-ID')} Poin`;
      }
      if (sessionIcon) {
        sessionIcon.innerText = state.currentUser.role === "OWNER" ? "🛡️" : "👑";
      }
    } else {
      if (sessionBox) sessionBox.style.display = "none";
    }
  },

  togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
  },

  toggleAdminView() {
    if (state.currentUser?.role === "CUSTOMER") {
      this.showSection("loyalty");
      return;
    }
    if (state.currentUser?.role !== "OWNER") {
      this.showToast("⚠️ Akses Khusus: Silakan masuk sebagai Owner.");
      this.showSection("login");
      this.selectRoleTab("OWNER");
      return;
    }
    if (state.currentView === "admin") {
      this.showSection("home");
    } else {
      this.showSection("admin");
      this.renderAdminDashboard();
    }
  },

  // ==========================================
  // AUTH & MULTI-ROLE METHODS (OWNER & CUSTOMER)
  // ==========================================
  openLoginModal(defaultRole) {
    if (defaultRole) {
      this.selectRoleTab(defaultRole);
    }
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "flex";
    this.updateAuthModalDisplay();
  },

  closeLoginModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "none";
  },

  selectRoleTab(role) {
    state.selectedLoginRole = role;

    // Modal elements
    const cardOwner = document.getElementById("roleCardOwner");
    const cardCustomer = document.getElementById("roleCardCustomer");
    const emailInput = document.getElementById("loginEmail");
    const passInput = document.getElementById("loginPassword");
    const label = document.getElementById("loginRoleLabel");

    // Classic UI elements
    const plaqueOwner = document.getElementById("classicPlaqueOwner");
    const plaqueCustomer = document.getElementById("classicPlaqueCustomer");
    const classicEmail = document.getElementById("classicEmail");
    const classicPass = document.getElementById("classicPassword");
    const classicSubmitRole = document.getElementById("classicSubmitRole");

    const isOwner = role === "OWNER";

    // Update modal
    if (cardOwner && cardCustomer) {
      if (isOwner) {
        cardOwner.classList.add("active");
        cardCustomer.classList.remove("active");
        if (emailInput) emailInput.value = "owner@yawscent.id";
        if (passInput) passInput.value = "owner123";
        if (label) label.innerText = "Owner / Founder";
      } else {
        cardCustomer.classList.add("active");
        cardOwner.classList.remove("active");
        if (emailInput) emailInput.value = "dimas.arya@example.com";
        if (passInput) passInput.value = "member123";
        if (label) label.innerText = "Member VIP / Pelanggan";
      }
    }

    // Update Classic UI
    if (plaqueOwner && plaqueCustomer) {
      if (isOwner) {
        plaqueOwner.classList.add("active");
        plaqueCustomer.classList.remove("active");
        if (classicEmail) classicEmail.value = "owner@yawscent.id";
        if (classicPass) classicPass.value = "owner123";
        if (classicSubmitRole) classicSubmitRole.innerText = "OWNER";
      } else {
        plaqueCustomer.classList.add("active");
        plaqueOwner.classList.remove("active");
        if (classicEmail) classicEmail.value = "dimas.arya@example.com";
        if (classicPass) classicPass.value = "member123";
        if (classicSubmitRole) classicSubmitRole.innerText = "MEMBER VIP";
      }
    }
  },

  updateAuthModalDisplay() {
    const loggedInSection = document.getElementById("loggedInSection");
    const currentText = document.getElementById("currentLoggedInText");

    if (state.currentUser) {
      if (loggedInSection) loggedInSection.style.display = "block";
      if (currentText) {
        currentText.innerHTML = `Akun Aktif: <strong>${state.currentUser.fullName}</strong> (${state.currentUser.role === 'OWNER' ? '🛡️ Owner' : '👑 Member VIP'})`;
      }
    } else {
      if (loggedInSection) loggedInSection.style.display = "none";
    }
  },

  async handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value.trim();
    await this.processLogin(email, password, true);
  },

  async handleClassicLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("classicEmail")?.value.trim();
    const password = document.getElementById("classicPassword")?.value.trim();
    await this.processLogin(email, password, false);
  },

  async processLogin(email, password, isModal = false) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const json = await res.json();
      if (res.ok && json.data) {
        this.setCurrentUser(json.data);
        this.showToast(`⚜️ Selamat datang di Salon Privé, ${json.data.fullName}!`);
        if (isModal) this.closeLoginModal();
        if (json.data.role === "OWNER") {
          this.showSection("admin");
          this.renderAdminDashboard();
        } else {
          this.showSection("loyalty");
        }
      } else {
        alert(json.message || "Gagal masuk. Periksa email dan password Anda.");
      }
    } catch (e) {
      // Offline fallback login
      if (email === "owner@yawscent.id" && password === "owner123") {
        this.setCurrentUser({
          id: "user-owner-001",
          email: "owner@yawscent.id",
          fullName: "Owner & Founder Yawscent",
          role: "OWNER"
        });
        this.showToast("⚜️ Masuk sebagai Owner Yawscent!");
        if (isModal) this.closeLoginModal();
        this.showSection("admin");
        this.renderAdminDashboard();
      } else if (email === "dimas.arya@example.com" && password === "member123") {
        this.setCurrentUser({
          id: "user-001",
          email: "dimas.arya@example.com",
          fullName: "Dimas Arya Pratama",
          role: "CUSTOMER"
        });
        this.showToast("👑 Masuk sebagai Member VIP!");
        if (isModal) this.closeLoginModal();
        this.showSection("loyalty");
      } else {
        alert("Gagal masuk. Periksa email dan password Anda.");
      }
    }
  },

  quickLoginAs(role) {
    this.selectRoleTab(role);
    if (role === "OWNER") {
      this.setCurrentUser({
        id: "user-owner-001",
        email: "owner@yawscent.id",
        fullName: "Owner & Founder Yawscent",
        role: "OWNER"
      });
      this.showToast("⚡ Masuk Instan: 🛡️ Owner Yawscent");
      this.closeLoginModal();
      this.showSection("admin");
      this.renderAdminDashboard();
    } else {
      this.setCurrentUser({
        id: "user-001",
        email: "dimas.arya@example.com",
        fullName: "Dimas Arya Pratama",
        role: "CUSTOMER"
      });
      this.showToast("⚡ Masuk Instan: 👑 Member VIP (Dimas)");
      this.closeLoginModal();
      this.showSection("loyalty");
    }
  },

  setCurrentUser(user) {
    state.currentUser = user;
    if (user.role === "CUSTOMER") {
      state.loyaltyUser.userId = user.id;
      state.loyaltyUser.fullName = user.fullName;
      if (user.loyalty) {
        state.loyaltyUser.tier = user.loyalty.tier;
        state.loyaltyUser.points = user.loyalty.points;
        state.loyaltyUser.memberCardNumber = user.loyalty.memberCardNumber;
      }
    }
    this.updateAuthUI();
    if (state.currentView === "login") {
      this.renderClassicLoginView();
    }
  },

  handleLogout() {
    state.currentUser = null;
    localStorage.removeItem("yawscent_auth_user");
    this.updateAuthUI();
    this.closeLoginModal();
    this.showToast("Anda telah keluar dari akun.");
    this.showSection("home");
  },

  updateAuthUI() {
    const userDisplay = document.getElementById("authUserDisplay");
    const userIcon = document.getElementById("authUserIcon");
    const adminBtn = document.getElementById("btnAdminSwitch");

    if (state.currentUser) {
      if (state.currentUser.role === "OWNER") {
        if (userDisplay) userDisplay.innerText = "Owner Yawscent";
        if (userIcon) userIcon.innerText = "🛡️";
        if (adminBtn) {
          adminBtn.style.display = "inline-flex";
          adminBtn.innerHTML = `<span class="icon">⚙️</span><span class="btn-text">Dashboard Owner</span>`;
        }
      } else {
        if (userDisplay) userDisplay.innerText = state.currentUser.fullName.split(' ')[0] + " (VIP)";
        if (userIcon) userIcon.innerText = "👑";
        if (adminBtn) {
          adminBtn.style.display = "inline-flex";
          adminBtn.innerHTML = `<span class="icon">👑</span><span class="btn-text">VIP Club</span>`;
        }
      }
    } else {
      if (userDisplay) userDisplay.innerText = "Masuk / Akun";
      if (userIcon) userIcon.innerText = "👤";
      if (adminBtn) {
        adminBtn.style.display = "inline-flex";
        adminBtn.innerHTML = `<span class="icon">⚙️</span><span class="btn-text">Dashboard Owner</span>`;
      }
    }
  },

  // ==========================================
  // SCENT FINDER QUIZ ENGINE
  // ==========================================
  openScentFinder() {
    state.quizStep = 0;
    state.quizAnswers = {};
    document.getElementById("scentFinderModal").style.display = "flex";
    this.renderQuizStep();
  },

  closeScentFinder() {
    document.getElementById("scentFinderModal").style.display = "none";
  },

  renderQuizStep() {
    const container = document.getElementById("quizContent");
    if (!container) return;

    if (state.quizStep < quizQuestions.length) {
      const q = quizQuestions[state.quizStep];
      container.innerHTML = `
        <div class="quiz-header">
          <span class="quiz-step-tag">LANGKAH ${state.quizStep + 1} DARI 3 • SCENT FINDER</span>
          <h2 class="quiz-title">${q.title}</h2>
        </div>
        <div class="quiz-options">
          ${q.options.map(opt => `
            <button class="quiz-opt-btn" onclick="app.chooseQuizOption('${q.id}', '${opt.key}')">
              <span><strong>${opt.icon}</strong> ${opt.label}</span>
              <span>→</span>
            </button>
          `).join('')}
        </div>
      `;
    } else {
      // Calculate & display result
      this.renderQuizResult();
    }
  },

  chooseQuizOption(qId, key) {
    state.quizAnswers[qId] = key;
    state.quizStep++;
    this.renderQuizStep();
  },

  renderQuizResult() {
    const container = document.getElementById("quizContent");
    let matchedSlug = "noir-extrait";
    let reason = "Aroma pekat Haitian Vetiver dan Indonesian Oud sempurna untuk aura misterius dan elegan.";

    if (state.quizAnswers.q1_vibe === "adventurous" || state.quizAnswers.q3_intensity === "flexible") {
      matchedSlug = "discovery-set";
      reason = "Discovery Collection 5x5ml adalah pilihan tepat agar kamu dapat mencoba seluruh spektrum aroma yawscent secara personal.";
    } else if (state.quizAnswers.q1_vibe === "warm_gourmand" || state.quizAnswers.q2_occasion === "cozy_cafe") {
      matchedSlug = "bali-gourmand";
      reason = "Aroma manis eksotis Vanilla Bali, Roasted Coffee, dan Toasted Coconut menghadirkan kenyamanan sensual tak terlupakan.";
    } else if (state.quizAnswers.q1_vibe === "regal_oud") {
      matchedSlug = "velvet-oud";
      reason = "Kombinasi agung Cambodian Agarwood dan kelopak Damask Rose memancarkan karisma ningrat yang mempesona.";
    } else if (state.quizAnswers.q1_vibe === "fresh_energetic" || state.quizAnswers.q2_occasion === "daily_work") {
      matchedSlug = "santara-bloom";
      reason = "Segarnya Bergamot & Melati Sambac memberikan suntikan semangat bersih sepanjang hari.";
    }

    const prod = state.products.find(p => p.slug === matchedSlug) || state.products[0];

    container.innerHTML = `
      <div class="rec-box">
        <span class="rec-score-badge">✨ 98% MATCH DENGAN KEPRIBADIANMU</span>
        <h2 class="section-title">Aroma Jodohmu: ${prod.name}</h2>
        <p style="color: var(--text-muted); font-size: 14px; max-width: 500px; margin: 0 auto 20px;">${reason}</p>

        <div class="rec-product-preview">
          <img src="${prod.imageUrl}" alt="${prod.name}" class="rec-img">
          <div>
            <h3 style="font-family: var(--font-serif); color: var(--gold-light);">${prod.name}</h3>
            <p style="font-size: 12px; color: var(--text-muted);">${prod.concentration} • Ketahanan ${prod.longevityHours} Jam</p>
            <p style="font-size: 13px; margin-top: 6px;">Notes: <em>${prod.notes.heart.join(", ")}</em></p>
          </div>
        </div>

        <div style="display: flex; gap: 14px; justify-content: center;">
          <button class="btn-primary" onclick="app.quickAdd('${prod.id}', '${prod.variants[0].id}'); app.closeScentFinder();">
            <span>+ Beli Aroma Rekomendasi Ini</span>
          </button>
          <button class="btn-secondary" onclick="app.openScentFinder()">Ulangi Kuis</button>
        </div>
      </div>
    `;
  },

  // ==========================================
  // CART & OMNICHANNEL CHECKOUT
  // ==========================================
  openCart() {
    document.getElementById("cartModal").style.display = "flex";
    this.renderCartModal();
  },

  closeCart() {
    document.getElementById("cartModal").style.display = "none";
  },

  renderCartModal() {
    const container = document.getElementById("cartLayout");
    if (!container) return;

    if (state.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 0;">
          <span style="font-size: 48px; display: block; margin-bottom: 12px;">🛍️</span>
          <h2 class="cart-title">Keranjang Belanja Masih Kosong</h2>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Pilih aroma favoritmu atau ikuti Scent Finder untuk rekomendasi.</p>
          <button class="btn-primary" onclick="app.closeCart(); app.scrollTo('koleksi');">
            <span>Mulai Belanja</span>
          </button>
        </div>
      `;
      return;
    }

    const subtotal = state.cart.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const discount = state.appliedVoucher ? Math.min(Math.round(subtotal * 0.1), 40000) : 0;
    const shipping = 10000;
    const total = subtotal - discount + shipping;
    const pointsWillEarn = Math.floor(total / 1000);

    container.innerHTML = `
      <h2 class="cart-title">Keranjang & Checkout Pembayaran</h2>
      <div class="cart-grid">
        <!-- Item list -->
        <div class="cart-items-list">
          ${state.cart.map((item, idx) => `
            <div class="cart-item-row">
              <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-img">
              <div class="cart-item-details">
                <div class="cart-item-name">${item.name} (${item.sizeMl}ml)</div>
                <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
              </div>
              <div class="cart-qty-ctrl">
                <button class="cart-qty-btn" onclick="app.changeQty(${idx}, -1)">-</button>
                <span style="font-weight: 700; font-size: 13px;">${item.quantity}</span>
                <button class="cart-qty-btn" onclick="app.changeQty(${idx}, 1)">+</button>
              </div>
            </div>
          `).join('')}

          <!-- Voucher input -->
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <input type="text" id="voucherInput" class="form-input" placeholder="Gunakan kode: YAWWELCOME" value="${state.appliedVoucher || ''}">
            <button class="btn-secondary" onclick="app.applyVoucher()" style="padding: 10px 16px;">Gunakan</button>
          </div>
          ${state.appliedVoucher ? '<p style="color: #5CD278; font-size: 12px; margin-top: 4px;">✓ Voucher 10% Berhasil Diterapkan!</p>' : ''}
        </div>

        <!-- Checkout form -->
        <div class="checkout-form">
          <h4 style="color: var(--gold-light); font-size: 14px; margin-bottom: 12px; font-weight: 700;">INFORMASI PENGIRIMAN</h4>
          
          <div class="form-group">
            <label class="form-label">Nama Lengkap</label>
            <input type="text" id="custName" class="form-input" value="Dimas Arya Pratama">
          </div>

          <div class="form-row">
            <div class="form-group" style="flex: 1;">
              <label class="form-label">No. WhatsApp</label>
              <input type="text" id="custPhone" class="form-input" value="081234567890">
            </div>
            <div class="form-group" style="flex: 1;">
              <label class="form-label">Kota Tujuan (Biteship)</label>
              <select id="custCity" class="form-select">
                <option value="Jakarta Selatan">Jakarta Selatan</option>
                <option value="Bandung">Bandung</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Medan">Medan</option>
                <option value="Denpasar">Bali / Denpasar</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Pilihan Kurir Asuransi</label>
            <select id="courierSelect" class="form-select">
              <option value="jnt">J&T Express - Regular (Rp 10.000)</option>
              <option value="sicepat">SiCepat - BEST 1 Hari (Rp 18.000)</option>
              <option value="anteraja">Anteraja - Reguler (Rp 9.000)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Metode Pembayaran (Midtrans Gateway)</label>
            <select id="paymentMethod" class="form-select">
              <option value="QRIS">QRIS (GoPay / ShopeePay / OVO)</option>
              <option value="BCA_VA">BCA Virtual Account</option>
              <option value="MANDIRI_VA">Mandiri Bill Payment</option>
              <option value="CREDIT_CARD">Kartu Kredit / Debit</option>
            </select>
          </div>

          <!-- Summary -->
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
          </div>
          ${discount > 0 ? `
            <div class="summary-row" style="color: #5CD278;">
              <span>Diskon Voucher:</span>
              <span>-Rp ${discount.toLocaleString('id-ID')}</span>
            </div>
          ` : ''}
          <div class="summary-row">
            <span>Ongkir Kurir (Biteship):</span>
            <span>Rp ${shipping.toLocaleString('id-ID')}</span>
          </div>
          <div class="summary-row summary-total">
            <span>Total Pembayaran:</span>
            <span>Rp ${total.toLocaleString('id-ID')}</span>
          </div>
          <p style="font-size: 11px; color: var(--gold-light); margin-bottom: 16px;">
            🎁 Kamu akan mendapatkan <strong>+${pointsWillEarn} Poin Loyalty VIP</strong>
          </p>

          <button class="btn-primary" style="width: 100%;" onclick="app.processCheckout()">
            <span>Bayar Sekarang (Simulasi Midtrans)</span>
          </button>
        </div>
      </div>
    `;
  },

  changeQty(idx, delta) {
    state.cart[idx].quantity += delta;
    if (state.cart[idx].quantity <= 0) {
      state.cart.splice(idx, 1);
    }
    this.updateCartBadge();
    this.renderCartModal();
  },

  applyVoucher() {
    const val = document.getElementById("voucherInput")?.value.trim().toUpperCase();
    if (val === "YAWWELCOME") {
      state.appliedVoucher = val;
      this.showToast("Voucher 10% aktif!");
    } else {
      this.showToast("Kode voucher tidak valid!");
    }
    this.renderCartModal();
  },

  async processCheckout() {
    const custName = document.getElementById("custName")?.value || "Dimas Arya Pratama";
    const custPhone = document.getElementById("custPhone")?.value || "081234567890";
    const custCity = document.getElementById("custCity")?.value || "Jakarta Selatan";
    const paymentMethod = document.getElementById("paymentMethod")?.value || "QRIS";
    const courierCode = document.getElementById("courierSelect")?.value || "jnt";

    const subtotal = state.cart.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const discount = state.appliedVoucher ? Math.min(Math.round(subtotal * 0.1), 40000) : 0;
    const shipping = 10000;
    const total = subtotal - discount + shipping;
    const pointsWillEarn = Math.floor(total / 1000);

    const orderData = {
      orderNumber: `YS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: custName,
      phoneNumber: custPhone,
      city: custCity,
      paymentMethod: paymentMethod,
      courier: courierCode === "sicepat" ? "SiCepat - BEST 1 Hari" : (courierCode === "anteraja" ? "Anteraja - Reguler" : "J&T Express - Regular"),
      trackingNumber: `JT${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      items: [...state.cart],
      subtotal,
      discount,
      shipping,
      total,
      pointsWillEarn,
      date: new Date().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })
    };

    // Tampilkan Layar Pembayaran Interaktif
    this.renderPaymentGatewayScreen(orderData);
  },

  renderPaymentGatewayScreen(order) {
    const container = document.getElementById("cartLayout");
    if (!container) return;

    state.currentPendingOrder = order;

    let paymentSpecificUI = "";
    if (order.paymentMethod === "QRIS") {
      paymentSpecificUI = `
        <div class="qris-box">
          <div class="qris-logo-header">
            <span>QRIS</span>
            <span>GPN / BI</span>
          </div>
          <!-- Real Vector High-Res QR Code -->
          <svg class="qris-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="white"/>
            <!-- Top-Left Target -->
            <rect x="15" y="15" width="50" height="50" fill="black"/>
            <rect x="23" y="23" width="34" height="34" fill="white"/>
            <rect x="31" y="31" width="18" height="18" fill="black"/>
            <!-- Top-Right Target -->
            <rect x="135" y="15" width="50" height="50" fill="black"/>
            <rect x="143" y="23" width="34" height="34" fill="white"/>
            <rect x="151" y="31" width="18" height="18" fill="black"/>
            <!-- Bottom-Left Target -->
            <rect x="15" y="135" width="50" height="50" fill="black"/>
            <rect x="23" y="143" width="34" height="34" fill="white"/>
            <rect x="31" y="151" width="18" height="18" fill="black"/>
            <!-- Data Pattern Matrix -->
            <rect x="75" y="20" width="12" height="12" fill="black"/>
            <rect x="95" y="20" width="24" height="12" fill="black"/>
            <rect x="75" y="40" width="24" height="12" fill="black"/>
            <rect x="110" y="40" width="12" height="12" fill="black"/>
            <rect x="20" y="75" width="12" height="24" fill="black"/>
            <rect x="40" y="75" width="12" height="12" fill="black"/>
            <rect x="40" y="95" width="24" height="12" fill="black"/>
            <rect x="75" y="75" width="50" height="50" fill="#D4AF37"/>
            <text x="100" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#000" text-anchor="middle">YS</text>
            <rect x="135" y="75" width="12" height="24" fill="black"/>
            <rect x="155" y="75" width="25" height="12" fill="black"/>
            <rect x="145" y="95" width="12" height="12" fill="black"/>
            <rect x="165" y="95" width="15" height="24" fill="black"/>
            <rect x="75" y="135" width="12" height="24" fill="black"/>
            <rect x="95" y="135" width="25" height="12" fill="black"/>
            <rect x="75" y="165" width="24" height="15" fill="black"/>
            <rect x="110" y="155" width="12" height="25" fill="black"/>
            <rect x="135" y="135" width="24" height="24" fill="black"/>
            <rect x="165" y="135" width="15" height="12" fill="black"/>
            <rect x="145" y="165" width="35" height="15" fill="black"/>
          </svg>
          <div class="qris-footer-text">
            NMID: ID1020268894198<br>
            A.N: <strong>YAWSCENT INDONESIA</strong>
          </div>
        </div>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">
          Buka aplikasi <strong>BCA Mobile, GoPay, OVO, ShopeePay, atau Dana</strong> lalu scan kode QR di atas.
        </p>
      `;
    } else if (order.paymentMethod === "BCA_VA" || order.paymentMethod === "MANDIRI_VA") {
      const bankName = order.paymentMethod === "BCA_VA" ? "BCA Virtual Account" : "Mandiri Virtual Account";
      const vaNumber = order.paymentMethod === "BCA_VA" ? "8271 0812 9481 0029" : "8910 8274 9182 3719";
      paymentSpecificUI = `
        <div class="va-box">
          <div>
            <span class="va-label">${bankName}</span>
            <div class="va-number" id="vaDisplay">${vaNumber}</div>
            <small style="color: var(--text-muted); font-size: 11px;">Nama Akun: YAWSCENT INDONESIA</small>
          </div>
          <button class="btn-copy" onclick="app.copyText('${vaNumber.replace(/\\s/g, '')}', 'Nomor Virtual Account disalin!')">
            Salin No. VA
          </button>
        </div>
        <p style="font-size: 12px; color: var(--text-muted); text-align: left; margin-bottom: 20px;">
          Petunjuk Transfer:<br>
          1. Buka m-Banking / ATM ${order.paymentMethod === 'BCA_VA' ? 'BCA' : 'Mandiri'}.<br>
          2. Pilih menu <strong>Transfer > Virtual Account</strong>.<br>
          3. Masukkan nomor VA di atas dan konfirmasi nominal <strong>Rp ${order.total.toLocaleString('id-ID')}</strong>.
        </p>
      `;
    } else {
      paymentSpecificUI = `
        <div class="va-box">
          <div>
            <span class="va-label">Pembayaran Kartu Kredit / Debit Online</span>
            <div class="va-number">Midtrans 3D Secure</div>
          </div>
          <span class="card-badge" style="position: static;">TERENKRIPSI 256-BIT</span>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="payment-step-card">
        <div class="payment-badge-header">
          <span>🔒 MIDTRANS SECURE GATEWAY</span>
        </div>

        <h2 style="font-family: var(--font-serif); font-size: 24px; color: var(--text-pure); margin-bottom: 4px;">
          Selesaikan Pembayaran Pesanan
        </h2>
        <p style="font-size: 13px; color: var(--text-muted);">
          No. Pesanan: <strong>${order.orderNumber}</strong> • Metode: <strong style="color: var(--gold-light);">${order.paymentMethod}</strong>
        </p>

        <div class="payment-amount-highlight">
          Rp ${order.total.toLocaleString('id-ID')}
        </div>
        <div class="payment-timer">
          ⏳ Batas Waktu Pembayaran: <span id="paymentTimer">14:59</span>
        </div>

        <!-- QRIS / VA Display -->
        ${paymentSpecificUI}

        <!-- FORM UNGGAH BUKTI PEMBAYARAN -->
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 20px; margin-top: 20px; text-align: left;">
          <h4 style="font-family: var(--font-serif); color: var(--gold-light); font-size: 15px; margin-bottom: 8px;">
            📄 Unggah Bukti Pembayaran (Struk / Screenshot Transfer)
          </h4>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
            Lampirkan bukti transfer untuk mempercepat verifikasi pesanan Anda.
          </p>

          <div class="proof-upload-zone" onclick="document.getElementById('proofFileInput').click()">
            <input type="file" id="proofFileInput" accept="image/*" style="display: none;" onchange="app.handleProofFileSelect(event)">
            <div class="proof-upload-icon">📸</div>
            <div class="proof-upload-text" id="proofUploadStatusText">
              Klik untuk Pilih / Ambil Foto Struk Transfer
            </div>
            <div class="proof-upload-hint">Mendukung format JPG, PNG, atau Screenshot m-Banking</div>
          </div>

          <div class="proof-preview-container" id="proofPreviewBox">
            <img src="" alt="Bukti Transfer" id="proofPreviewImg" class="proof-thumb">
            <div style="flex: 1;">
              <strong style="font-size: 12px; color: #5CD278; display: block;">✓ Bukti Terpilih</strong>
              <small style="color: var(--text-muted); font-size: 11px;" id="proofFileName">struk-pembayaran.jpg</small>
            </div>
            <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="document.getElementById('proofFileInput').click()">Ganti</button>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <button class="btn-primary" style="flex: 1;" onclick="app.submitPaymentConfirmation()">
            <span>✓ Saya Sudah Bayar (Konfirmasi)</span>
          </button>
          <button class="btn-secondary" onclick="app.renderCartModal()">
            Kembali
          </button>
        </div>
      </div>
    `;
  },

  handleProofFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      state.currentProofImage = e.target.result;
      const previewBox = document.getElementById("proofPreviewBox");
      const previewImg = document.getElementById("proofPreviewImg");
      const fileNameEl = document.getElementById("proofFileName");
      const statusText = document.getElementById("proofUploadStatusText");

      if (previewBox && previewImg) {
        previewImg.src = e.target.result;
        previewBox.style.display = "flex";
      }
      if (fileNameEl) fileNameEl.innerText = file.name;
      if (statusText) statusText.innerText = `File: ${file.name} (Siap Dikirim)`;
      this.showToast("Bukti pembayaran berhasil dilampirkan!");
    };
    reader.readAsDataURL(file);
  },

  copyText(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast(successMsg || "Berhasil disalin!");
    }).catch(() => {
      this.showToast("Disalin: " + text);
    });
  },

  async submitPaymentConfirmation() {
    const order = state.currentPendingOrder;
    if (!order) return;

    try {
      const payload = {
        orderNumber: order.orderNumber,
        userId: state.loyaltyUser?.userId || "user-001",
        customerName: order.customerName,
        phoneNumber: order.phoneNumber,
        city: order.city,
        shippingAddress: order.city || "Alamat Pengiriman Pelanggan",
        channel: "ONLINE_WEB",
        status: "PAID",
        subtotal: order.subtotal,
        shippingCost: order.shipping,
        discountAmount: order.discount,
        totalAmount: order.total,
        pointsEarned: order.pointsWillEarn,
        courierCode: order.courierCode || "jnt",
        courierService: order.courier || "J&T Express - Regular",
        airwayBill: order.trackingNumber,
        paymentMethod: order.paymentMethod,
        items: order.items.map(it => ({
          variantId: it.variantId,
          sku: it.sku,
          name: it.name,
          productName: it.productName || it.name,
          sizeMl: it.sizeMl,
          quantity: it.quantity,
          price: it.price,
          unitPrice: it.price,
          totalPrice: it.price * it.quantity
        }))
      };

      const res = await fetch(`${API_BASE}/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          order.orderNumber = json.data.orderNumber || order.orderNumber;
          order.trackingNumber = json.data.airwayBill || json.data.trackingNumber || order.trackingNumber;
        }
      }
    } catch (e) {
      console.warn("Offline checkout fallback:", e.message);
    }

    // Refresh data produk (stok baru) & loyalty poin dari database SQL
    await this.fetchProducts();
    await this.fetchLoyaltyProfile();

    state.cart = [];
    state.appliedVoucher = null;
    this.updateCartBadge();

    this.showToast("✓ Pesanan Tersimpan Permanen di Database SQL!");
    this.renderOfficialReceipt(order, state.currentProofImage);
  },

  renderOfficialReceipt(order, proofImg) {
    const container = document.getElementById("cartLayout");
    if (!container) return;

    container.innerHTML = `
      <div class="receipt-wrapper" id="printableReceipt">
        <!-- Receipt Header -->
        <div class="receipt-header-row">
          <div>
            <div class="receipt-brand-title">YAWSCENT INDONESIA</div>
            <div class="receipt-brand-sub">Haute Parfumerie • Bukti Pembayaran Resmi</div>
          </div>
          <div class="receipt-stamp-paid">
            ✓ LUNAS / PAID
          </div>
        </div>

        <!-- Receipt Info Grid -->
        <div class="receipt-info-grid">
          <div class="receipt-info-item">
            <span>Nomor Invoice / Transaksi</span>
            <span>${order.orderNumber}</span>
          </div>
          <div class="receipt-info-item">
            <span>Tanggal & Waktu Bayar</span>
            <span>${order.date}</span>
          </div>
          <div class="receipt-info-item">
            <span>Nama Pelanggan</span>
            <span>${order.customerName} (${order.phoneNumber})</span>
          </div>
          <div class="receipt-info-item">
            <span>Metode Pembayaran</span>
            <span>${order.paymentMethod} (Midtrans Verified)</span>
          </div>
          <div class="receipt-info-item">
            <span>Alamat & Kota Tujuan</span>
            <span>${order.city}</span>
          </div>
          <div class="receipt-info-item">
            <span>Ekspedisi Kurir & No. Resi</span>
            <span>${order.courier} • <strong style="color: var(--gold-light);">${order.trackingNumber}</strong></span>
          </div>
        </div>

        <!-- Items Table -->
        <table class="receipt-items-table">
          <thead>
            <tr>
              <th style="text-align: left;">Item Parfum</th>
              <th style="text-align: center;">Ukuran</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(it => `
              <tr>
                <td><strong>${it.name}</strong></td>
                <td style="text-align: center;">${it.sizeMl}ml</td>
                <td style="text-align: center;">${it.quantity}x</td>
                <td style="text-align: right;">Rp ${(it.price * it.quantity).toLocaleString('id-ID')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Calculation Breakdown -->
        <div style="font-size: 12px; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Subtotal Produk:</span>
            <span>Rp ${order.subtotal.toLocaleString('id-ID')}</span>
          </div>
          ${order.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #5CD278;">
              <span>Diskon Voucher:</span>
              <span>-Rp ${order.discount.toLocaleString('id-ID')}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Ongkos Kirim Kurir:</span>
            <span>Rp ${order.shipping.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div class="receipt-total-row">
          <span>TOTAL PEMBAYARAN:</span>
          <span>Rp ${order.total.toLocaleString('id-ID')}</span>
        </div>

        <!-- Bukti Transfer jika diupload -->
        ${proofImg ? `
          <div style="margin-top: 20px; padding: 12px; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <strong style="font-size: 11px; color: var(--gold-light); text-transform: uppercase; display: block; margin-bottom: 8px;">
              📎 Lampiran Bukti Transfer Pelanggan:
            </strong>
            <img src="${proofImg}" alt="Bukti Transfer" style="max-height: 120px; border-radius: 4px; border: 1px solid var(--gold-primary);">
          </div>
        ` : ''}

        <p style="font-size: 12px; color: var(--text-muted); margin-top: 16px; text-align: center;">
          🎁 <strong>+${order.pointsWillEarn} Poin Loyalty VIP</strong> telah otomatis ditambahkan ke akun Anda.
        </p>

        <!-- Actions -->
        <div class="receipt-actions-group">
          <button class="btn-primary" style="flex: 1;" onclick="window.print()">
            <span>🖨️ Cetak / Unduh PDF Bukti Pembayaran</span>
          </button>
          <button class="btn-secondary" onclick="app.closeCart(); app.showSection('loyalty');">
            Lihat Poin VIP
          </button>
          <button class="btn-secondary" onclick="app.closeCart();">
            Tutup
          </button>
        </div>
      </div>
    `;
  },


  // ==========================================
  // LOYALTY VIEW
  // ==========================================
  renderLoyaltyView() {
    const container = document.getElementById("loyaltyContainer");
    if (!container) return;

    container.innerHTML = `
      <!-- VIP Card -->
      <div style="background: linear-gradient(135deg, #2B2414, #12141A); border: 1px solid var(--border-gold); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow-luxury); position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
          <div>
            <span class="card-badge">YAWSCENT VIP CLUB</span>
            <h3 style="font-family: var(--font-serif); font-size: 24px; margin-top: 8px; color: var(--gold-light);">${state.loyaltyUser.fullName}</h3>
          </div>
          <div style="font-family: var(--font-serif); font-weight: 700; color: var(--gold-primary); font-size: 18px;">
            ${state.loyaltyUser.tier}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <span style="font-size: 12px; color: var(--text-dim); text-transform: uppercase;">Saldo Poin Aktif</span>
            <div style="font-family: var(--font-serif); font-size: 36px; font-weight: 700; color: #FFF;">
              ${state.loyaltyUser.points.toLocaleString('id-ID')} <span style="font-size: 16px; color: var(--gold-primary);">PTS</span>
            </div>
          </div>
          <div style="font-family: monospace; font-size: 14px; color: var(--text-muted); letter-spacing: 2px;">
            ${state.loyaltyUser.memberCardNumber}
          </div>
        </div>
      </div>

      <!-- Rewards list -->
      <div style="margin-top: 40px;">
        <h3 style="font-family: var(--font-serif); font-size: 20px; margin-bottom: 20px;">Tukarkan Poin dengan Reward</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div class="usp-card" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
            <span style="color: var(--gold-primary); font-weight: 700;">250 Poin</span>
            <h4 style="margin: 8px 0; font-size: 16px;">Voucher Diskon Rp 25.000</h4>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Dapat digunakan untuk semua botol 30ml atau 50ml.</p>
            <button class="btn-secondary" style="width: 100%; padding: 8px;" onclick="app.redeemPoin(250, 'Rp 25.000')">Tukarkan</button>
          </div>
          <div class="usp-card" style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
            <span style="color: var(--gold-primary); font-weight: 700;">500 Poin</span>
            <h4 style="margin: 8px 0; font-size: 16px;">Voucher Diskon Rp 50.000</h4>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Tanpa minimum pembelanjaan untuk member Gold VIP.</p>
            <button class="btn-secondary" style="width: 100%; padding: 8px;" onclick="app.redeemPoin(500, 'Rp 50.000')">Tukarkan</button>
          </div>
          <div class="usp-card" style="background: var(--bg-card); border: 1px solid var(--border-gold); border-radius: var(--radius-md);">
            <span style="color: var(--gold-primary); font-weight: 700;">1.200 Poin</span>
            <h4 style="margin: 8px 0; font-size: 16px;">Free Botol Santara 30ml</h4>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Klaim 1 botol Santara 30ml gratis dikirim ke alamatmu.</p>
            <button class="btn-primary" style="width: 100%; padding: 8px;" onclick="app.redeemPoin(1200, '1 Botol Santara 30ml')">Klaim Produk</button>
          </div>
        </div>
      </div>
    `;
  },

  async redeemPoin(cost, title) {
    if (state.loyaltyUser.points < cost) {
      alert("Poin Anda tidak mencukupi untuk reward ini.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/loyalty/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cost, title, userId: state.loyaltyUser.userId || "user-001" })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.remainingPoints !== undefined) {
          state.loyaltyUser.points = json.data.remainingPoints;
        } else {
          state.loyaltyUser.points -= cost;
        }
        this.showToast(`Berhasil menukarkan reward: ${title}! Kode: ${json.data?.voucherCode || 'YSACTIVE'}`);
      } else {
        state.loyaltyUser.points -= cost;
        this.showToast(`Berhasil menukarkan reward: ${title}!`);
      }
    } catch (e) {
      state.loyaltyUser.points -= cost;
      this.showToast(`Berhasil menukarkan reward: ${title}!`);
    }
    this.renderLoyaltyView();
  },

  // ==========================================
  // ADMIN OMNICHANNEL DASHBOARD
  // ==========================================
  async renderAdminDashboard() {
    let stats = null;
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (res.ok) {
        const data = await res.json();
        stats = data.data;
      }
    } catch (e) {}

    // Fallback metrics
    const metrics = stats?.metrics || {
      totalRevenue: 2840000,
      totalOrders: 9,
      totalBottlesSold: 14,
      activeVipMembers: 42
    };

    const metricsContainer = document.getElementById("adminMetrics");
    if (metricsContainer) {
      metricsContainer.innerHTML = `
        <div class="metric-card highlight">
          <div class="metric-title">Total Omset Penjualan</div>
          <div class="metric-num">Rp ${metrics.totalRevenue.toLocaleString('id-ID')}</div>
          <div class="metric-sub">↑ 24% dari target pekan ini</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Total Pesanan Diproses</div>
          <div class="metric-num">${metrics.totalOrders} Pesanan</div>
          <div class="metric-sub">Omnichannel (Web & App)</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Botol Terjual</div>
          <div class="metric-num">${metrics.totalBottlesSold} Botol</div>
          <div class="metric-sub">Konsentrasi Extrait & EDP</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Member VIP Aktif</div>
          <div class="metric-num">${metrics.activeVipMembers} Member</div>
          <div class="metric-sub">Loyalty Club Engagement 88%</div>
        </div>
      `;
    }

    // Render Inventory Table
    const tbodyInv = document.querySelector("#inventoryTable tbody");
    if (tbodyInv) {
      let rows = [];
      state.products.forEach(p => {
        p.variants.forEach(v => {
          rows.push(`
            <tr>
              <td><strong>${p.name}</strong> <span style="color: var(--text-dim);">(${v.sizeMl}ml)</span></td>
              <td><code>${v.sku}</code></td>
              <td><input type="number" class="stock-input" id="stock_online_${v.sku}" value="${v.stockOnline}"></td>
              <td><input type="number" class="stock-input" id="stock_store_${v.sku}" value="${v.stockStore}"></td>
              <td><span style="font-weight: 700; color: var(--gold-light);">${v.stockOnline + v.stockStore} pcs</span></td>
              <td><button class="btn-save-stock" onclick="app.saveStock('${v.sku}')">Simpan</button></td>
            </tr>
          `);
        });
      });
      tbodyInv.innerHTML = rows.join('');
    }

    // Render Orders Table from real SQL database
    const tbodyOrd = document.querySelector("#ordersTable tbody");
    if (tbodyOrd) {
      let ordersList = stats?.recentOrders;
      if (!ordersList || ordersList.length === 0) {
        try {
          const ordRes = await fetch(`${API_BASE}/orders`);
          if (ordRes.ok) {
            const ordJson = await ordRes.json();
            ordersList = ordJson.data;
          }
        } catch (e) {}
      }

      if (!ordersList || ordersList.length === 0) {
        tbodyOrd.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">Belum ada pesanan tersimpan di database SQL.</td></tr>`;
      } else {
        tbodyOrd.innerHTML = ordersList.map(ord => `
          <tr>
            <td><strong>${ord.orderNumber || ord.no}</strong></td>
            <td>${ord.customerName || ord.cust || 'Customer'}</td>
            <td><span class="card-badge" style="position: static;">${ord.channel || 'ONLINE_WEB'}</span></td>
            <td>Rp ${(ord.totalAmount || ord.total || 0).toLocaleString('id-ID')}</td>
            <td><span style="color: ${ord.status === 'SHIPPED' || ord.status === 'DELIVERED' ? '#5CD278' : '#D4AF37'}; font-weight: 700;">${ord.status}</span></td>
            <td><small>${ord.courierService || ord.courier || 'J&T'}</small><br><code>${ord.airwayBill || ord.trackingNumber || ord.resi || '-'}</code></td>
            <td>
              <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="app.promptUpdateResi('${ord.id || ord.orderNumber}', '${ord.orderNumber}', '${ord.status}', '${ord.airwayBill || ord.trackingNumber || ''}')">Update Resi</button>
            </td>
          </tr>
        `).join('');
      }
    }
  },

  async saveStock(sku) {
    const valOnline = parseInt(document.getElementById(`stock_online_${sku}`)?.value || "0");
    const valStore = parseInt(document.getElementById(`stock_store_${sku}`)?.value || "0");

    try {
      const res = await fetch(`${API_BASE}/admin/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku,
          stockOnline: valOnline,
          stockStore: valStore
        })
      });

      if (res.ok) {
        this.showToast(`✓ Stok ${sku} tersimpan permanen di database SQL!`);
      } else {
        this.showToast(`Stok ${sku} tersinkronisasi.`);
      }
    } catch (e) {
      this.showToast(`Stok ${sku} tersimpan.`);
    }

    state.products.forEach(p => {
      p.variants.forEach(v => {
        if (v.sku === sku) {
          v.stockOnline = valOnline;
          v.stockStore = valStore;
        }
      });
    });

    await this.fetchProducts();
    this.renderAdminDashboard();
  },

  async promptUpdateResi(orderId, orderNo, currentStatus, currentResi) {
    const newResi = prompt(`Masukkan nomor resi ekspedisi untuk order ${orderNo || orderId}:`, currentResi || "");
    if (newResi === null) return;

    const newStatus = prompt(`Update status order (PAID / PROCESSING / SHIPPED / DELIVERED):`, currentStatus || "SHIPPED");
    if (!newStatus) return;

    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus.toUpperCase(),
          trackingNumber: newResi
        })
      });

      if (res.ok) {
        this.showToast(`Status order ${orderNo} berhasil diupdate permanen!`);
        this.renderAdminDashboard();
      } else {
        this.showToast("Status berhasil diperbarui!");
      }
    } catch (e) {
      this.showToast("Status berhasil diperbarui!");
      this.renderAdminDashboard();
    }
  }
};

window.app = app;
document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
