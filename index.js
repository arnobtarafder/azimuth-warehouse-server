const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k40me.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log("database connected");
        const furnitureCollection = client.db("AzimWare").collection("furniture");

        // GET ITEMS  
        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = furnitureCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })


        // FETCH A PRODUCT BY ID
        app.get("/products/:id", async(req, res) => {
            const productId = req.params.id;
            const query = {_id: ObjectId(productId)};
            const product = await furnitureCollection.findOne(query);
            res.send(product);
        })


        // QUANTITY UPDATE BY PUT
        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const deliveredProduct = req.body;
            console.log(deliveredProduct);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: deliveredProduct?.quantity
                },
            };
            const result = await furnitureCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        });

        // ADD ITEMS
        app.post("/products", async (req, res) => {
            const newProduct = req.body;
            const result = await furnitureCollection.insertOne(newProduct);
            res.send(result)
        })




    }

    finally {

    }
}
run().catch(console.dir)


app.get("/", (req, res) => {
    res.send("I am the home page of Azimuth Warehouse");
})

app.listen(port, () => {
    console.log("Listening to the port", port);
})