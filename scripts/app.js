const CACHE_KEY = 'shopswift_products';
const CACHE_EXPIRY = 60 * 60 * 1000;

function getCachedProducts() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(CACHE_KEY);
        return null;
    }
    return data;
}

function setCachedProducts(data) {
    const cacheData = {
        data,
        timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

function loadCart() {
    const cart = localStorage.getItem('shopswift_cart');
    return cart ? JSON.parse(cart) : { count: 0, items: [] };
}

function saveCart(cart) {
    localStorage.setItem('shopswift_cart', JSON.stringify(cart));
}

function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <a href="product.html?id=${product.id}"><img src="${product.image}" alt="${product.title}" loading="lazy" /></a>
            <a href="product.html?id=${product.id}"><h3 class="title">${product.title}</h3></a>
            <div class="price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;

        productGrid.appendChild(card);
    });
}

let cart = loadCart();
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cart.count;
}

function fetchProducts() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const productGrid = document.querySelector('.product-grid');

    const cachedProducts = getCachedProducts();
    if (cachedProducts) {
        loading.style.display = 'none';
        error.style.display = 'none';
        productGrid.style.display = 'grid';
        displayProducts(cachedProducts);
        return;
    }

    loading.style.display = 'block';
    error.style.display = 'none';
    productGrid.style.display = 'none';

    fetch('https://fakestoreapi.com/products')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            setCachedProducts(data);
            loading.style.display = 'none';
            productGrid.style.display = 'grid';
            displayProducts(data);
        })
        .catch(() => {
            loading.style.display = 'none';
            error.style.display = 'block';
            productGrid.style.display = 'none';
        });
}

function initializeCart() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.id;
            const existingItem = cart.items.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
                cart.count++;
            } else {
                cart.items.push({ id: productId, quantity: 1 });
                cart.count++;
            }
            saveCart(cart);
            updateCartCount();
            btn.textContent = 'Added!';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Add to Cart';
                btn.disabled = false;
            }, 1000);
        });
    });
}

function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

function initializeHeroCTA() {
    const ctaButton = document.querySelector('.hero-cta');
    ctaButton.addEventListener('click', () => {
        document.querySelector('.product-grid').scrollIntoView({ behavior: 'smooth' });
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
    initializeMobileMenu();
    initializeHeroCTA();

    const observer = new MutationObserver(() => {
        initializeCart();
    });
    observer.observe(document.querySelector('.product-grid'), { childList: true });
});