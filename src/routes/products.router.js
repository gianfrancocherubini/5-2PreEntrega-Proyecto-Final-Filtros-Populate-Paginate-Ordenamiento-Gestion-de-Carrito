const {Router}=require('express')
const productEsquema = require('../dao/models/products.model')

const router=Router()
 
router.get('/', async (req, res) => {

    try {
        let page = parseInt(req.query.pagina) || 1;
        let limit = parseInt(req.query.limit) || 2;
        let category = req.query.category; 
        let query = {};

        if (category) {
            query.category = category;
        }
               
        let products = await productEsquema.paginate(query, { lean: true, limit, page });
        let { totalPages, hasNextPage, hasPrevPage, prevPage , nextPage} = products
        
        if (page > totalPages) {
            return res.redirect(`/home?pagina=${totalPages}${category ? `&category=${category}` : ''}`);
        }
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('home',{
            products: products.docs,
            totalPages: products.totalPages,
            hasNextPage: products.hasNextPage,
            hasPrevPage: products.hasPrevPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: page,
            currentCategory: category  // Asegúrate de pasar la categoría a la vista
        });
        console.log(products);
        
    } catch (err) {
        console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/category', async (req, res) => {
    try {
        let category = req.query.category
        if (!category) {
            // Si no se proporciona una categoría, redirigir a la página principal
            return res.redirect('/');
        } 
        let products = await productsEsquema.paginate({ category }, { lean: true })
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('home',{products: products.docs});
    }catch{
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Error al obtener productos' });
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

        const existingProducts = await productEsquema.findOne({ code: newProductData.code });
       
        if (existingProducts) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: `Ya existe un producto con el código '${newProductData.code}'.` });
            return;
        }

        await productEsquema.create(newProductData);
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

        // Buscar el producto existente por _id
        const existingProduct = await productEsquema.findById(productId);

        if (!existingProduct) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        // Verificar si la propiedad _id está presente en el cuerpo de la solicitud
        if ('_id' in req.body) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'No se puede modificar la propiedad "_id".' });
        }

        // Actualizar el producto utilizando findByIdAndUpdate
        const updateResult = await productEsquema.findByIdAndUpdate(productId, { $set: req.body });

        if (updateResult) {
            console.log('Producto actualizado:', updateResult);
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ success: true, message: 'Modificación realizada.' });
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'No se concretó la modificación.' });
        }
    } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});

module.exports = {router} ;