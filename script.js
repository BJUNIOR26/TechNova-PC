document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ESTADO GLOBAL ---
    let cart = JSON.parse(localStorage.getItem('techNovaCart')) || [];
    const ITEMS_PER_PAGE = 9;
    let currentPage = 1;
    let filteredProducts = [];

    // --- 2. CARGA DE COMPONENTES ---
    // (Ahora el HTML es estático para mejor SEO)

    // --- 3. REFERENCIAS DOM ---
    function getElements() {
        return {
            searchInput: document.getElementById('search-input'),
            filterCheckboxes: document.querySelectorAll('.filter-checkbox'),
            priceMinInput: document.getElementById('price-min'),
            priceMaxInput: document.getElementById('price-max'),
            productGrid: document.getElementById('product-grid'),
            featuredGrid: document.getElementById('featured-products-grid'),
            skeletonGrid: document.getElementById('skeleton-grid'),
            noResults: document.getElementById('no-results'),
            paginationControls: document.getElementById('pagination-controls'),
            pageNumbers: document.getElementById('page-numbers'),
            prevPageBtn: document.getElementById('prev-page'),
            nextPageBtn: document.getElementById('next-page'),
            visibleCountLabel: document.getElementById('visible-count'),
            productModal: document.getElementById('product-modal'),
            modalBackdrop: document.getElementById('modal-backdrop'),
            modalContent: document.getElementById('modal-content'),
            closeModalBtn: document.getElementById('close-modal'),
            modalAddCartBtn: document.getElementById('modal-add-cart'),
            cartSidebar: document.getElementById('cart-sidebar'),
            cartPanel: document.getElementById('cart-panel'),
            cartItemsContainer: document.getElementById('cart-items'),
            cartCountBadge: document.getElementById('cart-count'),
            mobileCartCountBadge: document.getElementById('mobile-cart-count'),
            cartTotalElement: document.getElementById('cart-total'),
            checkoutBtn: document.getElementById('checkout-btn'),
            checkoutModal: document.getElementById('checkout-modal'),
            checkoutContent: document.getElementById('checkout-content'),
            closeCheckout: document.getElementById('close-checkout'),
            paymentForm: document.getElementById('payment-form'),
            paymentSuccess: document.getElementById('payment-success'),
            orderIdSpan: document.getElementById('order-id'),
            mobileMenu: document.getElementById('mobile-menu'),
            contactForm: document.getElementById('contact-form')
        };
    }

    // --- 4. FUNCIONES GLOBALES ---
    window.toggleMobileMenu = () => {
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.toggle('hidden');
    };

    window.openCart = () => { 
        const c = getElements();
        if(c.cartSidebar) {
            c.cartSidebar.classList.remove('hidden'); 
            setTimeout(() => c.cartPanel.classList.remove('translate-x-full'), 10); 
        }
    };

    window.closeCart = () => { 
        const c = getElements();
        if(c.cartPanel) {
            c.cartPanel.classList.add('translate-x-full'); 
            setTimeout(() => c.cartSidebar.classList.add('hidden'), 300); 
        }
    };

    window.addToCart = (product) => {
        const exist = cart.find(i => i.id === product.id);
        if (exist) exist.quantity++;
        else cart.push({ ...product, quantity: 1 });
        saveCart(); 
        updateCartUI(); 
        window.openCart(); 
        showToast(`✅ ${product.name} añadido`);
        const cartIcons = [document.getElementById('cart-btn'), document.getElementById('mobile-cart-btn')];
        cartIcons.forEach(icon => {
            if (icon) { icon.classList.add('cart-animate'); setTimeout(() => icon.classList.remove('cart-animate'), 500); }
        });
    };

    window.removeFromCart = (id) => { cart = cart.filter(i => i.id !== id); saveCart(); updateCartUI(); };
    window.updateQuantity = (id, delta) => {
        const item = cart.find(i => i.id === id);
        if (item) { item.quantity += delta; if (item.quantity <= 0) window.removeFromCart(id); else { saveCart(); updateCartUI(); } }
    };

    window.openProductModalByData = (title) => {
        if (typeof products === 'undefined') return;
        const p = products.find(prod => prod.title === title);
        if (!p) return;
        const c = getElements();
        document.getElementById('modal-image').src = p.image;
        document.getElementById('modal-category').textContent = p.category;
        document.getElementById('modal-title').textContent = p.title;
        document.getElementById('modal-price').textContent = `$${p.price.toLocaleString()}`;
        document.getElementById('modal-description').textContent = p.description;
        const specs = document.getElementById('modal-specs');
        specs.innerHTML = p.specs.map(s => `<li><i class="fas fa-check text-cyan-400 mr-2 text-xs"></i>${s}</li>`).join('');
        c.productModal.classList.remove('hidden');
        setTimeout(() => c.modalContent.classList.remove('scale-95', 'opacity-0'), 10);
        
        // Actualizar URL sin recargar
        const slug = p.title.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
        const newUrl = `${window.location.pathname}?product=${slug}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        const close = () => { 
            c.modalContent.classList.add('scale-95', 'opacity-0'); 
            setTimeout(() => c.productModal.classList.add('hidden'), 300);
            // Limpiar URL al cerrar
            window.history.pushState({}, '', window.location.pathname);
        };
        c.closeModalBtn.onclick = close;
        c.modalBackdrop.onclick = close;
        c.modalAddCartBtn.onclick = () => { window.addToCart({id: p.title.toLowerCase().replace(/ /g, '-'), name: p.title.replace(/'/g, "'"), price: p.price, image: p.image}); close(); };
        const wsBtn = document.getElementById('modal-whatsapp-query');
        if (wsBtn) wsBtn.onclick = () => {
            const msg = `Hola! Me gustaría recibir más información sobre el producto: *${p.title}* que vi en su web.`;
            window.open(`https://wa.me/+51991231599?text=${encodeURIComponent(msg)}`, '_blank');
        };
    };

    window.closeCheckout = () => {
        const c = getElements();
        c.checkoutContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            c.checkoutModal.classList.add('hidden');
            c.paymentForm.classList.remove('hidden');
            c.paymentSuccess.classList.add('hidden');
        }, 300);
    };

    // --- 5. LÓGICA INTERNA ---
    function saveCart() { localStorage.setItem('techNovaCart', JSON.stringify(cart)); }

    function updateCartUI() {
        const c = getElements();
        const total = cart.reduce((s, i) => s + i.quantity, 0);
        [c.cartCountBadge, c.mobileCartCountBadge].forEach(b => { if(b) { b.textContent = total; b.classList.toggle('hidden', total === 0); } });
        if (c.cartItemsContainer) {
            c.cartItemsContainer.innerHTML = cart.length ? cart.map(i => `
                <div class="flex items-center justify-between bg-slate-700 p-4 rounded-lg">
                    <div class="flex items-center space-x-4">
                        <img src="${i.image}" class="w-16 h-16 object-cover rounded">
                        <div><h4 class="font-semibold text-sm text-white">${i.name}</h4><p class="text-cyan-400 font-bold">$${i.price}</p></div>
                    </div>
                    <div class="flex flex-col items-end space-y-2">
                        <button onclick="window.removeFromCart('${i.id}')" class="text-gray-400 hover:text-red-400"><i class="fas fa-trash-alt"></i></button>
                        <div class="flex items-center bg-slate-800 rounded"><button onclick="window.updateQuantity('${i.id}', -1)" class="px-2 py-1 text-gray-400">-</button><span class="px-2 text-sm text-white">${i.quantity}</span><button onclick="window.updateQuantity('${i.id}', 1)" class="px-2 py-1 text-gray-400">+</button></div>
                    </div>
                </div>`).join('') : '<p class="text-center text-gray-400 mt-10">Tu carrito está vacío</p>';
        }
        if (c.cartTotalElement) c.cartTotalElement.textContent = `$${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()}`;
    }

    function createProductCard(p) {
        const badgeHTML = p.badge ? `<span class="absolute top-2 right-2 badge-${p.badge} text-white px-2 py-1 rounded text-xs font-bold">${p.badgeText}</span>` : '';
        return `
        <div class="glass-card product-card">
            <div class="relative cursor-pointer product-trigger" onclick="window.openProductModalByData('${p.title.replace(/'/g, "'")}')">
                <img src="${p.image}" alt="${p.title}" class="product-image" loading="lazy">
                <span class="absolute top-2 left-2 bg-slate-700/80 text-white px-2 py-1 rounded text-xs font-semibold">${p.category}</span>
                ${badgeHTML}
                <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center group">
                    <span class="bg-white text-slate-900 px-4 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">Ver Detalles</span>
                </div>
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <h3 class="text-lg font-semibold mb-2">${p.title}</h3>
                <p class="text-gray-400 text-sm mb-3">${p.description.substring(0, 60)}...</p>
                <div class="flex justify-between items-center mt-auto">
                    <span class="text-xl font-bold text-cyan-400">$${p.price.toLocaleString()}</span>
                    <button onclick="window.addToCart({id: '${p.title.toLowerCase().replace(/ /g, '-')}', name: '${p.title.replace(/'/g, "'")}', price: ${p.price}, image: '${p.image}'})" class="add-to-cart-btn bg-slate-700 hover:bg-cyan-400 hover:text-slate-900 text-white p-2 rounded-full transition-all">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }

    window.updateProductDisplay = () => {
        const c = getElements();
        if (!c.productGrid) return;
        c.productGrid.classList.add('hidden');
        if (c.noResults) c.noResults.classList.add('hidden');
        if (c.skeletonGrid) c.skeletonGrid.classList.remove('hidden');
        if (c.paginationControls) c.paginationControls.classList.add('hidden');
        setTimeout(() => {
            if (typeof products === 'undefined') return;
            const search = c.searchInput?.value.toLowerCase() || '';
            const min = parseFloat(c.priceMinInput?.value) || 0;
            const max = parseFloat(c.priceMaxInput?.value) || Infinity;
            const cats = Array.from(c.filterCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
            filteredProducts = products.filter(p => {
                const matchesSearch = p.title.toLowerCase().includes(search);
                const matchesPrice = p.price >= min && p.price <= max;
                const matchesCat = cats.length === 0 || cats.some(cat => p.category.includes(cat));
                return matchesSearch && matchesPrice && matchesCat;
            });
            if (c.skeletonGrid) c.skeletonGrid.classList.add('hidden');
            if (filteredProducts.length === 0) {
                if (c.noResults) c.noResults.classList.remove('hidden');
            } else {
                c.productGrid.classList.remove('hidden');
                const start = (currentPage - 1) * ITEMS_PER_PAGE;
                const paginated = filteredProducts.slice(start, start + ITEMS_PER_PAGE);
                c.productGrid.innerHTML = paginated.map(p => createProductCard(p)).join('');
                const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
                if (c.paginationControls) {
                    c.paginationControls.classList.toggle('hidden', totalPages <= 1);
                    renderPagination(totalPages);
                }
            }
            if (c.visibleCountLabel) c.visibleCountLabel.textContent = filteredProducts.length;
        }, 400);
    };

    function renderFeaturedProducts() {
        const c = getElements();
        if (!c.featuredGrid || typeof products === 'undefined') return;
        const featured = products.filter(p => p.featured);
        c.featuredGrid.innerHTML = featured.map(p => createProductCard(p)).join('');
    }

    function renderPagination(total) {
        const container = document.getElementById('page-numbers');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 1; i <= total; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${i === currentPage ? 'bg-cyan-400 text-slate-900 shadow-lg' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`;
            btn.textContent = i;
            btn.onclick = () => { currentPage = i; window.updateProductDisplay(); window.scrollTo({top:0, behavior:'smooth'}); };
            container.appendChild(btn);
        }
        const prev = document.getElementById('prev-page');
        const next = document.getElementById('next-page');
        if(prev) prev.disabled = currentPage === 1;
        if(next) next.disabled = currentPage === total;
    }

    // --- 6. CHECKOUT ---
    function openCheckout() {
        const c = getElements();
        if (cart.length === 0) { showToast("⚠️ Tu carrito está vacío"); return; }
        window.closeCart();
        document.getElementById('checkout-total').textContent = c.cartTotalElement.textContent;
        c.checkoutModal.classList.remove('hidden');
        setTimeout(() => c.checkoutContent.classList.remove('scale-95', 'opacity-0'), 10);
    }

    // --- 7. EVENTOS Y UI ---
    function initEvents() {
        const c = getElements();
        if (c.checkoutBtn) c.checkoutBtn.addEventListener('click', openCheckout);
        if (c.closeCheckout) c.closeCheckout.addEventListener('click', window.closeCheckout);
        
        // Formulario de Contacto
        if (c.contactForm) {
            c.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = c.contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                
                // Deshabilitar botón y mostrar estado de carga
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
                
                // Simular envío a servidor
                setTimeout(() => {
                    showToast("✅ ¡Mensaje enviado con éxito!");
                    c.contactForm.reset();
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }, 2000);
            });
        }

        if (c.paymentForm) {
            c.paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = document.getElementById('pay-btn');
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                setTimeout(() => {
                    c.paymentForm.classList.add('hidden');
                    c.paymentSuccess.classList.remove('hidden');
                    c.orderIdSpan.textContent = '#' + Math.floor(1000 + Math.random() * 9000);
                    cart = []; saveCart(); updateCartUI();
                }, 2000);
            });
        }
        if (document.getElementById('current-year')) document.getElementById('current-year').textContent = new Date().getFullYear();
        if (c.closeCartBtn) c.closeCartBtn.addEventListener('click', window.closeCart);
        if (c.cartBackdrop) c.cartBackdrop.addEventListener('click', window.closeCart);
        window.addEventListener('scroll', () => {
            const btn = document.getElementById('back-to-top');
            if (btn) {
                if (window.scrollY > 300) btn.classList.remove('opacity-0', 'translate-y-10');
                else btn.classList.add('opacity-0', 'translate-y-10');
            }
        });
        document.getElementById('back-to-top')?.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        const themeBtn = document.getElementById('theme-toggle');
        themeBtn?.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-mode');
            const icon = document.getElementById('theme-icon');
            if(icon) { icon.classList.toggle('fa-moon', !isLight); icon.classList.toggle('fa-sun', isLight); }
            localStorage.setItem('techNovaTheme', isLight ? 'light' : 'dark');
        });
        if (localStorage.getItem('techNovaTheme') === 'light') {
            document.body.classList.add('light-mode');
            const icon = document.getElementById('theme-icon');
            if(icon) icon.classList.replace('fa-moon', 'fa-sun');
        }
        if (c.searchInput) c.searchInput.addEventListener('input', () => { currentPage = 1; window.updateProductDisplay(); });
        c.filterCheckboxes.forEach(cb => cb.addEventListener('change', () => { currentPage = 1; window.updateProductDisplay(); }));
        if (c.priceMinInput) c.priceMinInput.addEventListener('input', () => { currentPage = 1; window.updateProductDisplay(); });
        if (c.priceMaxInput) c.priceMaxInput.addEventListener('input', () => { currentPage = 1; window.updateProductDisplay(); });
        if (c.prevPageBtn) c.prevPageBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; window.updateProductDisplay(); window.scrollTo({top:0, behavior:'smooth'}); } });
        if (c.nextPageBtn) c.nextPageBtn.addEventListener('click', () => { 
            const total = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
            if (currentPage < total) { currentPage++; window.updateProductDisplay(); window.scrollTo({top:0, behavior:'smooth'}); } 
        });
        const revealObserver = new IntersectionObserver((entries) => { 
            entries.forEach(entry => { 
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    if (entry.target.id === 'stats-section') startCounters();
                } 
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.section-reveal').forEach(el => revealObserver.observe(el));
        const tw = document.getElementById('typewriter-text');
        if (tw) {
            const phrases = ["Tecnología de Punta", "Gráficos Increíbles", "Velocidad Extrema"];
            let pIdx = 0, cIdx = 0, isDel = false;
            const type = () => {
                const curr = phrases[pIdx];
                tw.textContent = isDel ? curr.substring(0, cIdx--) : curr.substring(0, cIdx++);
                if (!isDel && cIdx > curr.length) { isDel = true; setTimeout(type, 2000); }
                else if (isDel && cIdx < 0) { isDel = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(type, 500); }
                else setTimeout(type, isDel ? 50 : 100);
            };
            type();
        }
    }

    function startCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            if (counter.classList.contains('counted')) return;
            counter.classList.add('counted');
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const inc = target / 100;
            const update = () => {
                count += inc;
                if (count < target) { counter.innerText = Math.ceil(count); setTimeout(update, 20); }
                else counter.innerText = target;
            };
            update();
        });
    }

    function showToast(msg) {
        const t = document.getElementById('toast');
        if(!t) return;
        t.textContent = msg; t.classList.remove('hidden');
        setTimeout(() => { t.classList.remove('translate-y-20', 'opacity-0'); }, 10);
        setTimeout(() => { t.classList.add('translate-y-20', 'opacity-0'); setTimeout(() => t.classList.add('hidden'), 300); }, 3000);
    }

    function highlightActivePage() {
        const name = window.location.pathname.split("/").pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === name) {
                link.classList.remove('text-gray-300');
                link.classList.add('text-cyan-400', 'font-bold');
            }
        });
    }

    // --- 8. INICIO ---
    initEvents();
    updateCartUI();
    if (document.getElementById('product-grid')) window.updateProductDisplay();
    if (document.getElementById('featured-products-grid')) renderFeaturedProducts();
    highlightActivePage();

    // --- 9. DEEP LINKING (Enlaces Directos) ---
    // Verificar si hay un producto en la URL al cargar
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    if (productId && typeof products !== 'undefined') {
        const foundProduct = products.find(p => p.title.toLowerCase().replace(/ /g, '-').replace(/'/g, '') === productId);
        if (foundProduct) {
            // Pequeño retraso para asegurar que la UI esté lista
            setTimeout(() => window.openProductModalByData(foundProduct.title), 500);
        }
    }
});