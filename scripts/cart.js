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

function loadCart() {
    const cart = localStorage.getItem('shopswift_cart');
    return cart ? JSON.parse(cart) : { count: 0, items: [] };
}

function saveCart(cart) {
    localStorage.setItem('shopswift_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cart.count;
}

function displayCartItems(products, cart) {
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-button');
    cartItems.innerHTML = '';

    let total = 0;
    cart.items.forEach((item, index) => {
        const product = products.find(p => p.id == item.id);
        if (!product) return;

        const itemPrice = product.price * (item.quantity || 1);
        total += itemPrice;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="cart-item-image" loading="lazy" />
            <div class="cart-item-info">
                <h3 class="cart-item-title">${product.title}</h3>
                <div class="cart-item-variations">
                    ${item.size ? `Size: ${item.size}` : ''}
                    ${item.color ? `Color: ${item.color}` : ''}
                </div>
                <div class="cart-item-price">$${itemPrice.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-index="${index}">-</button>
                    <input type="text" value="${item.quantity || 1}" readonly />
                    <button class="increase-quantity" data-index="${index}">+</button>
                </div>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    checkoutButton.disabled = cart.items.length === 0;
}

function initializeCartInteractions(cart, products) {
    const cartItems = document.getElementById('cart-items');

    cartItems.addEventListener('click', e => {
        const target = e.target;
        const index = parseInt(target.dataset.index);

        if (target.classList.contains('decrease-quantity')) {
            if (cart.items[index].quantity > 1) {
                cart.items[index].quantity--;
                cart.count--;
                saveCart(cart);
                updateCartCount();
                displayCartItems(products, cart);
            }
        }

        if (target.classList.contains('increase-quantity')) {
            if (cart.items[index].quantity < 10) {
                cart.items[index].quantity++;
                cart.count++;
                saveCart(cart);
                updateCartCount();
                displayCartItems(products, cart);
            }
        }

        if (target.classList.contains('cart-item-remove')) {
            const removedQuantity = cart.items[index].quantity || 1;
            cart.count -= removedQuantity;
            cart.items.splice(index, 1);
            saveCart(cart);
            updateCartCount();
            displayCartItems(products, cart);
        }
    });
}

function fetchCartProducts() {
    const cart = loadCart();
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const cartContainer = document.querySelector('.cart-container');

    const cachedProducts = getCachedProducts();
    if (cachedProducts) {
        loading.style.display = 'none';
        error.style.display = 'none';
        cartContainer.style.display = 'block';
        displayCartItems(cachedProducts, cart);
        initializeCartInteractions(cart, cachedProducts);
        return;
    }

    loading.style.display = 'block';
    error.style.display = 'none';
    cartContainer.style.display = 'none';

    fetch('https://fakestoreapi.com/products')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(products => {
            loading.style.display = 'none';
            cartContainer.style.display = 'block';
            displayCartItems(products, cart);
            initializeCartInteractions(cart, products);
        })
        .catch(() => {
            loading.style.display = 'none';
            error.style.display = 'block';
            cartContainer.style.display = 'none';
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

function initializeCheckout() {
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCartProducts();
    updateCartCount();
    initializeMobileMenu();
    initializeCheckout();
});