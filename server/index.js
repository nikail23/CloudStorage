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
      null,
      file.size,
      []
    );

    if (lastElement) {
      lastElement.children.push(storageElement);
      storageElement.parent = lastElement;
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
        null,
        null,
        []
      );
  
      if (lastElement) {
        lastElement.children.push(storageElement);
        storageElement.parent = lastElement;
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

    deletedElement.children = null;
    const parent = deletedElement.parent;
    if (parent) {
      let index;
      parent.children.forEach((element, idx) => {
        if (element.id === id) {
          index = idx;
        }
      });
      parent.children.splice(index, 1);
    } else {
      let index;
      this.storageList.forEach((element, idx) => {
        if (element.id === id) {
          index = idx;
        }
      });
      this.storageList.splice(index, 1);
    }
  }

  getAll() {
    return this.storageList;
  }

  deepSearch(element, id) {
    let result = null;

    if (element.children) {
      for (let i = 0; i < element.children.length; i++) {
        if (result === null) {

          if (element.children[i].id === id) {
            result = element.children[i];
            console.log(`${result}`)
          }
    
          console.log(`${result}`)
          if (result === null && element.children[i].type === 1) {
            result = this.deepSearch(element.children[i], id);
          }
        }
        console.log(`${result}`)
      };
      console.log(`${result}`)
    }

    console.log(`${result}`)

    return result;
  }

  get(id) {
    let result = null;

    for (let i = 0; i < this.storageList.length; i++) {
      if (result === null) {
        if (this.storageList[i].id === id) {
          result = this.storageList[i];
        }
  
        if (result === null && this.storageList[i].type === 1) {
          result = this.deepSearch(this.storageList[i], id);
          console.log(`${result}`)
        }
        console.log(`${result}`)
      }
      console.log(`${result}`)
    };

    console.log(`итоговый результат ${result}`)

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

  const element = storage.get(id);
  console.log(`результат поиска: {
    id: ${element.id}
    name: ${element.name}
    path: ${element.name}
    type: ${element.type}
    children: ${element.children}
  }`)

  const children = [];
  if (element.children) {
    element.children.forEach(child => {
      children.push(child.id);
    });
  }

  const result = {
      id: element.id,
      name: element.name,
      size: element.size,
      createdAt: element.createdAt,
      type: element.type,
      children: children
  };

  response.status(200).send(result);
});

app.get("/storage", (request, response) => {
  setHeaders(response);

  const result = storage.getAll().map((element) => {

    const children = [];
    if (element.children) {
      element.children.forEach(child => {
        children.push(child.id);
      });
    }

    return {
      id: element.id,
      name: element.name,
      size: element.size,
      createdAt: element.createdAt,
      type: element.type,
      children: children
    }
  });

  response.status(200).send(result);
});

app.get("/children", (request, response) => {
  setHeaders(response);

  const id = parseInt(request.query.id);

  const lastElement = storage.get(id);
  let result = [];

  if (lastElement.children) {
    lastElement.children.forEach(element => {
      result.push(element);
    });
  }

  result = result.map((element) => {
    const children = [];
    if (element.children) {
      element.children.forEach(child => {
        children.push(child.id);
      });
    }

    return {
      id: element.id,
      name: element.name,
      size: element.size,
      createdAt: element.createdAt,
      type: element.type,
      children: children
    }
  });

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