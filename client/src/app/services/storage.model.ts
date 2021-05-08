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
  public parentId: number;
  public size?: string;
  public childrenId?: number[];

  constructor(id: number, name: string, path: string, type: StorageElementType, createdAt: Date, parentId: number, size?: string, childrenId?: number[]) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.type = type;
    this.createdAt = createdAt;
    this.parentId = parentId;
    this.size = size;
    this.childrenId = childrenId;
  }
}
