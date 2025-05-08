// scripts/app.js

// Cache management
const CACHE_KEY = 'shopswift_products';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

// Check if cached data is available and valid
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

// Save data to cache
function setCachedProducts(data) {
    const cacheData = {
        data,
        timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

// Display products
function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
            <h3 class="title">${product.title}</h3>
            <div class="price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;

        productGrid.appendChild(card);
    });
}

// Cart functionality
let cartCount = 0;
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cartCount;
}

// Fetch and display products
function fetchProducts() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const productGrid = document.querySelector('.product-grid');

    // Check cache first
    const cachedProducts = getCachedProducts();
    if (cachedProducts) {
        loading.style.display = 'none';
        error.style.display = 'none';
        productGrid.style.display = 'grid';
        displayProducts(cachedProducts);
        return;
    }

    // Show loading state
    loading.style.display = 'block';
    error.style.display = 'none';
    productGrid.style.display = 'none';

    fetch('https://fakestoreapi.com/products')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            // Cache the response
            setCachedProducts(data);

            // Hide loading, show products
            loading.style.display = 'none';
            productGrid.style.display = 'grid';
            displayProducts(data);
        })
        .catch(() => {
            // Show error state
            loading.style.display = 'none';
            error.style.display = 'block';
            productGrid.style.display = 'none';
        });
}

// Initialize cart event listeners
function initializeCart() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            cartCount++;
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

// Mobile menu toggle
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Initialize hero CTA button
function initializeHeroCTA() {
    const ctaButton = document.querySelector('.hero-cta');
    ctaButton.addEventListener('click', () => {
        // Scroll to product grid
        document.querySelector('.product-grid').scrollIntoView({ behavior: 'smooth' });
    });
}

// Debounce search input (for future search functionality)
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
    initializeMobileMenu();
    initializeHeroCTA();

    // Re-attach event listeners after products are loaded
    const observer = new MutationObserver(() => {
        initializeCart();
    });
    observer.observe(document.querySelector('.product-grid'), { childList: true });
});