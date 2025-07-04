document.addEventListener("DOMContentLoaded", () => {
    const t = document.querySelector(".cart-count"),
        e = JSON.parse(localStorage.getItem("shopswift_cart")) || {
            count: 0,
            items: []
        };
    t && (t.textContent = e.count)
});