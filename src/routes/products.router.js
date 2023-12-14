const {Router}=require('express')
const ProductsManager = require('../dao/productsManagerMongo');
const productEsquema = require('../dao/models/products.model')
const productsManager =new ProductsManager()

const router=Router()
 
router.get('/', async (req, res) => {
    try {
        let limit = req.query.limit;
        let products = await productsManager.getProducts();

        if (!products || products.length === 0) {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('home',({ Products: [] }));
            return;
        }

        if (limit) {
            let limitedProducts = products.slice(0, parseInt(limit, 10));
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('home',({ Products: limitedProducts }));
            console.log(limitedProducts);
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('home',({ products }));
            console.log(products);
        }
    } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al obtener productos' });
    }

    
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;

        if (!productId) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: 'Se debe proporcionar un ID de producto válido.' });
            console.log('Se debe proporcionar un ID de producto válido.');
            return;
        }

        const product = await productsManager.getProductById(productId);

        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        }

        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('home',({ Product: product }));
    } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProductData = req.body;
        const requiredFields = ['title', 'description', 'price', 'thumbnails', 'code', 'stock', 'category'];
        for (const field of requiredFields) {
            if (!newProductData[field]) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
                return;
            }
        }

        const existingProducts = await productsManager.getProducts();
        const existingProduct = existingProducts.find(product => product.code === newProductData.code);

        if (existingProduct) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: `Ya existe un producto con el código '${newProductData.code}'.` });
            return;
        }

        await productsManager.saveProducts([newProductData]);
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ success: true, message: 'Producto agregado correctamente.', newProductData });
        console.log('Producto agregado:', newProductData);
    } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al agregar el producto.' });
    }
});

router.put('/:pid', async (req, res) => {
    try {

        const productId = req.params.pid;
        
        const existingProduct = await productsManager.getProductById(productId);

        if (!existingProduct) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        }

        if(req.body._id){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`No se puede modificar la porpiedad "_id"`});
        }

        const updateResult = await productEsquema.updateOne({ _id: productId }, { $set: req.body });
        if (updateResult.modifiedCount > 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ success: true, message: 'Modificación realizada.' });
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'No se concretó la modificación.' });
        }

    } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }

});

module.exports = {router} ;