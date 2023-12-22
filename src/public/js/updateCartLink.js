document.addEventListener('DOMContentLoaded', () => {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
        const cartLink = document.getElementById('cart-link');
        if (cartLink) {
            cartLink.href = `/cart/${cartId}`;
        }
    }
});