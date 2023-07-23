const socket = io();

socket.on('productAdded', (updatedProducts) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    updatedProducts.forEach((product) => {
        const productItem = document.createElement('li');
        productItem.innerHTML = `
            <h2>${product.title}</h2>
            <p>ID: ${product.id}</p>
            <p>Descripción: ${product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Miniatura:${product.thumbnails}</p>
            <p>Código: ${product.code}</p>
            <p>Stock: ${product.stock}</p>
            <p>Estado: ${product.status}</p>
            <p>Categoría: ${product.category}</p>
          `;

        productList.appendChild(productItem);
    });
});

socket.on('productDeleted', (response) => {
    const updatedProducts = response.updatedProducts;
    productList.innerHTML = '';
    updatedProducts.forEach((product) => {
        const productItem = document.createElement('li');
        productItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>ID: ${product.id}</p>
        <p>Descripción: ${product.description}</p>
        <p>Precio: ${product.price}</p>
        <p>Miniatura:${product.thumbnails}</p>
        <p>Código: ${product.code}</p>
        <p>Stock: ${product.stock}</p>
        <p>Estado: ${product.status}</p>
        <p>Categoría: ${product.category}</p>
      `;

        productList.appendChild(productItem);
    });
});

document.getElementById('addForm').addEventListener('submit', event => {

    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const thumbnails = document.getElementById('thumbnails').value;
    const status = document.getElementById('status').value;

    fetch(`/api/products/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, price, code, stock, category, thumbnails, status }),
    })

        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});

document.getElementById('deleteForm').addEventListener('submit', event => {
    event.preventDefault();

    const id = document.getElementById('id').value;

    fetch(`/api/products/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});