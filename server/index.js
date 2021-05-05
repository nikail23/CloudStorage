class StorageElement {
    constructor(id, name, path, type, createdAt, size, children) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.type = type;
        this.createdAt = createdAt;
        this.size = size;
        this.children = children;
    }
}

class StorageModel {
    storageList = [];

    constructor(storagePath) {

    }

    add(file) {

    }

    delete(id) {
        this.storageList.splice(id, 1);
    }
}

const storage = new StorageModel('./storage/');

const port = 3000;
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser());
app.use(express.json());
app.use(cors());

app.post('/upload', (request, response) => {
    const file = request.body;

    console.log(file);

    storage.add(file);

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    response.status(200).send();
});

app.listen(port);