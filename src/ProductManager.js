import fs from 'fs';


export class ProductManager {
    constructor(path) {
        this.path = path;
        this.init();
    };

    //se crea un método que espere la carga de los productos al archivo
    async init() {
        await this.loadProductsFromFile();
    }

    //método que trae los productos desde el archivo
    async loadProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
            await fs.promises.writeFile(this.path, '[]');
        }
    }

    //método que agrega un producto nuevo
    async addProduct(title, description, price, code, stock, category, thumbnails = "", status = true) {

        //se crea un id autoincremental de forma automática
        let newId;
        if (!this.products.length) {
            newId = 1;
        } else {
            newId = this.products[this.products.length - 1].id + 1;
        };

        const newProduct = {
            id: newId,
            title: title.trim(),
            description: description.trim(),
            price: price,
            code: code.trim(),
            stock: stock,
            category: category.trim(),
            thumbnails: thumbnails ? thumbnails.trim() : "",
            status: status
        };

        //se verifica que ninguno de los campos esté vacío
        if (!title || !description || !price || !code || !stock || !category) {
            console.log('None of the mandatory properties can be empty');
            return;
        }

        //se verifica que el código de cada nuevo producto sea único y no se repita
        if (!this.products.some((elmnt) => elmnt.code == newProduct.code)) {
            this.products.push(newProduct);
            await this.saveProductsInFile();
        } else {
            console.log('Repeated code, try again');
        };

    };

    //método para obtener el listado total de productos
    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const array = JSON.parse(data);
            return array;
        } catch (error) {
            return this.products;
        }
    };

    //método para obtener un producto por su id
    async getProductById(id) {
        const array = await this.getProducts();
        this.products = array;
        const result = this.products.find((elmnt) => elmnt.id === id);

        //se comprueba que el producto con el id buscado exista
        if (result) {
            return result;
        } else {
            console.log('Not found');
        }
    };

    //método para guardar los productos en el archivo
    async saveProductsInFile() {
        const data = JSON.stringify(this.products);
        await fs.promises.writeFile(this.path, data);
    }

    //método para actualizar valores dentro de las propiedades de los productos
    async updateProduct(id, productUpdates) {
        const product = await this.getProductById(id);

        //se verifica que el id pasado exista dentro de los productos 
        if (!product) {
            console.log('Not found');
            return;
        }

        //se pasan los nuevos valores al producto
        Object.keys(productUpdates).forEach((key) => {
            product[key] = productUpdates[key];
        })

        try {
            this.saveProductsInFile();
        } catch (error) {
            console.log('Could not update file');
        }

    };

    //método para eliminar un producto según su id
    async deleteProduct(id) {
        try {
            this.products = await this.getProducts();
            const index = this.products.findIndex((prod) => prod.id === id);

            //se verifica que el producto exista, en caso de que no el método no debe continuar
            if (index === -1) {
                console.log("Product not found")
                return
            }
            this.products.splice(index, 1);
            this.saveProductsInFile();
            console.log('Product has been deleted')
        } catch (error) {
            console.log('Error deleting product');
        }

    };
};














