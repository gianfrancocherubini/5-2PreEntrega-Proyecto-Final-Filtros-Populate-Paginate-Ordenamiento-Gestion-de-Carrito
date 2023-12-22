const express = require('express');
const routerCarrito = require('./routes/carrito.router');
const { router } = require('./routes/products.router');
const {engine}=require('express-handlebars')
const path = require('path');
const mongoose =require(`mongoose`)

const PORT = 3014;
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/home', router)
app.use('/api/carts', routerCarrito)


const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const connectToDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://cherussa:chilindrina123@gianfrancocluster.km1jj9i.mongodb.net/?retryWrites=true&w=majority', { dbName: 'ecommerce' });
        console.log('DB online..!');
    } catch (error) {
        console.log(error.message);
    }
};

connectToDatabase();