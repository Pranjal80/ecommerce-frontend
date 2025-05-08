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

const mockVariations = {
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Blue', 'Black'],
    availability: {
        'S': ['Red', 'Blue', 'Black'],
        'M': ['Red', 'Blue', 'Black'],
        'L': ['Blue', 'Black']
    },
    priceModifiers: {
        'S': 0,
        'M': 2,
        'L': 5,
        'Red': 1,
        'Blue': 0,
        'Black': 0
    }
};

function displayProduct(product) {
    const productDetail = document.getElementById('product-detail');
    productDetail.innerHTML = `
        <div class="product-detail-image-container">
            <img src="${product.image}" alt="${product.title}" class="product-detail-image" loading="lazy" />
            <div class="zoom-lens"></div>
            <div class="zoom-result"></div>
        </div>
        <div class="product-detail-info">
            <h1 class="product-detail-title">${product.title}</h1>
            <div class="product-detail-price" data-base-price="${product.price.toFixed(2)}">$${product.price.toFixed(2)}</div>
            <p class="product-detail-description">${product.description}</p>
            <div class="variations">
                <label for="size">Size:</label>
                <select id="size" name="size">
                    ${mockVariations.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                </select>
                <label for="color">Color:</label>
                <select id="color" name="color">
                    ${mockVariations.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                </select>
            </div>
            <div class="quantity-selector">
                <button id="decrease-quantity">-</button>
                <input type="text" id="quantity" value="1" readonly />
                <button id="increase-quantity">+</button>
            </div>
            <button class="product-detail-add-to-cart" data-id="${product.id}">Add to Cart</button>
            <div class="cart-success">Added to cart!</div>
        </div>
    `;
    initializeInteractiveFeatures(product);
}

let cart = loadCart();
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cart.count;
}

function fetchProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const productDetail = document.getElementById('product-detail');

    if (!productId) {
        loading.style.display = 'none';
        error.style.display = 'block';
        productDetail.style.display = 'none';
        return;
    }

    const cachedProducts = getCachedProducts();
    if (cachedProducts) {
        const product = cachedProducts.find(p => p.id == productId);
        if (product) {
            loading.style.display = 'none';
            error.style.display = 'none';
            productDetail.style.display = 'flex';
            displayProduct(product);
            return;
        }
    }

    loading.style.display = 'block';
    error.style.display = 'none';
    productDetail.style.display = 'none';

    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(product => {
            loading.style.display = 'none';
            productDetail.style.display = 'flex';
            displayProduct(product);
        })
        .catch(() => {
            loading.style.display = 'none';
            error.style.display = 'block';
            productDetail.style.display = 'none';
        });
}

function initializeInteractiveFeatures(product) {
    const imageContainer = document.querySelector('.product-detail-image-container');
    const image = document.querySelector('.product-detail-image');
    const lens = document.querySelector('.zoom-lens');
    const result = document.querySelector('.zoom-result');
    const sizeSelect = document.getElementById('size');
    const colorSelect = document.getElementById('color');
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const priceElement = document.querySelector('.product-detail-price');
    const addToCartBtn = document.querySelector('.product-detail-add-to-cart');
    const cartSuccess = document.querySelector('.cart-success');

    let basePrice = parseFloat(priceElement.dataset.basePrice);
    let quantity = parseInt(quantityInput.value);
    let isZoomActive = false;

    function updatePrice() {
        const size = sizeSelect.value;
        const color = colorSelect.value;
        let sizeModifier = mockVariations.priceModifiers[size] || 0;
        let colorModifier = mockVariations.priceModifiers[color] || 0;
        let totalPrice = (basePrice + sizeModifier + colorModifier) * quantity;
        priceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    function updateColorOptions() {
        const size = sizeSelect.value;
        const availableColors = mockVariations.availability[size];
        Array.from(colorSelect.options).forEach(option => {
            option.disabled = !availableColors.includes(option.value);
        });
        if (!availableColors.includes(colorSelect.value)) {
            colorSelect.value = availableColors[0];
        }
        updatePrice();
    }

    imageContainer.addEventListener('mouseenter', () => {
        lens.style.display = 'block';
        result.style.display = 'block';
        result.style.backgroundImage = `url(${image.src})`;
        const ratioX = result.offsetWidth / lens.offsetWidth;
        const ratioY = result.offsetHeight / lens.offsetHeight;
        result.style.backgroundSize = `${image.width * ratioX}px ${image.height * ratioY}px`;
    });

    imageContainer.addEventListener('mousemove', e => {
        const rect = image.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        x = Math.max(lens.offsetWidth / 2, Math.min(x, rect.width - lens.offsetWidth / 2));
        y = Math.max(lens.offsetHeight / 2, Math.min(y, rect.height - lens.offsetHeight / 2));
        lens.style.left = `${x - lens.offsetWidth / 2}px`;
        lens.style.top = `${y - lens.offsetHeight / 2}px`;
        const ratioX = result.offsetWidth / lens.offsetWidth;
        const ratioY = result.offsetHeight / lens.offsetHeight;
        result.style.backgroundPosition = `-${(x - lens.offsetWidth / 2) * ratioX}px -${(y - lens.offsetHeight / 2) * ratioY}px`;
    });

    imageContainer.addEventListener('mouseleave', () => {
        lens.style.display = 'none';
        result.style.display = 'none';
    });

    image.addEventListener('touchstart', () => {
        if (!isZoomActive) {
            lens.style.display = 'block';
            result.style.display = 'block';
            result.style.backgroundImage = `url(${image.src})`;
            const ratioX = result.offsetWidth / lens.offsetWidth;
            const ratioY = result.offsetHeight / lens.offsetHeight;
            result.style.backgroundSize = `${image.width * ratioX}px ${image.height * ratioY}px`;
            isZoomActive = true;
        } else {
            lens.style.display = 'none';
            result.style.display = 'none';
            isZoomActive = false;
        }
    });

    sizeSelect.addEventListener('change', () => {
        updateColorOptions();
    });

    colorSelect.addEventListener('change', updatePrice);

    decreaseBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            updatePrice();
        }
    });

    increaseBtn.addEventListener('click', () => {
        if (quantity < 10) {
            quantity++;
            quantityInput.value = quantity;
            updatePrice();
        }
    });

    addToCartBtn.addEventListener('click', () => {
        cart.count += quantity;
        cart.items.push({
            id: addToCartBtn.dataset.id,
            size: sizeSelect.value,
            color: colorSelect.value,
            quantity: quantity
        });
        saveCart(cart);
        updateCartCount();
        addToCartBtn.disabled = true;
        cartSuccess.style.display = 'block';
        setTimeout(() => {
            addToCartBtn.disabled = false;
            cartSuccess.style.display = 'none';
        }, 1000);
    });

    updateColorOptions();
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

document.addEventListener('DOMContentLoaded', () => {
    fetchProduct();
    updateCartCount();
    initializeMobileMenu();
});