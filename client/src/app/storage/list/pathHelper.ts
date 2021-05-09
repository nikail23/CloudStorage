import { StorageService } from './../../services/storage.service';
export class PathHelper {
  public pathString: string = 'Root ';

  private path: number[];

  constructor(private storageService: StorageService) {
    this.path = [];
  }

  public push(id): void {
    this.path.push(id);

    this.setPathString();
  }

  public pop(): number {
    const result = this.path.pop();

    this.setPathString();

    return result;
  }

  public getLast(): number {
    let result = null;

    if (this.path.length > 0) {
      return this.path[this.path.length - 1];
    }

    return result;
  }

  public setPathString(): void {
    this.pathString = 'Root ';

    this.path.forEach(id => {
      this.storageService.get(id).subscribe((element) => {
        this.pathString = this.pathString + `/ ${element.name}`;
      });
    });
  }

  public getPath(): number[] {
    const result = [];

    this.path.forEach(id => {
      result.push(id);
    });

    return result;
  }
}
