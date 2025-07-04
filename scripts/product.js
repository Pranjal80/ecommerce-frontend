const productDetail = document.getElementById("product-detail"),
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

function fetchProduct() {
    const t = new URLSearchParams(window.location.search).get("id");
    if (!t) return loading.style.display = "none", void(error.style.display = "block");
    fetch(`https://fakestoreapi.com/products/${t}`).then(t => {
        if (!t.ok) throw new Error("Network error");
        return t.json()
    }).then(t => {
        loading.style.display = "none", displayProduct(t)
    }).catch(() => {
        loading.style.display = "none", error.style.display = "block"
    })
}

function displayProduct(t) {
    productDetail.innerHTML = `<div class="relative"><img src="${t.image}" alt="${t.title}" id="main-image" class="w-full h-auto object-contain rounded"/><div id="zoom-lens" class="hidden absolute border border-gray-400 bg-white opacity-50"></div></div><div class="flex flex-col"><h1 class="text-2xl font-bold mb-2">${t.title}</h1><p class="text-gray-700 mb-4">${t.description}</p><div class="mb-4 font-semibold text-xl">$<span id="price">${t.price.toFixed(2)}</span></div><div class="mb-4 flex gap-2"><label class="font-medium">Size:</label><select id="size" class="border rounded p-1"><option value="S">S</option><option value="M">M</option><option value="L">L</option></select></div><div class="mb-4 flex gap-2"><label class="font-medium">Color:</label><select id="color" class="border rounded p-1"><option value="Red">Red</option><option value="Blue">Blue</option><option value="Black">Black</option></select></div><div class="mb-4 flex items-center gap-2"><button id="decrease" class="bg-gray-300 px-2 py-1 rounded">−</button><input id="quantity" type="text" value="1" readonly class="w-12 text-center border"/><button id="increase" class="bg-gray-300 px-2 py-1 rounded">+</button></div><button id="add-to-cart" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add to Cart</button><div id="success" class="text-green-600 mt-2 hidden">Added to cart!</div></div>`;
    const e = document.getElementById("main-image"),
        n = document.getElementById("zoom-lens"),
        o = document.getElementById("price"),
        r = document.getElementById("size"),
        d = document.getElementById("color"),
        c = document.getElementById("quantity"),
        i = document.getElementById("decrease"),
        l = document.getElementById("increase"),
        a = document.getElementById("add-to-cart"),
        s = document.getElementById("success");
    let u = 1,
        m = t.price;

    function p() {
        let e = "M" === r.value ? 2 : "L" === r.value ? 5 : 0,
            n = "Red" === d.value ? 1 : 0;
        o.textContent = ((m + e + n) * u).toFixed(2)
    }
    r.addEventListener("change", p), d.addEventListener("change", p), i.addEventListener("click", () => {
        u > 1 && (u--, c.value = u, p())
    }), l.addEventListener("click", () => {
        u < 10 && (u++, c.value = u, p())
    }), a.addEventListener("click", () => {
        const e = {
                id: t.id,
                title: t.title,
                price: m,
                size: r.value,
                color: d.value,
                quantity: u,
                image: t.image
            },
            n = cart.items.findIndex(t => t.id === e.id && t.size === e.size && t.color === e.color); - 1 !== n ? cart.items[n].quantity += u : cart.items.push(e), cart.count += u, saveCart(cart), updateCartCount(), s.classList.remove("hidden"), setTimeout(() => s.classList.add("hidden"), 1e3)
    }), e.addEventListener("mousemove", t => {
        n.classList.remove("hidden");
        const o = e.getBoundingClientRect(),
            r = t.clientX - o.left - n.offsetWidth / 2,
            d = t.clientY - o.top - n.offsetHeight / 2;
        n.style.left = `${Math.max(0,Math.min(r,o.width-n.offsetWidth))}px`, n.style.top = `${Math.max(0,Math.min(d,o.height-n.offsetHeight))}px`, n.style.width = "100px", n.style.height = "100px"
    }), e.addEventListener("mouseleave", () => n.classList.add("hidden")), p()
}
document.addEventListener("DOMContentLoaded", () => {
    fetchProduct(), updateCartCount()
});