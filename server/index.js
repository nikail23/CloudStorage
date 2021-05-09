class StorageElement {
  constructor(
    id,
    name,
    path,
    type,
    createdAt,
    parent,
    size,
    children
  ) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.type = type;
    this.createdAt = createdAt;
    this.parent = parent;
    this.size = size;
    this.children = children;
  }
}

class StorageModel {
  constructor(storagePath) {
    this.storagePath = storagePath;
    this.storageList = [];
  }

  add(file, path) {
    let newPath;
    let lastElement;

    if (path.length > 0) {
      const lastElementId = path[path.length - 1]
      lastElement = this.get(lastElementId);
      newPath = lastElement.path + '/' + file.name;
    } else {
      newPath = this.storagePath + file.name;
    }

    const storageElement = new StorageElement(
      idManager.getNextId(),
      file.name,
      newPath,
      0,
      new Date(),
      undefined,
      file.size,
      []
    );

    if (lastElement) {
      lastElement.children.push(storageElement);
    } else {
      this.storageList.push(storageElement);
    }

    file.mv(newPath);
  }

  createFolder(name, path) {
    let newPath;
    let lastElement;

    if (path.length > 0) {
      const lastId = path[path.length - 1];
      lastElement = this.get(lastId);
      newPath = lastElement.path + '/' + name;
    } else {
      newPath = this.storagePath + name;
    }

    try 
    {
      fs.mkdirSync(newPath);

      const storageElement = new StorageElement(
        idManager.getNextId(),
        name,
        newPath,
        1,
        new Date(),
        undefined,
        undefined,
        []
      );
  
      if (lastElement) {
        lastElement.children.push(storageElement);
      } else {
        this.storageList.push(storageElement);
      }

      return true;
    }
    catch (error) 
    {
      return false
    }
  }

  delete(id) {
    const deletedElement = this.get(id);

    switch (deletedElement.type) {
      case 0: fs.unlinkSync(deletedElement.path); break;
      case 1: fs.rmdirSync(deletedElement.path); break;
    }

    this.storageList.splice(id, 1); // пофиксить удаление
  }

  getAll() {
    return this.storageList;
  }

  deepSearch(element, id) {
    let result = null;

    if (element.children) {
      element.children.forEach(child => {

        console.log(`deepSearch: текущий - ${child.name} с id  ${child.id}`);

        console.log(`id переданное = ${id}, c типом ${typeof id}`)
        console.log(`id ребенка = ${child.id}, c типом ${typeof child.id}`)

        if (child.id === id) {
          console.log('элемент найден');
          result = child;
          return;
        }
  
        if (!result && child.type === 1) {
          this.deepSearch(child, id);
        }
      });
    }

    return result;
  }

  get(id) {
    let result = null;

    console.log(JSON.stringify(this.storageList))
    
    console.log(`start, искомое id ${id}`);

    this.storageList.forEach(element => {

      console.log(`get: текущий - ${element.name} с id  ${element.id}`);

      if (element.id === id) {
        console.log('элемент найден')
        result = element;
      }

      if (!result && element.type === 1) {
        result = this.deepSearch(element, id);
      }
    });

    // console.log(`get: результат: ${result.name} с id ${result.id}`);

    return result;
  }
}

class IdManager {
  constructor() {
    this.lastId = -1;
  }

  getNextId() {
    this.lastId++;
    return this.lastId;
  }
}

const storage = new StorageModel("./storage/");
const idManager = new IdManager();

const port = 3000;
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const bodyParser = require('body-parser');
const path = require("path");
const { json } = require("body-parser");

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
  const path = JSON.parse(request.body.Path);

  storage.add(file, path);

  setHeaders(response);

  response.status(200).send();
});

app.get("/get", (request, response) => {
  setHeaders(response);

  const id = parseInt(request.query.id);

  const result = storage.get(id);

  response.status(200).send(result);
});

app.get("/storage", (request, response) => {
  setHeaders(response);

  const result = storage.getAll();

  response.status(200).send(result);
});

app.get("/children", (request, response) => {
  setHeaders(response);

  const id = parseInt(request.query.id);

  const lastElement = storage.get(id);
  const result = [];

  if (lastElement.children) {
    lastElement.children.forEach(element => {
      result.push(element);
    });
  }

  response.status(200).send(result);
});

app.get("/download", (request, response) => {
  const id = parseInt(request.query.id);
  const path = storage.get(id).path;
  const name = storage.get(id).name;

  setHeaders(response);

  response.download(path, name);
});

app.delete("/delete", (request, response) => {
  const id = parseInt(request.query.id);

  storage.delete(id);

  setHeaders(response);

  response.status(200).end();
});

app.post("/createFolder", (request, response) => {
  const name = request.body.name;
  const path = request.body.path;

  setHeaders(response);

  if (storage.createFolder(name, path)) {
    response.status(200).end();
  } else {
    response.statusCode = 409;
    response.statusMessage = 'Folder already exists!';
    response.end();
  }
});


app.listen(port);