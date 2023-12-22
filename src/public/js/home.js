document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            console.log('Add to cart button clicked for product:', this.getAttribute('data-product-id'));
            addToCart(this.getAttribute('data-product-id'));
        });
    });
});

const addToCart = async (productId) => {
    let cartId = localStorage.getItem('cartId');

    // Function to add product to cart
    const addProductToCart = async (cartId, productId) => {
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: 1 })
            });

            const data = await response.json();
            if (data.status === "success") {
                alert('Producto agregado al carrito!');
                window.location.reload();
            } else {
                console.error('Error adding product to cart:', data.message);
                alert('Error al agregar el producto al carrito.');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Error al agregar el producto al carrito.');
        }
    };

    if (!cartId) {
        console.log('No existing cart found. Creating a new cart.');
        try {
            const response = await fetch('/api/carts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('HTTP error when creating new cart:', response.status);
                throw new Error('Error al crear un nuevo carrito.');
            }

            const data = await response.json();
            if (data.status === "success") {
                cartId = data.data._id;
                console.log('Nuevo carrito creado:', cartId);
                localStorage.setItem('cartId', cartId);

                // Add the product to the newly created cart
                await addProductToCart(cartId, productId);
            } else {
                console.error('Error creating new cart:', data.message);
                alert('Error al crear un nuevo carrito.');
            }
        } catch (error) {
            console.error('Exception occurred while creating new cart:', error);
            alert('Error al crear un nuevo carrito.');
        }
    } else {
        // Add the product to the existing cart
        await addProductToCart(cartId, productId);
    }
};

