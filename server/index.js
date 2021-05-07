class StorageElement {
  constructor(
    id,
    name,
    path,
    type,
    createdAt,
    size,
    children
  ) {
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
  constructor(storagePath) {
    this.storagePath = storagePath;
    this.storageList = [];
  }

  add(file) {
    const path = this.storagePath + file.name;

    const storageElement = new StorageElement(
      this.storageList.length,
      file.name,
      path,
      0,
      new Date(),
      file.size,
      []
    );

    this.storageList.push(storageElement);

    file.mv(path);
  }

  createFolder(name) {
    const path = this.storagePath + name;

    try 
    {
      fs.mkdirSync(path);

      const storageElement = new StorageElement(
        this.storageList.length,
        name,
        path,
        1,
        new Date(),
        undefined,
        []
      );
  
      this.storageList.push(storageElement);

      return true;
    }
    catch (error) 
    {
      return false
    }
  }

  delete(id) {
    const path = this.storageList[id].path;

    fs.unlinkSync(path);

    this.storageList.splice(id, 1);
  }

  getAll() {
    return this.storageList;
  }

  get(id) {
    return this.storageList[id];
  }
}

const storage = new StorageModel("./storage/");

const port = 3000;
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const bodyParser = require('body-parser');

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cors());

function setHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
}

app.post("/upload", (request, response) => {
  const file = request.files.UploadFile;

  storage.add(file);

  setHeaders(response);

  response.status(200).send();
});

app.get("/storage", (request, response) => {
  setHeaders(response);

  response.status(200).send(
    storage.getAll()
  );
});

app.get("/download", (request, response) => {
  const id = parseInt(request.query.id);
  const path = storage.get(id).path;
  const name = storage.get(id).name;

  setHeaders(response);

  response.download(path, name);
});

app.delete("/delete", (request, response) => {

  console.log(request.query);

  const id = parseInt(request.query.id);

  storage.delete(id);

  setHeaders(response);

  response.status(200).end();
});

app.post("/createFolder", (request, response) => {
  console.log(request.body);

  const name = request.body.name;

  setHeaders(response);

  if (storage.createFolder(name)) {
    response.status(200).end();
  } else {
    response.statusCode = 409;
    response.statusMessage = 'Folder already exists!';
    response.end();
  }
});


app.listen(port);