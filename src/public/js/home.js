const addToCart = (productId) => {
    const cartId = document.getElementById('currentCartId').value;

    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: 1 })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Producto agregado al carrito!');
            } else {
                alert('Error al agregar el producto al carrito.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al agregar el producto al carrito.');
        });
}
