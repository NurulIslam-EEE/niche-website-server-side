const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o0i8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('imperial-cars');
        const carsCollection = database.collection('cars');
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders');
        const reviewsCollection = database.collection('reviews');

        //add a product
        app.post('/addProduct', async (req, res) => {
            const user = req.body;
            const result = await carsCollection.insertOne(user)
            res.json(result)
        })

        //add review 
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.json(result)
        })

        //show review
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find({}).toArray();
            res.json(result)
            console.log(result);
        })

        //order 
        app.post('/booking', async (req, res) => {
            const user = req.body;
            const result = await ordersCollection.insertOne(user)
            res.json(result)
            console.log(result);
        })

        // add user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result)
            console.log(user);
        })

        //update user
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const option = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, option);
            res.json(result)
            console.log(result);
        })

        //make admin 
        app.put('/users/makeAdmin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            // const option = { upsert: true };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
            console.log(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const result = await usersCollection.findOne(filter);

            res.json(result)
        })

        //get user orders
        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const result = await ordersCollection.find(filter).toArray();
            res.json(result)
        })

        //delete user orders
        app.delete('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(filter);
            res.json(result)
        })

        //get all orders
        app.get('/manageOrders', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.json(result)
        })

        //update status
        app.put('/manageOrders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: { status: "Shipped" } };
            // const option = { upsert: true };
            const result = await ordersCollection.updateOne(filter, updateDoc);
            res.json(result)
            console.log(result)
        })

        //get all products
        app.get('/products', async (req, res) => {
            const result = await carsCollection.find({}).toArray();
            res.json(result)
        })

        //delete products
        app.delete('/manageProducts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await carsCollection.deleteOne(filter);
            console.log(result);
            res.json(result)
        })

        //booking 
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await carsCollection.findOne(filter);
            res.json(result)
        })
    }
    finally {
        // await client.close(); 
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Imperial!')
})

app.listen(port, () => {
    console.log(` listening at :${port}`)
})