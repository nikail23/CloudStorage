import { StorageElement } from './../../services/storage.model';

export class PathHelper {
  private path: StorageElement[];

  constructor() {
    this.path = [];
  }

  public push(element: StorageElement): void {
    this.path.push(element);
  }

  public pop(): StorageElement {
    return this.path.pop();
  }

  public getLast(): StorageElement {
    let result = null;

    if (this.path.length > 0) {
      return this.path[this.path.length - 1];
    }

    return result;
  }
}
