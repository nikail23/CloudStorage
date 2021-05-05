import { of } from "rxjs";
import { delay } from "rxjs/operators";

export class ProgressHelper {
  public isFileLoading: boolean;
  public loaded: number;
  public percent: number;
  public progressText: string;

  constructor() {
    this.isFileLoading = false;
    this.loaded = 0;
    this.percent = 0;
    this.progressText = 'Loading...';
  }

  public resetLoadingStats() {
    this.loaded = 0;
    this.percent = 0;
    this.progressText = 'Loading...';
  }

  public startFileLoading() {
    this.resetLoadingStats();
    this.isFileLoading = true;
  }

  public endFileLoading() {
    this.progressText = 'Done!';
    of(1)
      .pipe(delay(2000))
      .subscribe((value) => {
        this.isFileLoading = false;
      });
  }

  public updateLoadedAndPercent(loaded: number, percent: number) {
    this.loaded = loaded;
    this.percent = percent;
  }
}
