export enum StorageElementType {
  File,
  Folder
}

export class StorageElement {
  public id: number;
  public name: string;
  public path: string;
  public type: StorageElementType;
  public createdAt: Date;
  public size?: number;
  public children?: StorageElement[];

  constructor(id: number, name: string, path: string, type: StorageElementType, createdAt: Date, size?: number, children?: StorageElement[]) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.type = type;
    this.createdAt = createdAt;
    this.size = size;
    this.children = children;
  }
}
