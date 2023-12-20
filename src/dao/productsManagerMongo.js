const ProductEsquema = require('./models/products.model');

class ProductsManager {
    
    async getProducts() {
        let products
        try {
            products = await ProductEsquema.find({deleted:false}).lean();
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



   
}

module.exports = ProductsManager;