const productDetail = document.getElementById('product-detail');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const cartCountElement = document.querySelector('.cart-count');

function loadCart() {
  const cart = localStorage.getItem('shopswift_cart');
  return cart ? JSON.parse(cart) : { count: 0, items: [] };
}
let cart = loadCart();

function saveCart(cart) {
  localStorage.setItem('shopswift_cart', JSON.stringify(cart));
}

function updateCartCount() {
  cartCountElement.textContent = cart.count;
}

function fetchProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId) {
    loading.style.display = 'none';
    error.style.display = 'block';
    return;
  }
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(product => {
      loading.style.display = 'none';
      displayProduct(product);
    })
    .catch(() => {
      loading.style.display = 'none';
      error.style.display = 'block';
    });
}

function displayProduct(product) {
  productDetail.innerHTML = `
    <div class="relative">
      <img src="${product.image}" alt="${product.title}" id="main-image" class="w-full h-auto object-contain rounded" />
      <div id="zoom-lens" class="hidden absolute border border-gray-400 bg-white opacity-50"></div>
    </div>
    <div class="flex flex-col">
      <h1 class="text-2xl font-bold mb-2">${product.title}</h1>
      <p class="text-gray-700 mb-4">${product.description}</p>
      <div class="mb-4 font-semibold text-xl">$<span id="price">${product.price.toFixed(2)}</span></div>

      <div class="mb-4 flex gap-2">
        <label class="font-medium">Size:</label>
        <select id="size" class="border rounded p-1">
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
        </select>
      </div>
      <div class="mb-4 flex gap-2">
        <label class="font-medium">Color:</label>
        <select id="color" class="border rounded p-1">
          <option value="Red">Red</option>
          <option value="Blue">Blue</option>
          <option value="Black">Black</option>
        </select>
      </div>
      <div class="mb-4 flex items-center gap-2">
        <button id="decrease" class="bg-gray-300 px-2 py-1 rounded">−</button>
        <input id="quantity" type="text" value="1" readonly class="w-12 text-center border"/>
        <button id="increase" class="bg-gray-300 px-2 py-1 rounded">+</button>
      </div>
      <button id="add-to-cart" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add to Cart</button>
      <div id="success" class="text-green-600 mt-2 hidden">Added to cart!</div>
    </div>
  `;

  const image = document.getElementById('main-image');
  const lens = document.getElementById('zoom-lens');
  const priceEl = document.getElementById('price');
  const size = document.getElementById('size');
  const color = document.getElementById('color');
  const quantity = document.getElementById('quantity');
  const decrease = document.getElementById('decrease');
  const increase = document.getElementById('increase');
  const addToCart = document.getElementById('add-to-cart');
  const success = document.getElementById('success');

  let qty = 1;
  let basePrice = product.price;

  function updatePrice() {
    let sizeMod = size.value === 'M' ? 2 : size.value === 'L' ? 5 : 0;
    let colorMod = color.value === 'Red' ? 1 : 0;
    priceEl.textContent = ((basePrice + sizeMod + colorMod) * qty).toFixed(2);
  }

  size.addEventListener('change', updatePrice);
  color.addEventListener('change', updatePrice);
  decrease.addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      quantity.value = qty;
      updatePrice();
    }
  });
  increase.addEventListener('click', () => {
    if (qty < 10) {
      qty++;
      quantity.value = qty;
      updatePrice();
    }
  });
  addToCart.addEventListener('click', () => {
  const selectedItem = {
    id: product.id,
    title: product.title,
    price: basePrice,
    size: size.value,
    color: color.value,
    quantity: qty,
    image: product.image
  };

  const existingIndex = cart.items.findIndex(item =>
    item.id === selectedItem.id &&
    item.size === selectedItem.size &&
    item.color === selectedItem.color
  );

  if (existingIndex !== -1) {
    cart.items[existingIndex].quantity += qty;
  } else {
    cart.items.push(selectedItem);
  }

  cart.count += qty;
  saveCart(cart);
  updateCartCount();

  success.classList.remove('hidden');
  setTimeout(() => success.classList.add('hidden'), 1000);
});


  image.addEventListener('mousemove', e => {
    lens.classList.remove('hidden');
    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left - lens.offsetWidth / 2;
    const y = e.clientY - rect.top - lens.offsetHeight / 2;
    lens.style.left = `${Math.max(0, Math.min(x, rect.width - lens.offsetWidth))}px`;
    lens.style.top = `${Math.max(0, Math.min(y, rect.height - lens.offsetHeight))}px`;
    lens.style.width = '100px';
    lens.style.height = '100px';
  });
  image.addEventListener('mouseleave', () => lens.classList.add('hidden'));

  updatePrice();
}

document.addEventListener('DOMContentLoaded', () => {
  fetchProduct();
  updateCartCount();
});
