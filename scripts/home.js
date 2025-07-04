const productGrid = document.getElementById("product-grid"),
    loading = document.getElementById("loading"),
    error = document.getElementById("error"),
    cartCountElement = document.querySelector(".cart-count");

function loadCart() {
    const t = localStorage.getItem("shopswift_cart");
    return t ? JSON.parse(t) : {
        count: 0,
        items: []
    }
}
let cart = loadCart();

function saveCart(t) {
    localStorage.setItem("shopswift_cart", JSON.stringify(t))
}

function updateCartCount() {
    cartCountElement.textContent = cart.count
}

function fetchProducts() {
    loading.style.display = "block", error.style.display = "none", productGrid.innerHTML = "", fetch("https://fakestoreapi.com/products").then(t => t.json()).then(t => {
        loading.style.display = "none", t.forEach(t => {
            const e = document.createElement("div");
            e.className = "bg-white rounded shadow p-4 flex flex-col items-center", e.innerHTML = `<a href="product.html?id=${t.id}"><img src="${t.image}" alt="${t.title}" loading="lazy" class="w-32 h-32 object-contain mb-2 mx-auto"/></a><h2 class="text-sm font-semibold mb-2 text-center"><a href="product.html?id=${t.id}" class="hover:underline">${t.title}</a></h2><p class="font-bold text-base mb-2">$${t.price.toFixed(2)}</p><button data-id="${t.id}" class="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm">Add to Cart</button>`;
            const n = e.querySelector("button");
            n.addEventListener("click", () => {
                cart.count += 1, cart.items.push({
                    id: t.id,
                    quantity: 1
                }), saveCart(cart), updateCartCount(), n.textContent = "Added!", n.disabled = !0, setTimeout(() => {
                    n.textContent = "Add to Cart", n.disabled = !1
                }, 1e3)
            }), productGrid.appendChild(e)
        })
    }).catch(() => {
        loading.style.display = "none", error.style.display = "block"
    })
}
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts(), updateCartCount()
});