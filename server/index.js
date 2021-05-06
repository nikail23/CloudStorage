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

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors());

app.post("/upload", (request, response) => {
  const file = request.files.UploadFile;

  storage.add(file);

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  response.status(200).send();
});

app.get("/storage", (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  response.status(200).send(
    storage.getAll()
  );
});

app.get("/download", (request, response) => {
  const id = parseInt(request.query.id);
  const path = storage.get(id).path;
  const name = storage.get(id).name;

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  response.download(path, name);
});

app.delete("/delete", (request, response) => {
  const id = parseInt(request.query.id);

  storage.delete(id);

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  response.status(200).end();
});

app.listen(port);