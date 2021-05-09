import { StorageElement } from './../../services/storage.model';

export class PathHelper {
  public pathString: string = 'Root ';

  private path: StorageElement[];

  constructor() {
    this.path = [];
  }

  public push(element: StorageElement): void {
    this.path.push(element);

    this.setPathString();
  }

  public pop(): StorageElement {
    const result = this.path.pop();

    this.setPathString();

    return result;
  }

  public getLast(): StorageElement {
    let result = null;

    if (this.path.length > 0) {
      return this.path[this.path.length - 1];
    }

    return result;
  }

  public setPathString(): void {
    this.pathString = 'Root ';

    this.path.forEach(element => {
      this.pathString = this.pathString + `/ ${element.name}`
    });
  }
}
