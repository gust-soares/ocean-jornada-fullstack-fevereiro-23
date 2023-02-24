const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require("cors");

//const DB_URL = 'mongodb://127.0.0.1:27017';
const DB_URL = 'mongodb+srv://admin:CbZYDqdxpo0DO1iE@cluster0.0szb2uc.mongodb.net';
const DB_NAME = 'ocean-jornada-fullstack-09-02-2023';

// conexao com o banco de dados
async function main() {
    console.log("Conectando ao banco de dados");
    const client = await MongoClient.connect(DB_URL);
    const db = client.db(DB_NAME);
    const collection = db.collection('items');
    console.log("Banco de Dados conectado");

    const app = express();

    app.use(cors());
    //o que vier no body da requiscao, esta em json
    app.use(express.json());

    // endpoint do helloworld
    app.get('/', (req, res) => {
        res.send('Hello World ');
    });

    // endpoint do ola mundo
    app.get('/oi', (req, res) => {
        res.send('Olá Mundo');
    });

    // Lista de infos
    const itens = ["Banana", "Maca", "Uva"];


    //endpoint de Read All -> [GET] /item
    app.get('/item', async (req, res) => {
        const documentos = await collection.find().toArray();
        res.send(documentos);
    });

    //endpoint read single by ID -> [GET] /item/:id
    app.get('/item/:id', async (req, res) => {
        const id = req.params.id;
        const item = await collection.findOne({ _id: new ObjectId(id) });
        res.send(item);
    });

    //endpoint create -> [POST] /item
    app.post('/item', async (req, res) => {
        // console.log(req.body);
        const item = req.body;
        await collection.insertOne(item);
        res.send(item);
    });

    // endpoint update -> [PUT] /item/:id
    app.put('/item/:id', async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: body });
        res.send(body);
    });

    // endpoint delete -> [DELETE] /item/:id
    app.delete('/item/:id', async (req, res) => {
        const id = req.params.id;
        await collection.deleteOne({ _id: new ObjectId(id) });
        res.send({ message: "Item removido com sucesso" });
    });

    //configurando porta
    const port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log("Servidor rodando na porta: " + port);
    });
}



main();