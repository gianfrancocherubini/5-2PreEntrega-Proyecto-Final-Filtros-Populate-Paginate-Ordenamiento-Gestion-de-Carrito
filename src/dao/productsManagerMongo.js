const ProductEsquema = require('./models/products.model');

class ProductsManager {
    
    async getProducts() {
        try {
            const products = await ProductEsquema.find({deleted:false}).lean();
            return products;
        } catch (error) {
            console.log("No hay productos en la base de datos.");
            throw error;
        }
    }

    async saveProducts(products) {
        try {
            await ProductEsquema.insertMany(products);
        } catch (error) {
            console.error("Error al guardar productos:", error);
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            const product = await ProductEsquema.findOne({deleted:false, _id:productId}).lean();

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