const { MongoClient, ServerApiVersion } = require('mongodb');
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
    try{
        await client.connect();
        console.log("database connected");
        const furnitureCollection = client.db("AzimWare").collection("furniture");
        
        app.get("/furnitures", async(req, res) => {
            const query = {};
            const cursor = furnitureCollection.find(query);
            const furnitures = await cursor.toArray();
            res.send(furnitures)
        })
    }
    
    finally{

    }
}
run().catch(console.dir)


app.get("/", (req, res) => {
    res.send("I am the home page of Azimuth Warehouse");
})

app.listen(port, () => {
    console.log("Listening to the port", port );
})