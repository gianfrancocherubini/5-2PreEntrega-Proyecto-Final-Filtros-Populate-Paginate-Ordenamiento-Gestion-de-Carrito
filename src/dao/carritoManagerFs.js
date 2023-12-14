const fsPromises = require('fs');
const path = require('path');

class CarritoManager {
    constructor() {
        this.ruta = path.join(__dirname, '..', 'archivo', 'carrito.json');
    }

    async getCart() {
        if (fsPromises.existsSync(this.ruta)) {
            const data = await fsPromises.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(data);
        } else {
            return [];
        }
    }
    
    async saveCart(cart) {
        await fsPromises.promises.writeFile(this.ruta, JSON.stringify(cart, null, 2));
    }
    
}

module.exports = CarritoManager;