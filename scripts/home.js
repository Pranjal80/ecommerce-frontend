const productGrid = document.getElementById('product-grid');
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

function fetchProducts() {
  loading.style.display = 'block';
  error.style.display = 'none';
  productGrid.innerHTML = '';

  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(products => {
      loading.style.display = 'none';
      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded shadow p-4 flex flex-col items-center';

        card.innerHTML = `
          <a href="product.html?id=${product.id}">
            <img src="${product.image}" alt="${product.title}" loading="lazy" class="w-32 h-32 object-contain mb-2 mx-auto"/>
          </a>
          <h2 class="text-sm font-semibold mb-2 text-center">
            <a href="product.html?id=${product.id}" class="hover:underline">${product.title}</a>
          </h2>
          <p class="font-bold text-base mb-2">$${product.price.toFixed(2)}</p>
          <button data-id="${product.id}" class="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm">Add to Cart</button>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
          cart.count += 1;
          cart.items.push({ id: product.id, quantity: 1 });
          saveCart(cart);
          updateCartCount();
          btn.textContent = 'Added!';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.disabled = false;
          }, 1000);
        });

        productGrid.appendChild(card);
      });
    })
    .catch(() => {
      loading.style.display = 'none';
      error.style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  updateCartCount();
});
