export const createProductError = (productInfo) => {
    return `
    Al menos uno de los parámetros ingresados no es válido:
    -El título debe ser de tipo string, y el valor ingresado fue: ${productInfo.title}
    -La descripción debe ser de tipo string, y el valor ingresado fue: ${productInfo.description}
    -El precio debe ser de tipo numérico, y el valor ingresado fue: ${productInfo.price}
    -El código debe ser de tipo string, y el valor ingresado fue: ${productInfo.code}
    -El stock debe ser de tipo numérico, y el valor ingresado fue: ${productInfo.stock}
    -La categoría debe ser de tipo string, y el valor ingresado fue: ${productInfo.category}
    `;
};