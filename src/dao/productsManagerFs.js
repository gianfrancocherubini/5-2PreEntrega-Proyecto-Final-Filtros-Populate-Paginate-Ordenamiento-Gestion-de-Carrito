const fsPromises = require('fs');
const path = require('path');

class ProductsManager {
    constructor() {
        this.ruta = path.join(__dirname, '..', 'archivo', 'products.json');
    }

    async getProducts() {
        if (fsPromises.existsSync(this.ruta)) {
            const data = await fsPromises.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(data);
        } else {
            return [];
        }
    }

    async saveProducts(products) {
        try {
            await fsPromises.promises.writeFile(this.ruta, JSON.stringify(products, null, 2));
            
        } catch (error) {
            console.error("Error al guardar productos:", error);
            throw error; 
        }
    }
    
    async getProductById(id) {
        try {
            let productos = await this.getProducts();
            let product = productos.find(product => product.id === Number(id));

            if (product) {
                console.log("El producto encontrado es:", product);
                return product;
            } else {
                console.log("Producto no encontrado");
                return null;
            }
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
            throw error;
        }
    }
}

module.exports = ProductsManager;