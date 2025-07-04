const cartContainer = document.getElementById("cart-container"),
    checkoutButton = document.getElementById("checkout");
let cart = JSON.parse(localStorage.getItem("shopswift_cart")) || {
    count: 0,
    items: []
};

function updateCartCount() {
    document.querySelector(".cart-count").textContent = cart.count
}

function saveCart() {
    localStorage.setItem("shopswift_cart", JSON.stringify(cart))
}

function renderCart() {
    if (0 === cart.items.length) return cartContainer.innerHTML = "<p>Your cart is empty.</p>", void(checkoutButton.disabled = !0);
    checkoutButton.disabled = !1;
    let t = 0;
    cartContainer.innerHTML = `<div class="grid gap-4">${cart.items.map((e,n)=>{const o=(e.price*e.quantity).toFixed(2);return t+=parseFloat(o),`<div class="flex flex-col md:flex-row items-center bg-white p-4 rounded shadow"><img src="${e.image}" alt="${e.title}" class="w-24 h-24 object-contain mb-2 md:mb-0 md:mr-4"/><div class="flex-1"><h2 class="font-bold">${e.title}</h2><p class="text-sm text-gray-600">Size: ${e.size}, Color: ${e.color}</p><p class="font-semibold mt-1">$${e.price.toFixed(2)}</p></div><div class="flex items-center mt-2 md:mt-0"><button data-index="${n}" class="decrease bg-gray-300 px-2 py-1 rounded">−</button><input value="${e.quantity}" readonly class="w-10 text-center mx-1 border"/><button data-index="${n}" class="increase bg-gray-300 px-2 py-1 rounded">+</button></div><button data-index="${n}" class="remove text-red-500 ml-4">Remove</button></div>`}).join("")}</div><div class="text-right font-bold text-xl mt-4">Total: $${t.toFixed(2)}</div>`
}
cartContainer.addEventListener("click", t => {
    const e = t.target.dataset.index;
    t.target.classList.contains("increase") ? (cart.items[e].quantity++, cart.count++) : t.target.classList.contains("decrease") ? cart.items[e].quantity > 1 && (cart.items[e].quantity--, cart.count--) : t.target.classList.contains("remove") && (cart.count -= cart.items[e].quantity, cart.items.splice(e, 1)), saveCart(), updateCartCount(), renderCart()
}), checkoutButton.addEventListener("click", () => {
    alert("Checkout not implemented in this demo.")
}), document.addEventListener("DOMContentLoaded", () => {
    renderCart(), updateCartCount()
});