const cartContainer = document.getElementById('cart-container');
const checkoutButton = document.getElementById('checkout');
let cart = JSON.parse(localStorage.getItem('shopswift_cart')) || { count: 0, items: [] };

function updateCartCount() {
  document.querySelector('.cart-count').textContent = cart.count;
}

function saveCart() {
  localStorage.setItem('shopswift_cart', JSON.stringify(cart));
}

function renderCart() {
  if (cart.items.length === 0) {
    cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
    checkoutButton.disabled = true;
    return;
  }
  checkoutButton.disabled = false;

  let total = 0;
  cartContainer.innerHTML = `
    <div class="grid gap-4">
      ${cart.items.map((item, index) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        total += parseFloat(itemTotal);
        return `
          <div class="flex flex-col md:flex-row items-center bg-white p-4 rounded shadow">
            <img src="${item.image}" alt="${item.title}" class="w-24 h-24 object-contain mb-2 md:mb-0 md:mr-4"/>
            <div class="flex-1">
              <h2 class="font-bold">${item.title}</h2>
              <p class="text-sm text-gray-600">Size: ${item.size}, Color: ${item.color}</p>
              <p class="font-semibold mt-1">$${item.price.toFixed(2)}</p>
            </div>
            <div class="flex items-center mt-2 md:mt-0">
              <button data-index="${index}" class="decrease bg-gray-300 px-2 py-1 rounded">−</button>
              <input value="${item.quantity}" readonly class="w-10 text-center mx-1 border"/>
              <button data-index="${index}" class="increase bg-gray-300 px-2 py-1 rounded">+</button>
            </div>
            <button data-index="${index}" class="remove text-red-500 ml-4">Remove</button>
          </div>
        `;
      }).join('')}
    </div>
    <div class="text-right font-bold text-xl mt-4">Total: $${total.toFixed(2)}</div>
  `;
}

cartContainer.addEventListener('click', e => {
  const index = e.target.dataset.index;
  if (e.target.classList.contains('increase')) {
    cart.items[index].quantity++;
    cart.count++;
  } else if (e.target.classList.contains('decrease')) {
    if (cart.items[index].quantity > 1) {
      cart.items[index].quantity--;
      cart.count--;
    }
  } else if (e.target.classList.contains('remove')) {
    cart.count -= cart.items[index].quantity;
    cart.items.splice(index, 1);
  }
  saveCart();
  updateCartCount();
  renderCart();
});

checkoutButton.addEventListener('click', () => {
  alert('Checkout not implemented in this demo.');
});

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();
});
