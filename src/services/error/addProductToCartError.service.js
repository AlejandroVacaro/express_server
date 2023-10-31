export const addProductToCartError = (cartId, productId) => {
    return `
    Al menos uno de los parámetros ingresados no es válido:
    - ID del carrito: ${cartId}
    - ID del producto: ${productId}
    `;
};