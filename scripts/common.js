document.addEventListener('DOMContentLoaded', () => {
  const cartCountElement = document.querySelector('.cart-count');
  const cart = JSON.parse(localStorage.getItem('shopswift_cart')) || { count: 0, items: [] };
  if (cartCountElement) {
    cartCountElement.textContent = cart.count;
  }
});
