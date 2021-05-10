class Storage {
  constructor(owner) {
    this.owner = owner;
    this.storageList = [];
  }
}

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

class User {
  constructor(id, login, password) {
    this.id = id;
    this.login = login;
    this.password = password;
  }
}

class UserModel {
  constructor() {
    this.users = [];
  }

  check(login) {
    let result = false;

    this.users.forEach(user => {
      if (user.login === login) {
        result = true;
      }
    });

    return result;
  }

  register(login, password) {
    if (!this.check(login)) {
      const newUser = new User(this.users.length, login, password);
      this.users.push(newUser);
      return true;
    }
    return false;
  }

  login(login, password) {
    let result = false;

    this.users.forEach(user => {
      if (user.login === login && user.password === password) {
        result = true;
      }
    });

    return result;
  }

  get(login) {
    let result = null;

    this.users.forEach(user => {
      if (user.login === login) {
        result = user;
      }
    });

    return result;
  }
}

class StorageModel {
  constructor(storagePath) {
    this.storagePath = storagePath;
    this.storages = [];
  }

  getStorage(userName) {
    let result = null;

    this.storages.forEach(storage => {
      if (storage.owner === userName) {
        result = storage;
      }
    });

    return result;
  }

  createStorage(userName) {
    const storage = new Storage(userName);
    this.storages.push(storage);

    try {
      fs.mkdirSync(this.storagePath + userName);
    }
    catch(error) {
      console.log(error);
    }

    return storage;
  }

  add(file, path, userName) {
    let storage = this.getStorage(userName);
    if (!storage) {
      storage = this.createStorage(userName);
    }

    let newPath;
    let lastElement;

    if (path.length > 0) {
      const lastElementId = path[path.length - 1]
      lastElement = this.get(lastElementId, storage.storageList);
      newPath = lastElement.path + `/` + file.name;
    } else {
      newPath = this.storagePath + `/${storage.owner}/` + file.name;
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
      storage.storageList.push(storageElement);
    }

    file.mv(newPath);
  }

  createFolder(name, path, userName) {
    let storage = this.getStorage(userName);
    if (!storage) {
      storage = this.createStorage(userName);
    }

    let newPath;
    let lastElement;

    if (path.length > 0) {
      const lastId = path[path.length - 1];
      lastElement = this.get(lastId, storage.storageList);
      newPath = lastElement.path + '/' + name;
    } else {
      newPath = this.storagePath + `${storage.owner}/` + name;
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
        storage.storageList.push(storageElement);
      }

      return true;
    }
    catch (error) 
    {
      return false
    }
  }

  delete(id, userName) {
    let storage = this.getStorage(userName);
    if (!storage) {
      storage = this.createStorage(userName);
    }

    const deletedElement = this.get(id, storage.storageList);

    switch (deletedElement.type) {
      case 0: fs.unlinkSync(deletedElement.path); break;
      case 1: rimraf.sync(deletedElement.path); break;
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
      storage.storageList.forEach((element, idx) => {
        if (element.id === id) {
          index = idx;
        }
      });
      storage.storageList.splice(index, 1);
    }
  }

  getAll(userName) {
    let storage = this.getStorage(userName);
    if (!storage) {
      storage = this.createStorage(userName);
    }
    return storage.storageList;
  }

  deepSearch(element, id) {
    let result = null;

    if (element.children) {
      for (let i = 0; i < element.children.length; i++) {
        if (result === null) {

          if (element.children[i].id === id) {
            result = element.children[i];
          }
    
          if (result === null && element.children[i].type === 1) {
            result = this.deepSearch(element.children[i], id);
          }
        }
      };
    }

    return result;
  }

  get(id, storageList) {
    let result = null;

    console.log(storageList)

    for (let i = 0; i < storageList.length; i++) {
      if (result === null) {
        if (storageList[i].id === id) {
          result = storageList[i];
        }
  
        if (result === null && storageList[i].type === 1) {
          result = this.deepSearch(storageList[i], id);
        }
      }
    };

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

const storages = new StorageModel("./storage/");
const users = new UserModel();
const idManager = new IdManager();

const port = 3000;
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const rimraf = require("rimraf");
const bodyParser = require('body-parser');
const archiver = require("archiver");
const path = require("path");


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

app.get("/register", (request, response) => {
  setHeaders(response);

  const login = request.query.login;
  const password = request.query.password;

  const result = users.register(login, password);
  if (result) {
    response.status(200).send(result);
  } else {
    response.statusCode = 409;
    response.statusMessage = "User with this login already exists!";
    response.send(result);
  }
});

app.get("/login", (request, response) => {
  setHeaders(response);

  const login = request.query.login;
  const password = request.query.password;

  const result = users.login(login, password);
  if (result) {
    response.status(200).send(JSON.stringify(
      {
        login
      }
    ));
  } else {
    response.statusCode = 404;
    response.statusMessage = "User with this values dont founded!";
    response.end();
  }
});

app.post("/upload", (request, response) => {
  const file = request.files.UploadFile;
  const path = JSON.parse(request.body.Path);
  const userName = JSON.parse(request.body.userName);

  storages.add(file, path, userName);

  setHeaders(response);

  response.status(200).send();
});

app.get("/get", (request, response) => {
  setHeaders(response);

  const id = parseInt(request.query.id);
  const userName = request.query.userName;

  console.log(userName);

  let storage = storages.getStorage(userName);
  if (!storage)  {
    storage = storages.createStorage(userName);
  }

  console.log(storage);

  const element = storages.get(id, storage.storageList);

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

  const userName = request.query.userName;

  const result = storages.getAll(userName).map((element) => {

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
  const userName = request.query.userName;

  let storage = storages.getStorage(userName);
  if (!storage)  {
    storage = storages.createStorage(userName);
  }

  const lastElement = storages.get(id, storage.storageList);
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
  const userName = request.query.userName;

  let storage = storages.getStorage(userName);

  if (!storage)  {
    storage = storages.createStorage(userName);
  }

  const element = storages.get(id, storage.storageList);

  setHeaders(response);

  if (element.type === 1) {
    const folderPath = path.join(__dirname, element.path);
    const zipName = `/${element.name}.zip`;

    response.attachment(zipName);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.on('end', function() {
      console.log('Archive wrote %d bytes', archive.pointer());
    });
    
    archive.on('error', function(err) {
      throw err;
    });

    archive.pipe(response);
    archive.directory(folderPath, false);
    archive.finalize();
  } else {
    response.download(element.path, element.name);
  }
});

app.delete("/delete", (request, response) => {
  const id = parseInt(request.query.id);
  const userName = request.query.userName;

  storages.delete(id, userName);

  setHeaders(response);

  response.status(200).end();
});

app.post("/createFolder", (request, response) => {
  const name = request.body.name;
  const path = request.body.path;
  const userName = request.body.userName;

  setHeaders(response);

  if (storages.createFolder(name, path, userName)) {
    response.status(200).end();
  } else {
    response.statusCode = 409;
    response.statusMessage = 'Folder already exists!';
    response.end();
  }
});


app.listen(port);